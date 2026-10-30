import { db, auth } from "../js/firebaseConfig.js";
import { watchAuth } from "../js/auth.js";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  increment,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const cartCol = (uid) => collection(db, "users", uid, "cart");
const cartDoc = (uid, productId) => doc(db, "users", uid, "cart", productId);

const cartItemsEl = document.getElementById("cart-items");
const cartCountEl = document.getElementById("cart-count");
const cartSubtotalEl = document.getElementById("cart-subtotal");
const checkoutBtn = document.getElementById("checkout-btn");

// Tell the rest of the page (e.g. the navbar badge) that the cart changed
const notifyChange = () => window.dispatchEvent(new CustomEvent("cart:changed"));

// Add one of a product. Creates the document, or increases its quantity.
export async function addToCart(uid, productId) {
  await setDoc(cartDoc(uid, productId), { quantity: increment(1) }, { merge: true });
  notifyChange();
}

export async function setQuantity(uid, productId, quantity) {
  if (quantity <= 0) return removeFromCart(uid, productId);
  await updateDoc(cartDoc(uid, productId), { quantity });
  notifyChange();
}

export async function removeFromCart(uid, productId) {
  await deleteDoc(cartDoc(uid, productId));
  notifyChange();
}

// Returns [{ id, name, price, imageURL, quantity, ... }] joined with product data
export async function getCartItems(uid) {
  const cartSnap = await getDocs(cartCol(uid));

  const items = await Promise.all(
    cartSnap.docs.map(async (cartEntry) => {
      const productSnap = await getDoc(doc(db, "products", cartEntry.id));
      if (!productSnap.exists()) return null; // product was deleted
      return {
        id: cartEntry.id,
        ...productSnap.data(),
        quantity: cartEntry.data().quantity,
      };
    })
  );

  return items.filter(Boolean);
}

// Pure helpers: no Firebase, easy to test by hand
export const calcTotal = (items) =>
  items.reduce((sum, item) => sum + item.price * item.quantity, 0);

export const countItems = (items) =>
  items.reduce((sum, item) => sum + item.quantity, 0);

function updateSummary(items) {
  const count = countItems(items);
  cartCountEl.textContent = String(count);
  cartSubtotalEl.textContent = `$${calcTotal(items).toFixed(2)}`;
  if (checkoutBtn) {
    checkoutBtn.disabled = count === 0;
    checkoutBtn.title = count === 0 ? "Add something to your cart first" : "";
  }
}

function createEmptyCartState() {
  cartItemsEl.replaceChildren();

  const empty = document.createElement("div");
  empty.className = "cart-empty";
  empty.textContent = "Your cart is empty. Add a few essentials from the shop.";
  cartItemsEl.append(empty);

  updateSummary([]);
}

function createCartRow(item, uid) {
  const row = document.createElement("article");
  row.className = "cart-item";

  const image = document.createElement("img");
  image.src = item.imageURL;
  image.alt = item.name;
  image.loading = "lazy";

  const info = document.createElement("div");
  info.className = "cart-item-info";

  const title = document.createElement("h3");
  title.textContent = item.name;

  const price = document.createElement("p");
  price.textContent = `$${Number(item.price).toFixed(2)} each`;

  const controls = document.createElement("div");
  controls.className = "cart-item-controls";

  const quantityWrap = document.createElement("div");
  quantityWrap.className = "quantity-controls";

  const minusBtn = document.createElement("button");
  minusBtn.type = "button";
  minusBtn.setAttribute("aria-label", `Decrease ${item.name} quantity`);
  minusBtn.textContent = "−";
  minusBtn.addEventListener("click", async () => {
    await setQuantity(uid, item.id, item.quantity - 1);
    await renderCartForUser(uid);
  });

  const quantityValue = document.createElement("span");
  quantityValue.textContent = String(item.quantity);

  const plusBtn = document.createElement("button");
  plusBtn.type = "button";
  plusBtn.setAttribute("aria-label", `Increase ${item.name} quantity`);
  plusBtn.textContent = "+";
  plusBtn.addEventListener("click", async () => {
    await setQuantity(uid, item.id, item.quantity + 1);
    await renderCartForUser(uid);
  });

  const removeBtn = document.createElement("button");
  removeBtn.type = "button";
  removeBtn.className = "cart-remove-btn";
  removeBtn.textContent = "Remove";
  removeBtn.addEventListener("click", async () => {
    await removeFromCart(uid, item.id);
    await renderCartForUser(uid);
  });

  const total = document.createElement("p");
  total.className = "cart-item-total";
  total.textContent = `$${(item.price * item.quantity).toFixed(2)}`;

  quantityWrap.append(minusBtn, quantityValue, plusBtn);
  controls.append(quantityWrap, removeBtn);
  info.append(title, price);
  row.append(image, info, controls);
  row.append(total);

  return row;
}

async function renderCartForUser(uid) {
  if (!cartItemsEl) return;

  const items = await getCartItems(uid);

  if (!items.length) {
    createEmptyCartState();
    return;
  }

  cartItemsEl.replaceChildren();
  items.forEach((item) => {
    cartItemsEl.append(createCartRow(item, uid));
  });

  updateSummary(items);
}

watchAuth(async (user) => {
  if (!cartItemsEl) return;

  if (!user) {
    window.location.href = "./login.html";
    return;
  }

  await renderCartForUser(user.uid);
});
