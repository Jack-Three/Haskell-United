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

    if (!snapshot.empty) {
        return;
    }

    const promises = [];

    for (let row = 0; row < 10; row++) {

        for (let col = 0; col < 10; col++) {

            const id = `${row}-${col}`;

            promises.push(

                setDoc(
                    doc(
                        db,
                        "squares",
                        id
                    ),
                    {
                        row,
                        col,
                        claimed: false,
                        playerId: null,
                        displayName: "",
                        avatar: ""
                    }
                )

            );

        }

    }

    await Promise.all(promises);

    console.log(
        "100 board squares created."
    );

}

export function watchSquares(callback) {

    return onSnapshot(

        collection(db, "squares"),

        (snapshot) => {

            const squares = [];

            snapshot.forEach(docSnap => {

                squares.push({
                    id: docSnap.id,
                    ...docSnap.data()
                });

            });

            callback(squares);

        }

    );

}

export async function createPlayer(player) {

    const docRef =
        await addDoc(
            collection(
                db,
                "players"
            ),
            player
        );

    return docRef.id;

}

export async function claimSquare(
    squareId,
    playerId,
    displayName,
    avatar
) {

    const squareRef =
        doc(
            db,
            "squares",
            squareId
        );

    await updateDoc(
        squareRef,
        {
            claimed: true,
            playerId,
            displayName,
            avatar
        }
    );

}

export function shuffleNumbers() {

    const numbers =
        [0,1,2,3,4,5,6,7,8,9];

    return numbers.sort(
        () => Math.random() - 0.5
    );

}

window.addEventListener(
    "load",
    async () => {

        try {

            await initializeAuth();

            await createDefaultGame();

            await createBoardSquares();

            console.log(
                "Firebase initialized."
            );

        }

        catch(error) {

            console.error(
                error
            );

        }

    }
);
