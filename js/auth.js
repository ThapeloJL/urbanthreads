import { auth } from "./firebaseConfig.js";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

export async function signUp(name , email , password){
    const cred = await createUserWithEmailAndPassword(auth , email , password);
    if(name) await updateProfile (cred.user, {displayName : name})
    return cred.user
}

export async function logIn(email , password) {
    const cred = await signInWithEmailAndPassword(auth , email , password);
    return cred.user
}

export function logOut () {
    return signOut(auth)
}

export function watchAuth(callback) {
    return onAuthStateChanged(auth, callback);
}

export function AuthError(error){
    const code = error?.code || "";

    switch (code) {
        case "auth/email-already-in-use":
            return "An account with this email already exists.";
        case "auth/user-not-found":
            return "No account was found for that email.";
        case "auth/wrong-password":
            return "The password is incorrect.";
        case "auth/invalid-email":
            return "Please enter a valid email address.";
        case "auth/too-many-requests":
            return "Too many attempts. Please wait a moment and try again.";
        case "auth/weak-password":
            return "Your password must be at least 6 characters long.";
        default:
            return error?.message || "Something went wrong. Please try again.";
    }
}