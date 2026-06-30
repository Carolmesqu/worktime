import {
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";
import { auth } from "./firebase.js";

const provider = new GoogleAuthProvider();

export async function login() {
    try {
        await signInWithPopup(auth, provider);
    } catch (error) {
        console.error("Código:", error.code);
        console.error("Mensagem:", error.message);
        console.error(error);
        alert(error.code);
    }
}

// Esta versão assíncrona usando o 'auth' local é a perfeita!
export async function logout() {
    try {
        await signOut(auth);
        console.log("Sessão encerrada com sucesso no Firebase.");
    } catch (error) {
        console.error("Erro ao deslogar:", error);
        throw error;
    }
}

export function checkLogin(callback){
    onAuthStateChanged(auth, callback);
}

export function getCurrentUser() {
    return auth.currentUser;
}