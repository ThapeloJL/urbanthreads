import { watchAuth, logOut } from "./auth.js";
import { auth } from "./firebaseConfig.js";
import { getCartItems, countItems } from "../pages/cart.js";

const elements = {
  cartLink: document.getElementById("cart-link"),
  userLabel: document.getElementById("user-label"),
  loginLink: document.getElementById("login-link"),
  logoutBtn: document.getElementById("logout-btn"),
};

const cartBadge = document.createElement("span");
cartBadge.id = "cart-counter";
cartBadge.className = "cart-counter";
cartBadge.hidden = true;
cartBadge.setAttribute("aria-live", "polite");

if (elements.cartLink) {
  elements.cartLink.append(cartBadge);
}

async function refreshCartBadge(user = auth.currentUser) {
  if (!elements.cartLink) return;

  if (!user) {
    cartBadge.textContent = "";
    cartBadge.hidden = true;
    return;
  }

  try {
    const items = await getCartItems(user.uid);
    const count = countItems(items);

    cartBadge.textContent = String(count);
    cartBadge.hidden = count === 0;
  } catch (error) {
    console.error("Could not refresh cart badge:", error);
    cartBadge.textContent = "";
    cartBadge.hidden = true;
  }
}

function setAuthState(user) {
  const loggedIn = Boolean(user);

  if (elements.cartLink) elements.cartLink.hidden = !loggedIn;
  if (elements.loginLink) elements.loginLink.hidden = loggedIn;
  if (elements.logoutBtn) elements.logoutBtn.hidden = !loggedIn;
  if (elements.userLabel) {
    elements.userLabel.hidden = !loggedIn;
    elements.userLabel.textContent = loggedIn ? (user.displayName || user.email || "User") : "";
  }

  refreshCartBadge(user);
}

if (elements.logoutBtn) {
  elements.logoutBtn.addEventListener("click", async () => {
    try {
      await logOut();
      window.location.href = "./index.html";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  });
}

window.addEventListener("cart:changed", () => {
  refreshCartBadge(auth.currentUser);
});

watchAuth(setAuthState);