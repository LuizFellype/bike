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
    // apiKey: process.env.REACT_APP_apiKey,
    // authDomain: process.env.REACT_APP_authDomain,
    // databaseURL: process.env.REACT_APP_databaseURL,
    // projectId: process.env.REACT_APP_projectId,
    // storageBucket: process.env.REACT_APP_storageBucket,
    // messagingSenderId: process.env.REACT_APP_messagingSenderId,
    // appId: process.env.REACT_APP_appId,
    // measurementId: process.env.REACT_APP_measurementId
};
// console.log('firebaseConfig', firebaseConfig)
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.firestore().enablePersistence()
firebase.analytics();

export const FB = firebase
export const FBDatabase = firebase.firestore()