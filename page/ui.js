
export function createProductCard(product, onAdd) {
  const card = document.createElement("article");
  card.className = "product-card";

  const img = document.createElement("img");
  img.src = product.imageURL;
  img.alt = product.name;
  img.loading = "lazy";

  const name = document.createElement("h3");
  name.textContent = product.name;

  const category = document.createElement("p");
  category.className = "product-category";
  category.textContent = product.category;

  const desc = document.createElement("p");
  desc.textContent = product.description;

  const price = document.createElement("p");
  price.className = "product-price";
  price.textContent = `$${Number(product.price).toFixed(2)}`;

  const button = document.createElement("button");
  button.type = "button";
  button.textContent = "Add to cart";
  button.addEventListener("click", () => onAdd(product));

  card.append(img, name, category, desc, price, button);
  return card;
}


export function showMessage(container, text) {
  container.replaceChildren();
  const p = document.createElement("p");
  p.className = "grid-message";
  p.textContent = text;
  container.append(p);
}
