import { getAllProducts, getProductsByCategory } from "../page/products.js";
import { createProductCard, showMessage } from "../page/ui.js";
import { auth } from "../js/firebaseConfig.js";
import { addToCart } from "./cart.js";

const grid = document.getElementById("product-grid");
const filterButtons = document.querySelectorAll("[data-category]");

function handleAdd(product) {
  const uid = auth.currentUser?.uid;

  if (!uid) {
    window.location.href = "./login.html";
    return;
  }

  addToCart(uid, product.id);
}

async function loadProducts(category) {
  showMessage(grid, "Loading products...");
  try {
    const products =
      category === "All"
        ? await getAllProducts()
        : await getProductsByCategory(category);

    if (products.length === 0) {
      showMessage(grid, "No products found in this category.");
      return;
    }

    grid.replaceChildren(
      ...products.map((p) => createProductCard(p, handleAdd))
    );
  } catch (error) {
    console.error(error);
    showMessage(grid, "Could not load products. Please try again.");
  }
}

const params = new URLSearchParams(window.location.search);
const initialCategory = params.get("category") || "All";

filterButtons.forEach((btn) => {
  const isActive = btn.dataset.category === initialCategory;
  btn.classList.toggle("active", isActive);

  btn.addEventListener("click", () => {
    filterButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    loadProducts(btn.dataset.category);
  });
});

loadProducts(initialCategory);