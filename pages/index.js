import { getFeaturedProducts } from "../page/products.js";
import { createProductCard, showMessage } from "../page/ui.js";
import { auth } from "../js/firebaseConfig.js";
import { addToCart } from "./cart.js";

const featuredGrid = document.getElementById("featured-products");

function handleAdd(product) {
  const uid = auth.currentUser?.uid;

  if (!uid) {
    window.location.href = "./login.html";
    return;
  }

  addToCart(uid, product.id);
}

async function loadFeaturedProducts() {
  showMessage(featuredGrid, "Loading products...");

  try {
    const products = await getFeaturedProducts();

    if (!products.length) {
      showMessage(featuredGrid, "No products found.");
      return;
    }

    featuredGrid.replaceChildren(
      ...products.map((product) => createProductCard(product, handleAdd))
    );
  } catch (error) {
    console.error(error);
    showMessage(featuredGrid, "Could not load products. Please try again.");
  }
}

loadFeaturedProducts();
