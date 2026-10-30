import { db } from "../js/firebaseConfig.js";
import {
  collection,
  getDocs,
  query,
  where,
  limit,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const productsRef = collection(db, "products");


export async function getAllProducts() {
  const snapshot = await getDocs(productsRef);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}


export async function getProductsByCategory(category) {
  const q = query(productsRef, where("category", "==", category));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export async function getFeaturedProducts() {
  const q = query(productsRef, limit(4));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}
