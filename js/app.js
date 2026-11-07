const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];

document.addEventListener("DOMContentLoaded", () => {
  const slides = $$(".hero-slide");
  const dotsWrap = $("#sliderDots");
  const current = $("#slideCurrent");
  const progress = $("#slideProgress");
  let index = 0;
  let timer = null;
  const duration = 5500;

  slides.forEach((_, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.setAttribute("aria-label", `Show slide ${i+1}`);
    b.addEventListener("click", () => goTo(i, true));
    dotsWrap.appendChild(b);
  });

  const dots = $$("button", dotsWrap);

  function goTo(next, manual=false){
    slides[index].classList.remove("is-active");
    index = (next + slides.length) % slides.length;
    slides[index].classList.add("is-active");
    current.textContent = String(index + 1).padStart(2, "0");
    dots.forEach((d, i) => d.classList.toggle("is-active", i === index));
    progress.style.transition = "none";
    progress.style.transform = "scaleX(0)";
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        progress.style.transition = `transform ${duration}ms linear`;
        progress.style.transform = "scaleX(1)";
      });
    });
    if (manual) restart();
  }

  function restart(){
    clearInterval(timer);
    timer = setInterval(() => goTo(index + 1), duration);
  }

  goTo(0);
  restart();

  const hero = $(".hero");
  hero.addEventListener("mouseenter", () => clearInterval(timer));
  hero.addEventListener("mouseleave", restart);

  // Header shrink
  const header = $("#siteHeader");
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 40);
  onScroll();
  window.addEventListener("scroll", onScroll, {passive:true});

  // Mouse glow on desktop
  const glow = $(".cursor-glow");
  window.addEventListener("mousemove", e => {
    glow.style.left = `${e.clientX}px`;
    glow.style.top = `${e.clientY}px`;
  }, {passive:true});

  // Reveal-on-scroll
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add("revealed");
        observer.unobserve(entry.target);
      }
    });
  }, {threshold:.12});

  $$(".reveal").forEach(el => observer.observe(el));

  // Ripple effect
  $$(".ripple-btn, .destination-card").forEach(el => {
    el.addEventListener("click", function(e){
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement("span");
      const size = Math.max(rect.width, rect.height);
      ripple.className = "ripple";
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - rect.left - size/2}px`;
      ripple.style.top = `${e.clientY - rect.top - size/2}px`;
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
    });
  });

  // Small magnetic hover effect on primary buttons
  $$(".magnetic").forEach(btn => {
    btn.addEventListener("mousemove", e => {
      const r = btn.getBoundingClientRect();
      const x = (e.clientX-r.left-r.width/2)/r.width*16;
      const y = (e.clientY-r.top-r.height/2)/r.height*16;
      btn.style.transform = `translate(${x}px, ${y}px)`;
    });
    btn.addEventListener("mouseleave", () => btn.style.transform = "");
  });

  // Search overlay
  const searchOverlay = $("#searchOverlay");
  const openSearch = () => {
    searchOverlay.classList.add("open");
    searchOverlay.setAttribute("aria-hidden","false");
    setTimeout(() => $("#siteSearch").focus(), 100);
  };
  const closeSearch = () => {
    searchOverlay.classList.remove("open");
    searchOverlay.setAttribute("aria-hidden","true");
  };
  $("#openSearch").addEventListener("click", openSearch);
  $("#closeSearch").addEventListener("click", closeSearch);
  searchOverlay.addEventListener("click", e => { if(e.target === searchOverlay) closeSearch(); });

  const places = ["Kerala","Karnataka","Manglore","Banglore","Mysore","Tamilnadu","Coimbatore","Chennai","Kanyakumari","Andhrapradesh","Hyderabad"];
  const searchInput = $("#siteSearch");
  const results = $("#searchResults");

  function renderResults(q=""){
    const hit = places.filter(p => p.toLowerCase().includes(q.toLowerCase()));
    results.innerHTML = hit.length
      ? hit.map(p => `<button class="result" type="button" data-result="${p}"><span>${p}</span><strong>→</strong></button>`).join("")
      : `<div class="result"><span>No matching destination</span><span>Try another search</span></div>`;
    $$(".result[data-result]", results).forEach(b => b.addEventListener("click", () => {
      closeSearch();
      document.querySelector(`[data-place="${CSS.escape(b.dataset.result)}"]`)?.scrollIntoView({behavior:"smooth",block:"center"});
      showToast(`${b.dataset.result} selected`);
    }));
  }
  renderResults();
  searchInput.addEventListener("input", e => renderResults(e.target.value));

  // Menu overlay
  const menuOverlay = $("#menuOverlay");
  const openMenu = () => { menuOverlay.classList.add("open"); menuOverlay.setAttribute("aria-hidden","false"); };
  const closeMenu = () => { menuOverlay.classList.remove("open"); menuOverlay.setAttribute("aria-hidden","true"); };
  $("#openMenu").addEventListener("click", openMenu);
  $("#closeMenu").addEventListener("click", closeMenu);
  menuOverlay.addEventListener("click", e => { if(e.target === menuOverlay) closeMenu(); });
  $$(".menu-item").forEach(a => a.addEventListener("click", closeMenu));

  // Mobile drawer
  const mobileBtn = $("#mobileMenuBtn");
  const drawer = $("#mobileDrawer");
  mobileBtn.addEventListener("click", () => {
    drawer.classList.toggle("open");
    drawer.setAttribute("aria-hidden", drawer.classList.contains("open") ? "false" : "true");
  });
  $$("#mobileDrawer a").forEach(a => a.addEventListener("click", () => drawer.classList.remove("open")));
  $("#mobileSearch").addEventListener("click", () => { drawer.classList.remove("open"); openSearch(); });

  // Destination interaction
  $$(".destination-card").forEach(card => {
    card.addEventListener("click", () => showToast(`${card.dataset.place} — destination selected`));
  });

  // Story button
  $("#watchStory").addEventListener("click", () => {
    showToast("Gregado: clear guidance from course to destination.");
    document.querySelector("#why-us").scrollIntoView({behavior:"smooth"});
  });

  // Close overlays with Escape
  document.addEventListener("keydown", e => {
    if(e.key === "Escape"){
      closeSearch();
      closeMenu();
      drawer.classList.remove("open");
    }
  });

  // Toast
  function showToast(message){
    const toast = $("#toast");
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(showToast._timer);
    showToast._timer = setTimeout(() => toast.classList.remove("show"), 2200);
  }

  $("#year").textContent = new Date().getFullYear();
});
