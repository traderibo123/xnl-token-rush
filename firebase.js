// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getDatabase, ref, push, query, orderByChild, limitToLast, get } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCMWkXe5HotYtt6HPan55J39NYX8yk8sME",
  authDomain: "xnl-token-rush.firebaseapp.com",
  databaseURL: "https://xnl-token-rush-default-rtdb.firebaseio.com",
  projectId: "xnl-token-rush",
  storageBucket: "xnl-token-rush.firebasestorage.app",
  messagingSenderId: "880597253084",
  appId: "1:880597253084:web:9d1796e80e17d5af48ad19",
  measurementId: "G-6MEMFJPFWN"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db, ref, push, query, orderByChild, limitToLast, get };
