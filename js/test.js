import { db } from "./firebaseConfig.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const output = document.getElementById("output");

try {
  const snapshot = await getDocs(collection(db, "products"));

  if (snapshot.empty) {
    output.textContent = "Connected, but the products collection is empty.";
  } else {
    const rows = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    console.log(rows);
    output.textContent = JSON.stringify(rows, null, 2);
  }
} catch (error) {
  console.error(error);
  output.textContent = `Error (${error.code || "unknown"}): ${error.message}`;
}