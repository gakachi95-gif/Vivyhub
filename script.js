/* ============================================================
   VivyHub — script.js
   Vanilla JS only. Handles navigation, scroll reveals, the phone
   mockup micro-interactions, card glow tracking, and small forms.
   ============================================================ */

/* --------------------------------------------------------------
   APK DOWNLOAD LINK
   Change this single value whenever a new build is published —
   every "Download APK" button/link on the site reads from here.
----------------------------------------------------------------*/
const VIVY_APK_URL = "https://github.com/gakachi95-gif/Vivylive-/releases/latest/download/vivy.apk";

document.addEventListener("DOMContentLoaded", () => {
  wireApkLinks();
  buildNavbar();
  wireMobileNav();
  markActiveLink();
  wireScrollReveal();
  wireCardGlow();
  wireBackToTop();
  wireForms();
  spawnGiftIcons();
  animateHeroStats();
  setYear();
  wireBlogFilters();
});

/* Apply the APK url to every element flagged with data-apk-link */
function wireApkLinks(){
  document.querySelectorAll("[data-apk-link]").forEach((el) => {
    el.setAttribute("href", VIVY_APK_URL);
  });
}

/* Inject the shared navbar + footer markup so every page stays in sync. */
function buildNavbar(){
  const navMount = document.getElementById("site-navbar");
  if (navMount){
    navMount.innerHTML = `
    <nav class="navbar">
      <div class="nav-inner">
        <a href="index.html" class="brand">
          <span class="brand-mark">V</span>
          VivyHub
        </a>
        <ul class="nav-links" id="navLinks">
          <li><a href="index.html" data-nav="index">Home</a></li>
          <li><a href="host.html" data-nav="host">Become a Host</a></li>
          <li><a href="agency.html" data-nav="agency">Agency</a></li>
          <li><a href="blog.html" data-nav="blog">Blog</a></li>
          <li><a href="about.html" data-nav="about">About</a></li>
          <li><a href="contact.html" data-nav="contact">Contact</a></li>
        </ul>
        <div class="nav-cta">
          <a href="download.html" class="btn btn-ghost btn-sm">Download</a>
          <button class="nav-toggle" id="navToggle" aria-label="Toggle menu">
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
    </nav>`;
  }

  const footerMount = document.getElementById("site-footer");
  if (footerMount){
    footerMount.innerHTML = `
    <footer class="footer">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-brand">
            <a href="index.html" class="brand"><span class="brand-mark">V</span>VivyHub</a>
            <p>Vivy is the social calling platform where the world meets, chats, and earns — one call at a time.</p>
            <div class="footer-social">
              <a href="https://facebook.com/vivyapp" aria-label="Facebook" target="_blank" rel="noopener">f</a>
              <a href="https://tiktok.com/@vivyapp" aria-label="TikTok" target="_blank" rel="noopener">t</a>
              <a href="https://instagram.com/vivyapp" aria-label="Instagram" target="_blank" rel="noopener">i</a>
            </div>
          </div>
          <div class="footer-col">
            <h4>Company</h4>
            <a href="about.html">About</a>
            <a href="blog.html">Blog</a>
            <a href="contact.html">Support</a>
          </div>
          <div class="footer-col">
            <h4>Earn</h4>
            <a href="host.html">Become a Host</a>
            <a href="agency.html">Start an Agency</a>
            <a href="download.html">Download</a>
          </div>
          <div class="footer-col">
            <h4>Legal</h4>
            <a href="privacy.html">Privacy Policy</a>
            <a href="privacy.html#terms">Terms of Use</a>
            <a href="contact.html">Contact Us</a>
          </div>
        </div>
        <div class="footer-bottom">
          <span>© <span id="year"></span> VivyHub. All rights reserved.</span>
          <span>Made for people who'd rather talk than type.</span>
        </div>
      </div>
    </footer>
    <button class="to-top" id="toTop" aria-label="Back to top">↑</button>`;
  }
  // Re-run apk link binding in case footer/nav added new [data-apk-link] nodes
  wireApkLinks();
}

/* Mobile hamburger menu */
function wireMobileNav(){
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");
  if (!toggle || !links) return;
  toggle.addEventListener("click", () => {
    toggle.classList.toggle("open");
    links.classList.toggle("open");
  });
  links.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      toggle.classList.remove("open");
      links.classList.remove("open");
    });
  });
}

/* Highlight the current page in the nav */
function markActiveLink(){
  const page = document.body.getAttribute("data-page");
  if (!page) return;
  document.querySelectorAll(`[data-nav="${page}"]`).forEach((a) => a.classList.add("active"));
}

/* Fade + rise elements into view on scroll */
function wireScrollReveal(){
  const items = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window) || items.length === 0){
    items.forEach((el) => el.classList.add("in-view"));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting){
        entry.target.classList.add("in-view");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
  items.forEach((el) => io.observe(el));
}

/* Subtle pointer-tracked glow on cards */
function wireCardGlow(){
  document.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - rect.left}px`);
      card.style.setProperty("--my", `${e.clientY - rect.top}px`);
    });
  });
}

/* Back to top button */
function wireBackToTop(){
  const btn = document.getElementById("toTop");
  if (!btn) return;
  window.addEventListener("scroll", () => {
    btn.classList.toggle("show", window.scrollY > 500);
  });
  btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

/* Demo forms (host / agency / contact) — no backend, just friendly UX */
function wireForms(){
  document.querySelectorAll("form[data-demo-form]").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const successBox = form.parentElement.querySelector(".form-success");
      if (successBox){
        successBox.classList.add("show");
        successBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
      form.reset();
    });
  });
}

/* Little gift emoji rising inside the hero phone mockup, purely decorative */
function spawnGiftIcons(){
  const stage = document.getElementById("giftStage");
  if (!stage) return;
  const gifts = ["🎁", "💎", "🌟", "❤️"];
  setInterval(() => {
    const g = document.createElement("span");
    g.className = "gift-float";
    g.textContent = gifts[Math.floor(Math.random() * gifts.length)];
    g.style.left = 20 + Math.random() * 60 + "%";
    stage.appendChild(g);
    setTimeout(() => g.remove(), 3700);
  }, 1400);
}

/* Count up the hero stat numbers once they scroll into view */
function animateHeroStats(){
  const stats = document.querySelectorAll("[data-count]");
  if (stats.length === 0) return;
  const run = (el) => {
    const target = parseFloat(el.getAttribute("data-count"));
    const suffix = el.getAttribute("data-suffix") || "";
    const decimals = el.getAttribute("data-decimals") ? parseInt(el.getAttribute("data-decimals")) : 0;
    let start = 0;
    const duration = 1400;
    const startTime = performance.now();
    function tick(now){
      const p = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = start + (target - start) * eased;
      el.textContent = val.toFixed(decimals) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  };
  if (!("IntersectionObserver" in window)){
    stats.forEach(run);
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting){
        run(entry.target);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  stats.forEach((el) => io.observe(el));
}

function setYear(){
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
}

/* Blog category filter — pure client-side, no reload */
function wireBlogFilters(){
  const filterBar = document.getElementById("blogFilters");
  const cards = document.querySelectorAll("[data-category]");
  if (!filterBar || cards.length === 0) return;

  filterBar.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-filter]");
    if (!btn) return;
    filterBar.querySelectorAll("[data-filter]").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    const filter = btn.getAttribute("data-filter");
    cards.forEach((card) => {
      const match = filter === "all" || card.getAttribute("data-category") === filter;
      card.style.display = match ? "" : "none";
    });
  });
}
