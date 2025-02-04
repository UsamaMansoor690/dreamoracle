import torch
import torch.nn as nn
from torch.autograd import Variable

import modelconfig as cfg  # Ensure you have your configuration here

# Utility functions
def conv3x3(in_channels, out_channels, stride=1):
    return nn.Conv2d(in_channels, out_channels, kernel_size=3, stride=stride, padding=1, bias=False)

def upBlock(in_channels, out_channels):
    block = nn.Sequential(
        nn.Upsample(scale_factor=2, mode='nearest'),
        conv3x3(in_channels, out_channels),
        nn.BatchNorm2d(out_channels),
        nn.ReLU(True)
    )
    return block

# CA_Net definition
class Ca_Net(nn.Module):
    def __init__(self):
        super(Ca_Net, self).__init__()
        self.t_dim = cfg.TEXT_DIMENSION
        self.c_dim = cfg.GAN_CONDITION_DIM
        self.fc = nn.Linear(self.t_dim, self.c_dim * 2, bias=True)
        self.relu = nn.ReLU()

    def encode(self, text):
        x = self.relu(self.fc(text))
        mu = x[:, :self.c_dim]
        logvar = x[:, self.c_dim:]
        return mu, logvar

    def reparametrize(self, mu, logvar):
        std = logvar.mul(0.5).exp_()
        eps = torch.FloatTensor(std.size()).normal_().to(mu.device)
        eps = Variable(eps)
        return eps.mul(std).add_(mu)

    def forward(self, text_embedding):
        mu, logvar = self.encode(text_embedding)
        c_code = self.reparametrize(mu, logvar)
        return c_code, mu, logvar

# Stage1_G definition
class Stage1_G(nn.Module):
    def __init__(self):
        super(Stage1_G, self).__init__()
        self.gf_dim = cfg.GAN_GF_DIM * 8
        self.ef_dim = cfg.GAN_CONDITION_DIM
        self.z_dim = cfg.Z_DIM
        self.define_module()

    def define_module(self):
        ninput = self.z_dim + self.ef_dim
        ngf = self.gf_dim

        self.ca_net = Ca_Net()

        self.fc = nn.Sequential(
            nn.Linear(ninput, ngf * 4 * 4, bias=False),
            nn.BatchNorm1d(ngf * 4 * 4),
            nn.ReLU(True)
        )

        self.upsample1 = upBlock(ngf, ngf // 2)
        self.upsample2 = upBlock(ngf // 2, ngf // 4)
        self.upsample3 = upBlock(ngf // 4, ngf // 8)
        self.upsample4 = upBlock(ngf // 8, ngf // 16)
        self.img = nn.Sequential(conv3x3(ngf // 16, 3), nn.Tanh())

    def forward(self, text, noise):
        c_code, mu, logvar = self.ca_net(text)
        z_c_code = torch.cat((noise, c_code), 1)
        h_code = self.fc(z_c_code)
        h_code = h_code.view(-1, self.gf_dim, 4, 4)
        h_code = self.upsample1(h_code)
        h_code = self.upsample2(h_code)
        h_code = self.upsample3(h_code)
        h_code = self.upsample4(h_code)
        fake_img = self.img(h_code)
        return fake_img, mu, logvar

# Stage2_G definition
class Stage2_G(nn.Module):
    def __init__(self, Stage1_G):
        super(Stage2_G, self).__init__()
        self.gf_dim = cfg.GAN_GF_DIM
        self.ef_dim = cfg.GAN_CONDITION_DIM
        self.z_dim = cfg.Z_DIM
        self.Stage1_G = Stage1_G

        for param in self.Stage1_G.parameters():
            param.requires_grad = False
        self.define_module()

    def _make_layer(self, block, channel_num):
        layers = []
        for i in range(cfg.GAN_R_NUM):
            layers.append(block(channel_num))
        return nn.Sequential(*layers)

    def define_module(self):
        ngf = self.gf_dim
        self.ca_net = Ca_Net()
        self.encoder = nn.Sequential(
            conv3x3(3, ngf),
            nn.ReLU(True),
            nn.Conv2d(ngf, ngf * 2, 4, 2, 1, bias=False),
            nn.BatchNorm2d(ngf * 2),
            nn.ReLU(True),
            nn.Conv2d(ngf * 2, ngf * 4, 4, 2, 1, bias=False),
            nn.BatchNorm2d(ngf * 4),
            nn.ReLU(True))
        self.hr_joint = nn.Sequential(
            conv3x3(self.ef_dim + ngf * 4, ngf * 4),
            nn.BatchNorm2d(ngf * 4),
            nn.ReLU(True)
        )
        self.residual = self._make_layer(ResBlock, ngf * 4)
        self.upsample1 = upBlock(ngf * 4, ngf * 2)
        self.upsample2 = upBlock(ngf * 2, ngf)
        self.upsample3 = upBlock(ngf, ngf // 2)
        self.upsample4 = upBlock(ngf // 2, ngf // 4)
        self.img = nn.Sequential(
            conv3x3(ngf // 4, 3),
            nn.Tanh())

    def forward(self, text, noise):
        stage1_img, _, _ = self.Stage1_G(text, noise)
        stage1_img = stage1_img.detach()
        encoded_img = self.encoder(stage1_img)

        c_code, mu, logvar = self.ca_net(text)
        c_code = c_code.view(-1, self.ef_dim, 1, 1)
        c_code = c_code.repeat(1, 1, 16, 16)
        i_c_code = torch.cat([encoded_img, c_code], 1)
        h_code = self.hr_joint(i_c_code)
        h_code = self.residual(h_code)

        h_code = self.upsample1(h_code)
        h_code = self.upsample2(h_code)
        h_code = self.upsample3(h_code)
        h_code = self.upsample4(h_code)

        fake_img = self.img(h_code)
        return fake_img

# Residual Block definition
class ResBlock(nn.Module):
    def __init__(self, channel_num):
        super(ResBlock, self).__init__()
        self.block = nn.Sequential(
            conv3x3(channel_num, channel_num),
            nn.BatchNorm2d(channel_num),
            nn.ReLU(True),
            conv3x3(channel_num, channel_num),
            nn.BatchNorm2d(channel_num))
        self.relu = nn.ReLU(inplace=True)

    def forward(self, x):
        residual = x
        out = self.block(x)
        out += residual
        out = self.relu(out)
        return out

