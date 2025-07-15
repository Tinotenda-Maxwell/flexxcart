// inject.js

async function injectHTML(id, file) {
  try {
    const res = await fetch(file);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const html = await res.text();
    document.getElementById(id).innerHTML = html;
    console.log(`✅ Injected ${file} into #${id}`);
  } catch (err) {
    console.error(`❌ Failed to inject ${file} into #${id}:`, err);
  }
}

// Inject header and footer
injectHTML("header-container", "header.html");
injectHTML("footer-container", "footer.html");

// Optional: fallback dummy content for testing
document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("header-container");
  const footer = document.getElementById("footer-container");

  if (!header.innerHTML.trim()) {
    header.innerHTML = `<div style="background:#ffc;padding:10px">⚠️ Header failed to load</div>`;
  }
  if (!footer.innerHTML.trim()) {
    footer.innerHTML = `<div style="background:#ffc;padding:10px">⚠️ Footer failed to load</div>`;
  }
});
