import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

const firebaseConfig = {
apiKey: "AIzaSyBd_HKECYSBtYcZ7tvKfG3_K4uiVMlMMgM",
authDomain: "vortex-tier-list.firebaseapp.com",
projectId: "vortex-tier-list",
storageBucket: "vortex-tier-list.firebasestorage.app",
messagingSenderId: "31280495361",
appId: "1:31280495361:web:93c3be67e1c66041bbf900",
measurementId: "G-RFQ4YJ3EMG"
};

const app = initializeApp(firebaseConfig);

console.log("Vortex Tier Firebase connected.");
