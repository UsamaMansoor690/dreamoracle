import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBa_FszMhn-iFhefiaGgix_8wfZUl1sqZQ",
  authDomain: "dream-oracle-7d2d6.firebaseapp.com",
  projectId: "dream-oracle-7d2d6",
  storageBucket: "dream-oracle-7d2d6.appspot.com",
  messagingSenderId: "348471731437",
  appId: "1:348471731437:web:70a5e9cbd9a99e6e4f58e4",
  measurementId: "G-N89197CX0L",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

const provider = new GoogleAuthProvider();

export const signInWithGoogle = () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      const name = result.user.displayName;
      const email = result.user.email;
      const profilePic = result.user.photoURL;

      localStorage.setItem("name", name);
      localStorage.setItem("email", email);
      localStorage.setItem("profilePic", profilePic);
    })
    .catch((error) => {
      console.error(error);
    });
};

export const signout = () => {
  signOut(auth)
    .then(() => {
      localStorage.removeItem("name");
      localStorage.removeItem("email");
      localStorage.removeItem("profilePic");
      alert("Signed Out");
    })
    .catch((error) => {
      console.error(error);
    });
};
