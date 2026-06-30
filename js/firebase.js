import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";

import {
    getAuth
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

const firebaseConfig = {

    apiKey: "AIzaSyDSYgbh2BKi9JKfEYyfQH8lT96K7XMnxME",

    authDomain: "worktime-f692b.firebaseapp.com",

    projectId: "worktime-f692b",

    storageBucket: "worktime-f692b.firebasestorage.app",

    messagingSenderId: "834580491534",

    appId: "1:834580491534:web:b94a1b7c9e0170f4a6bb5f"

};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

export { auth };
