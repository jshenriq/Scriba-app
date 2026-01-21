const toggleButton = document.querySelector(".menu-toggle");
const headerRight = document.querySelector(".header-right");
const overlay = document.getElementById("overlay");

// Alterna a sidebar ao clicar no toggle
if (toggleButton && headerRight && overlay) {
  toggleButton.addEventListener("click", () => {
    headerRight.classList.toggle("active");
    toggleButton.classList.toggle("active");
    overlay.classList.toggle("active");
    document.body.classList.toggle("menu-open");
  });

  overlay.addEventListener("click", () => {
    headerRight.classList.remove("active");
    toggleButton.classList.remove("active");
    overlay.classList.remove("active");
    document.body.classList.remove("menu-open");
  });

  const links = headerRight.querySelectorAll("a");
  links.forEach((link) => {
    link.addEventListener("click", () => {
      headerRight.classList.remove("active");
      toggleButton.classList.remove("active");
      overlay.classList.remove("active");
      document.body.classList.remove("menu-open");
    });
  });
}

const link = document.getElementById("newsletter-link");
const newsletter = document.getElementById("newsletter");
const newsletterInput = document.querySelector("#newsletter-input");

if (link && newsletter && newsletterInput) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          newsletter.classList.remove("newsletter-active");
          void newsletter.offsetWidth;
          newsletter.classList.add("newsletter-active");

          setTimeout(() => {
            newsletterInput.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
            newsletterInput.focus({ preventScroll: true });
          }, 600);

          observer.unobserve(newsletter);
        }
      });
    },
    { threshold: 0.5 }
  );

  link.addEventListener("click", () => {
    observer.observe(newsletter);
  });
}

// Mobile UX: Centraliza o campo acima do teclado após a abertura
const formInputs = document.querySelectorAll(
  ".auth-form input, .footer-newsletter input",
);
function handleScroll(e) {
  const isMobile = window.matchMedia("(max-width: 768px)").matches;
  if (!isMobile) return;
  
  const input = e.target;
  if (e.type === "focus") {
    input.focus({ preventScroll: true });
  }
  setTimeout(() => {
    this.scrollIntoView({ behavior: "auto", block: "center" });
  }, 300);
}

formInputs.forEach((input) => {
  input.addEventListener("focus", handleScroll);
  input.addEventListener("click", handleScroll);
});


//for index.ejs page 
let page = 1;
let currentSearch = "";
const btn = document.getElementById("loadMoreBtn");
const container = document.getElementById("postsContainer");
const template = document.getElementById("post-template");
const searchInput = document.querySelector(".search-input");

// --- (RATE LIMIT & COUNTDOWN) ---

function startCountdown() {
    const banner = document.getElementById("rate-limit-banner");
    const timerDisplay = document.getElementById("timer-count");

    // Ativa o banner abaixo do header
    if (banner) banner.classList.add("active");

    const interval = setInterval(() => {
        const blockUntil = localStorage.getItem('reqs_blocked_until');
        const remaining = blockUntil - Date.now();

        if (remaining <= 0) {
            clearInterval(interval);
            localStorage.removeItem('reqs_blocked_until');
            if (banner) banner.classList.remove("active");
            window.location.reload(); 
        } else {
            const minutes = Math.floor(remaining / 60000);
            const seconds = Math.floor((remaining % 60000) / 1000);
            if (timerDisplay) {
                timerDisplay.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
            }
        }
    }, 1000);
}

// Verificação imediata ao carregar a página
document.addEventListener("DOMContentLoaded", () => {
  const blockUntil = localStorage.getItem("reqs_blocked_until");
  if (blockUntil && Date.now() < blockUntil) {
    startCountdown();
  } else {
    localStorage.removeItem("reqs_blocked_until");
  }
});

// --- LÓGICA DE CARREGAMENTO DE POSTS ---

async function fetchPosts(isNewSearch = false) {
  // Se o usuário está bloqueado no localStorage, nem tenta fazer o fetch
  if (localStorage.getItem("reqs_blocked_until")) return;

  if (isNewSearch) {
    page = 1;
    container.innerHTML = "";
  }

  try {
    const res = await fetch(
      `/api/posts?page=${page}&search=${encodeURIComponent(currentSearch)}`,
    );

    // TRATAMENTO DO RATE LIMIT (429)
    if (res.status === 429) {
      const data = await res.json();
      const retryAfter = data.retryAfter || 900;
      localStorage.setItem("reqs_blocked_until", Date.now() + retryAfter * 1000);
      startCountdown();
      return;
    }

    if (!res.ok) throw new Error(`Erro: ${res.status}`);

    const { posts, hasMore } = await res.json();

    if (posts.length === 0 && isNewSearch) {
      container.innerHTML = `<p style="text-align: center; width: 100%; margin-top: 40px;">Nenhum post encontrado para "${currentSearch}"</p>`;
    }

    posts.forEach((post) => {
      const clone = template.content.cloneNode(true);
      const cardImg = clone.querySelector(".card-image");
      if (post.img_url && cardImg) {
        cardImg.style.backgroundImage = `url('${post.img_url}')`;
      }

      clone.querySelector("h3").textContent = post.title;
      clone.querySelector("p").textContent = post.content;
      clone.querySelector("small").innerHTML =
        `By <strong>${post.author}</strong> • ${post.formatted_date}`;
      clone.querySelector("a").href = `/post/${post.id}`;
      container.appendChild(clone);
    });

    if (btn) {
      hasMore
        ? (btn.style.display = "inline-block")
        : (btn.style.display = "none");
    }

    const titleElem = document.getElementById("sectionTitle");
    if (titleElem) {
      titleElem.textContent =
        currentSearch && currentSearch.trim() !== ""
          ? `Resultados para: "${currentSearch}"`
          : "Posts Recentes";
    }
  } catch (error) {
    console.error("Erro ao carregar posts:", error);
  }
}

// --- EVENTOS ---

if (btn) {
  btn.addEventListener("click", () => {
    page++;
    fetchPosts(false);
  });
}

let pendingSearch;
if (searchInput) {
  searchInput.addEventListener("input", (e) => {
    clearTimeout(pendingSearch);
    pendingSearch = setTimeout(() => {
      currentSearch = e.target.value;
      fetchPosts(true);
    }, 1000);
  });
}



