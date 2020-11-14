import firebase from "firebase"

const firebaseConfig = {
    apiKey: process.env.REACT_APP_apiKey,
    authDomain: process.env.REACT_APP_authDomain,
    databaseURL: process.env.REACT_APP_databaseURL,
    projectId: process.env.REACT_APP_projectId,
    storageBucket: process.env.REACT_APP_storageBucket,
    messagingSenderId: process.env.REACT_APP_messagingSenderId,
    appId: process.env.REACT_APP_appId,
    measurementId: process.env.REACT_APP_measurementId
};
// console.log('firebaseConfig', firebaseConfig)
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.firestore().enablePersistence()
firebase.analytics();

export const FB = firebase
export const FBDatabase = firebase.firestore()