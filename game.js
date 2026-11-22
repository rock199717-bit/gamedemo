// 🔥 Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 🔑 CONFIGURACIÓN FIREBASE (REAL)
const firebaseConfig = {
  apiKey: "AIzaSyDPdkgLmWXj_otCW-mkLh9xdgxLYlBcg80",
  authDomain: "yjjuegodemo.firebaseapp.com",
  projectId: "yjjuegodemo",
  storageBucket: "yjjuegodemo.appspot.com",
  messagingSenderId: "539810260626",
  appId: "1:539810260626:web:108f1a06f54c5416e2e84b"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ================= DOM =================
const usernameEl = document.getElementById("username");
const avatarEl = document.getElementById("profilePhoto");
const logoutBtn = document.getElementById("logoutBtn");

const profilePanel = document.getElementById("profilePanel");
const openProfile = document.getElementById("openProfile");
const closeProfile = document.getElementById("closeProfile");

const newNameInput = document.getElementById("newUsername");
const saveNameBtn = document.getElementById("saveUsername");

const photoInput = document.getElementById("photoURL");
const savePhotoBtn = document.getElementById("savePhoto");

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// ================= PERFIL (Firestore) =================
function makeRandomUsername() {
  const n = Math.floor(1000 + Math.random() * 9000);
  return `User-${n}`;
}

async function loadOrCreateProfile(user) {
  const userRef = doc(db, "users", user.uid);
  const snap = await getDoc(userRef);

  if (!snap.exists()) {
    const username = makeRandomUsername();

    await setDoc(userRef, {
      email: user.email || "",
      username,
      photoURL: "",
      createdAt: Date.now()
    });

    return { username, photoURL: "" };
  }

  const data = snap.data() || {};
  return {
    username: data.username || makeRandomUsername(),
    photoURL: data.photoURL || ""
  };
}

function renderProfile(profile) {
  usernameEl.textContent = profile.username || "User";
  if (profile.photoURL) avatarEl.src = profile.photoURL;
}

// ================= AUTH + INICIO =================
onAuthStateChanged(auth, async user => {
  if (!user) {
    window.location.href = "index.html";
    return;
  }

  try {
    const profile = await loadOrCreateProfile(user);
    renderProfile(profile);
    iniciarJuego();
  } catch (err) {
    console.error("Error cargando/creando perfil:", err);
    // Igual iniciamos el juego para no dejar la pantalla muerta
    usernameEl.textContent = "User";
    iniciarJuego();
  }
});

// ================= PANEL PERFIL =================
openProfile.onclick = () => {
  profilePanel.style.display =
    profilePanel.style.display === "block" ? "none" : "block";
};

closeProfile.onclick = () => {
  profilePanel.style.display = "none";
};

// ✏️ Guardar nuevo nombre
saveNameBtn.onclick = async () => {
  const user = auth.currentUser;
  const username = newNameInput.value.trim();
  if (!user || !username) return;

  try {
    await updateDoc(doc(db, "users", user.uid), { username });
    usernameEl.textContent = username;
    newNameInput.value = "";
  } catch (err) {
    console.error("Error guardando nombre:", err);
  }
};

// 🖼️ Guardar foto (URL)
savePhotoBtn.onclick = async () => {
  const user = auth.currentUser;
  const photoURL = photoInput.value.trim();
  if (!user || !photoURL) return;

  try {
    await updateDoc(doc(db, "users", user.uid), { photoURL });
    avatarEl.src = photoURL;
    photoInput.value = "";
  } catch (err) {
    console.error("Error guardando foto:", err);
  }
};

// 🚪 Logout
logoutBtn.onclick = () => {
  signOut(auth).then(() => {
    window.location.href = "index.html";
  });
};

// ================= JUEGO BASE (placeholder) =================
let x = 50;
let dx = 2;

function iniciarJuego() {
  requestAnimationFrame(loop);
}

function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#22c55e";
  ctx.fillRect(x, 175, 50, 50);

  x += dx;
  if (x <= 0 || x >= canvas.width - 50) dx *= -1;

  requestAnimationFrame(loop);
}
