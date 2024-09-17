// Import Firebase SDK
import { initializeApp } from 'firebase/app';
import { getStorage, ref, getDownloadURL } from "firebase/storage";
// Firebase configuration (initialize Firebase app)

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "lsachatbot.firebaseapp.com",
    projectId: "lsachatbot",
    storageBucket: "lsachatbot.appspot.com",
    messagingSenderId: "817674467330",
    appId: "1:817674467330:web:a97a4b92bc7a8258308f1b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

// Get download URL
const modelRef1 = ref(storage, 'models/gallery.glb');

const modelRef2 = ref(storage, 'models/donut.glb');

// function to get the models url from firebase....
export async function getModel1Url(){
    const url = getDownloadURL(modelRef1)
    console.log(url);
    return (await url).toString;
} 

export async function getModel2Url(){
    const url = getDownloadURL(modelRef2)

    return (await url).toString;
} 