// =====================================================
// HASKELL UNITED WAY
// Firebase Configuration
// =====================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

import {
    getFirestore,
    collection,
    doc,
    addDoc,
    setDoc,
    getDoc,
    getDocs,
    onSnapshot,
    updateDoc,
    query,
    where
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

import {
    getAuth,
    signInAnonymously
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

// =====================================================
// Firebase Config
// =====================================================

const firebaseConfig = {
    apiKey: "AIzaSyBLe5oNcDg94T5RoHygjFft4NsW_la_zuA",
    authDomain: "haskell-united.firebaseapp.com",
    projectId: "haskell-united",
    storageBucket: "haskell-united.firebasestorage.app",
    messagingSenderId: "221769962574",
    appId: "1:221769962574:web:d96a58b28fdf7750735f1f",
    measurementId: "G-KH34T121SY"
};

// =====================================================
// Initialize Firebase
// =====================================================

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);

// =====================================================
// Authentication
// =====================================================

export async function initializeAuth() {

    try {

        const userCredential =
            await signInAnonymously(auth);

        console.log(
            "Anonymous login successful:",
            userCredential.user.uid
        );

        return userCredential.user;

    } catch (error) {

        console.error(
            "Anonymous login failed:",
            error
        );

        throw error;

    }

}

// =====================================================
// Collections
// =====================================================

export const collections = {

    games: collection(db, "games"),

    players: collection(db, "players"),

    squares: collection(db, "squares"),

    winners: collection(db, "winners"),

    settings: collection(db, "settings")

};

// =====================================================
// Test Game
// =====================================================

export const TEST_GAME_ID =
    "vikings-saints-2026";

// =====================================================
// Create Default Game
// =====================================================

export async function createDefaultGame() {

    const gameRef =
        doc(db, "games", TEST_GAME_ID);

    const existing =
        await getDoc(gameRef);

    if (existing.exists()) {

        return;

    }

    await setDoc(gameRef, {

        id: TEST_GAME_ID,

        awayTeam:
            "Minnesota Vikings",

        homeTeam:
            "New Orleans Saints",

        gameDate:
            "2026-10-11",

        squarePrice:
            1,

        fundraisingGoal:
            100,

        status:
            "open",

        awayNumbers: [],

        homeNumbers: [],

        created:
            new Date().toISOString()

    });

    console.log(
        "Default game created."
    );

}

// =====================================================
// Create 100 Squares
// =====================================================

export async function createBoardSquares() {

    const snapshot =
        await getDocs(
            collection(
                db,
                "squares"
            )
        
        );
