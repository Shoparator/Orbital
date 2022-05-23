// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: "AIzaSyDwmjkww3Mobl1kH4gxFpo4jPq1JG01Kmk",
	authDomain: "orbital-shopa.firebaseapp.com",
	projectId: "orbital-shopa",
	storageBucket: "orbital-shopa.appspot.com",
	messagingSenderId: "772625584862",
	appId: "1:772625584862:web:9edcb26b93c6d5a7f6684f",
	measurementId: "G-K0SV904NW0",
};

// Initialize Firebase
// https://firebase.google.com/docs/web/setup
// https://docs.expo.dev/guides/using-firebase/
const app = initializeApp(firebaseConfig);

const auth = getAuth();
const db = getFirestore(app);

export { auth, db };
