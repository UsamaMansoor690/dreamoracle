const express = require("express");
const app = express();
var cors = require("cors");
const PORT = 3001;

const stripe = require("stripe")(
  "sk_test_51PD5SZ07BrGXMIuFzQ0mQ6siobntcFdcgaoxNYt7Sv7qqBWDHKDHTAtd9N3XND1zPy88U4wXGsLGvYDSYl2VA7WM00iMgvthV9"
); // <-- change the key here

app.use(cors());
app.use(express.static("public"));
app.use(express.json());

// Create a Payment Intent (returns the client with a temporary secret)
app.post("/create-payment-intent", async (req, res) => {
  const { price } = req.body;

  const paymentIntent = await stripe.paymentIntents.create({
    amount: price,
    currency: "usd",
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});

app.listen(PORT, () => {
  console.log(`app is listening on port ~${PORT}`);
});
