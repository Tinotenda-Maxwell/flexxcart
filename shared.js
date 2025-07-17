import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// ✅ Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAZzKHkXOeiAZGcziTLUO4nnPjCaVPDoqE",
  authDomain: "flexxcart-4eec7.firebaseapp.com",
  projectId: "flexxcart-4eec7",
  storageBucket: "flexxcart-4eec7.appspot.com",
  messagingSenderId: "214282586265",
  appId: "1:214282586265:web:b750a44367aa26d0e45008",
  measurementId: "G-QPEWW4K5QF"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// ✅ Wait for injected header and bind UI + events
function waitForHeaderAndBind() {
  const checkInterval = setInterval(() => {
    const loginBtn = document.getElementById("loginBtn");
    const mobileLoginBtn = document.getElementById("mobileLoginBtn");
    const userDropdown = document.getElementById("userDropdown");
    const userIcon = document.getElementById("userIcon");
    const userDropdownContent = document.getElementById("userDropdownContent");
    const mobileUserDropdown = document.getElementById("mobileUserDropdown");
    const mobileUserIcon = document.getElementById("mobileUserIcon");
    const mobileDropdownMenu = document.getElementById("mobileUserMenu");

    const menuToggle = document.getElementById("menuToggle");
    const mobileMenu = document.getElementById("mobileMenu");

    const searchToggle = document.getElementById("searchToggle");
    const mobileSearchBar = document.getElementById("mobileSearchBar");

    const desktopInput = document.getElementById("searchInput");
    const desktopBtn = document.getElementById("searchBtn");
    const mobileInput = document.getElementById("mobileSearchInput");
    const mobileBtn = document.getElementById("mobileSearchBtn");

    if (
      loginBtn || userDropdown || mobileLoginBtn || mobileUserDropdown ||
      menuToggle || mobileUserIcon || mobileMenu || mobileDropdownMenu ||
      userIcon || userDropdownContent || searchToggle || mobileSearchBar
    ) {
      clearInterval(checkInterval);

      // ✅ Auth state toggle
      onAuthStateChanged(auth, (user) => {
        document.body.classList.remove("auth-loading");
        if (user) {
          loginBtn && (loginBtn.style.display = "none");
          mobileLoginBtn && (mobileLoginBtn.style.display = "none");
          userDropdown && (userDropdown.style.display = "block");
          mobileUserDropdown && (mobileUserDropdown.style.display = "block");
        } else {
          loginBtn && (loginBtn.style.display = "inline-block");
          mobileLoginBtn && (mobileLoginBtn.style.display = "inline-block");
          userDropdown && (userDropdown.style.display = "none");
          mobileUserDropdown && (mobileUserDropdown.style.display = "none");
        }
        updateCartCount();
      });

      // ✅ Toggle menus/dropdowns
      menuToggle?.addEventListener("click", (e) => {
        e.stopPropagation();
        mobileMenu.classList.toggle("show");
        mobileDropdownMenu?.classList.remove("show");
        userDropdownContent?.classList.remove("show");
        if (mobileSearchBar) mobileSearchBar.style.display = "none";
      });

      mobileUserIcon?.addEventListener("click", (e) => {
        e.stopPropagation();
        mobileDropdownMenu.classList.toggle("show");
        mobileMenu?.classList.remove("show");
        userDropdownContent?.classList.remove("show");
        if (mobileSearchBar) mobileSearchBar.style.display = "none";
      });

      userIcon?.addEventListener("click", (e) => {
        e.stopPropagation();
        userDropdownContent.classList.toggle("show");
        mobileDropdownMenu?.classList.remove("show");
        mobileMenu?.classList.remove("show");
        if (mobileSearchBar) mobileSearchBar.style.display = "none";
      });

      searchToggle?.addEventListener("click", (e) => {
        e.stopPropagation();
        const isVisible = mobileSearchBar.style.display === "flex";
        mobileSearchBar.style.display = isVisible ? "none" : "flex";
        mobileMenu?.classList.remove("show");
        mobileDropdownMenu?.classList.remove("show");
        userDropdownContent?.classList.remove("show");
      });

      document.addEventListener("click", (e) => {
        const isMenuClick = mobileMenu?.contains(e.target) || menuToggle?.contains(e.target);
        const isUserClick =
          mobileDropdownMenu?.contains(e.target) || mobileUserIcon?.contains(e.target) ||
          userDropdownContent?.contains(e.target) || userIcon?.contains(e.target);
        const isSearchClick = mobileSearchBar?.contains(e.target) || searchToggle?.contains(e.target);

        if (!isMenuClick) mobileMenu?.classList.remove("show");
        if (!isUserClick) {
          mobileDropdownMenu?.classList.remove("show");
          userDropdownContent?.classList.remove("show");
        }
        if (!isSearchClick && mobileSearchBar?.style.display === "flex") {
          mobileSearchBar.style.display = "none";
        }
      });

      // ✅ Search input handling — now works
      if (desktopBtn && desktopInput) {
        desktopBtn.addEventListener("click", (e) => {
          e.preventDefault();
          const query = desktopInput.value.trim();
          if (query) window.location.href = `search.html?query=${encodeURIComponent(query)}`;
        });

        desktopInput.addEventListener("keypress", (e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            desktopBtn.click();
          }
        });
      }

      if (mobileBtn && mobileInput) {
        mobileBtn.addEventListener("click", (e) => {
          e.preventDefault();
          const query = mobileInput.value.trim();
          if (query) window.location.href = `search.html?query=${encodeURIComponent(query)}`;
        });

        mobileInput.addEventListener("keypress", (e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            mobileBtn.click();
          }
        });
      }
    }
  }, 100);
}

// ✅ Update cart count from localStorage
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const count = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const cartCountEls = document.querySelectorAll("#cart-count");
  cartCountEls.forEach(el => el.textContent = count);
}

// ✅ Load categories into header dropdown and homepage grid
async function loadCategories() {
  try {
    const categoryDropdown = document.getElementById("categoryDropdown");
    const categoryContainer = document.getElementById("categoryContainer");

    const snapshot = await getDocs(collection(db, "categories"));

    if (categoryDropdown) categoryDropdown.innerHTML = "";
    if (categoryContainer) categoryContainer.innerHTML = "";

    snapshot.forEach((doc) => {
      const { name, image } = doc.data();
      const slug = name.toLowerCase().replace(/\s+/g, "-");

      // Header dropdown
      if (categoryDropdown) {
        const a = document.createElement("a");
        a.href = `shop.html#${slug}`;
        a.textContent = name;
        categoryDropdown.appendChild(a);
      }

      // Homepage cards
      if (categoryContainer) {
        const div = document.createElement("div");
        div.className = "category-card";
        div.innerHTML = `
          <img src="${image}" alt="${name}" loading="lazy">
          <h4>${name}</h4>
          <button onclick="location.href='shop.html#${slug}'">Shop Now</button>
        `;
        categoryContainer.appendChild(div);
      }
    });
  } catch (e) {
    console.error("Category fetch failed:", e);
  }
}

// ✅ Logout function
window.logout = function () {
  signOut(auth)
    .then(() => {
      localStorage.removeItem("cart");
      location.reload();
    })
    .catch((e) => alert("Logout failed: " + e.message));
};

// ✅ Search input handling for both desktop and mobile



// ✅ Init everything
document.addEventListener("DOMContentLoaded", () => {
  waitForHeaderAndBind();
  loadCategories();
});
// ✅ Listen for cart update events
document.addEventListener("cart-updated", updateCartCount);
export { db, auth, updateCartCount };
