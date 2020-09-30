import firebase from "firebase"

const firebaseConfig = {
    apiKey: "AIzaSyDtZ---4UPN231iPjJdwjnfzIoiNDnQKpc",
    authDomain: "bicicletaria-43e74.firebaseapp.com",
    databaseURL: "https://bicicletaria-43e74.firebaseio.com",
    projectId: "bicicletaria-43e74",
    storageBucket: "bicicletaria-43e74.appspot.com",
    messagingSenderId: "292222360354",
    appId: "1:292222360354:web:d175c10cc4d8cea9ad237b",
    measurementId: "G-6CBGML9D8S"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

export const FB = firebase
export const FBDatabase = firebase.database()