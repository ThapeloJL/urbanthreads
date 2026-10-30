# Urban Threads Online Store 

A responsive online clothing store for causal streetwear, built with plain HTML, CSS and JavaScript. Products come from Firebase Firestore and accounts are handled by Firebase Authentication. Each carts is saved in Firestore , so it persists across sessions and devices.

**Live site:** 

## Features
### Core Requirements
-**Browse Products**: loaded dynamically from Firestore, with category filters (Hoodies , T-shirts , Sneakers , Accessories)
-**Authentication**:sign up , log in and log out with email and password , with validation and clear error messages
-**Navbar** shows the logged-In user's name or email and the number of items in the cart
-**Shopping cart**: add items , change quantities , remove items , see line totals and grand total.
-**Responsive design**: using CSS Grid and Flexbox , for desktop, tablet and phone optimazition 

## Tech Stack
- HTML5, CSS3
- JavaScript 
- Firebase Authentication
- Cloud Firestore


## Project Structure 
``` 
urban-threads/
|__assests/
|__js/
|    |__auth.js
|    |__firebaseConfig.js
|    |__navbar.js
|    |__test.js
|__page/
|   |__products.js
|   |__ui.js
|__pages/
|   |__cart.js
|   |__index.js
|   |__login.js
|   |__shop.js
|__styles/
|   |__components.css
|   |__layout.css
|__.gitignore
|__cart.html
|__index.html
|__login.html
|__shop.html
|__readMe.md
|__test.html
```

## Author
Thapelo Legote , Full-Stack AI Engineer, Zaio Institute of Technology
