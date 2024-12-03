import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCyBRfQDFXjusN_aalebWPPIgsm5QWr9fg",
  authDomain: "oscar-afc2f.firebaseapp.com",
  databaseURL: "https://oscar-afc2f-default-rtdb.firebaseio.com",
  projectId: "oscar-afc2f",
  storageBucket: "oscar-afc2f.firebasestorage.app",
  messagingSenderId: "205663051008",
  appId: "1:205663051008:web:b7cfb775523d92895467e5",
  measurementId: "G-EQL8BZNDHX"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);