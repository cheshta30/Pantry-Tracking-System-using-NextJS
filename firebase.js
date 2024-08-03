// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore} from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBLR4nzrb8lL1r5sQcwQUJTy53SZ3r0mCQ",
  authDomain: "pantry-tracker-system.firebaseapp.com",
  projectId: "pantry-tracker-system",
  storageBucket: "pantry-tracker-system.appspot.com",
  messagingSenderId: "1039514601890",
  appId: "1:1039514601890:web:ef8ff86064943f5be70afb",
  measurementId: "G-V4XVTBPRSS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app);

export{firestore}

// steps for firebase:
// go to firebase.google.com
// go to console
// create a project enter name

// add firebaase to your WebTransportDatagramDuplexStreamenter name  get teh code make a file called firebase.js paste the code
// build go to create database then simply just add test mode
// import { getFirestore} from "firebase/firestore";
// const firestore = getFirestore(app);

// export{firestore}