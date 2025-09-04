document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector(".search-form");
  const input = document.querySelector(".city-input");
  const searchBtn = document.querySelector(".search-btn");
  const weatherCard = document.querySelector(".weather-card");

  fetch("/data/countries.json")
    .then((res) => res.json())
    .then((countries) => {
      const select = document.querySelector(".country-select");
      if (!select) return;

      countries
        .sort((a, b) => a.name.localeCompare(b.name))
        .forEach((c) => {
          const option = document.createElement("option");
          option.value = c.code;
          option.textContent = `${c.flag} ${c.name}`;
          select.appendChild(option);
        });
    })
    .catch((err) => console.error("Error cargando países:", err));

  // Enfocar el input al cargar la página con un pequeño delay para mejor UX
  setTimeout(() => {
    if (input) {
      input.focus();
    }
  }, 100);

  if (form) {
    form.addEventListener("submit", function (e) {
      // NO prevenir el envío del formulario - solo agregar efectos visuales
      if (searchBtn && input.value.trim()) {
        searchBtn.textContent = "🔍 Buscando...";
        searchBtn.disabled = true;
        searchBtn.classList.add("loading");
        input.style.animation = "pulse 0.5s ease-out";
      }
    });
  }

  if (input) {
    let typingTimer;

    input.addEventListener("focus", function () {
      this.select();
      this.parentElement.style.transform = "scale(1.02)";
    });

    input.addEventListener("blur", function () {
      this.parentElement.style.transform = "scale(1)";
    });

    input.addEventListener("input", function () {
      clearTimeout(typingTimer);
      const value = this.value.trim();

      if (value.length > 0) {
        this.style.borderColor = "rgba(16, 185, 129, 0.5)";
        if (searchBtn) {
          searchBtn.style.background =
            "linear-gradient(135deg, #10b981 0%, #059669 100%)";
        }
      } else {
        this.style.borderColor = "rgba(255, 255, 255, 0.18)";
        if (searchBtn) {
          searchBtn.style.background = "";
        }
      }

      typingTimer = setTimeout(() => {
        this.style.boxShadow = "0 0 20px rgba(255, 255, 255, 0.2)";
        setTimeout(() => {
          this.style.boxShadow = "";
        }, 200);
      }, 500);
    });

    // Enter key enhancement - NO interferir con el envío normal
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && this.value.trim()) {
        // El formulario se enviará naturalmente, solo agregar efecto visual
        this.style.transform = "scale(0.98)";
        setTimeout(() => {
          this.style.transform = "scale(1)";
        }, 100);
      }
    });
  }

  if (weatherCard) {
    weatherCard.classList.add("success");

    const detailItems = document.querySelectorAll(".detail-item");
    detailItems.forEach((item, index) => {
      item.style.animationDelay = `${0.8 + index * 0.1}s`;
      item.style.animation = "fadeInUp 0.6s ease-out both";
    });

    detailItems.forEach((item) => {
      item.addEventListener("mouseenter", function () {
        this.style.background = "rgba(255, 255, 255, 0.25)";
        this.style.transform = "translateY(-8px) scale(1.02)";
      });

      item.addEventListener("mouseleave", function () {
        this.style.background = "rgba(255, 255, 255, 0.1)";
        this.style.transform = "translateY(0) scale(1)";
      });
    });
  }

  function updateBackgroundByWeather(weatherDescription) {
    const body = document.body;
    const description = weatherDescription?.toLowerCase() || "";

    if (description.includes("rain") || description.includes("lluvia")) {
      body.style.background =
        "linear-gradient(135deg, #4c669f 0%, #3b5998 50%, #192f5d 100%)";
    } else if (description.includes("cloud") || description.includes("nube")) {
      body.style.background =
        "linear-gradient(135deg, #bdc3c7 0%, #2c3e50 100%)";
    } else if (
      description.includes("clear") ||
      description.includes("despejado")
    ) {
      body.style.background =
        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
    } else if (description.includes("snow") || description.includes("nieve")) {
      body.style.background =
        "linear-gradient(135deg, #e6ddd4 0%, #d0c3d1 100%)";
    } else if (
      description.includes("thunder") ||
      description.includes("tormenta")
    ) {
      body.style.background =
        "linear-gradient(135deg, #434343 0%, #000000 100%)";
    }

    body.style.transition = "background 1s ease-in-out";
  }

  const weatherDescription = document.querySelector(
    ".weather-description"
  )?.textContent;
  if (weatherDescription) {
    updateBackgroundByWeather(weatherDescription);
  }

  let ticking = false;

  function updateParallax() {
    const scrolled = window.pageYOffset;
    const background = document.body;
    background.style.transform = `translateY(${scrolled * 0.1}px)`;
    ticking = false;
  }

  function requestParallaxUpdate() {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }

  window.addEventListener("scroll", requestParallaxUpdate);

  document.addEventListener("keydown", function (e) {
    // Escape key to clear form
    if (e.key === "Escape" && input) {
      input.value = "";
      input.focus();
    }

    if (e.altKey && e.key === "w") {
      input?.focus();
    }
  });

  const allAnimatedElements = document.querySelectorAll(
    ".weather-header, .weather-main, .weather-details"
  );

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.animation = "fadeInUp 0.8s ease-out";
          }
        });
      },
      { threshold: 0.1 }
    );

    allAnimatedElements.forEach((el) => {
      if (el) observer.observe(el);
    });
  }

  let mouseTrail = [];
  document.addEventListener("mousemove", function (e) {
    mouseTrail.push({ x: e.clientX, y: e.clientY, time: Date.now() });

    if (mouseTrail.length > 10) {
      mouseTrail.shift();
    }

    mouseTrail = mouseTrail.filter((point) => Date.now() - point.time < 1000);
  });

  const errorMessage = document.querySelector(".error-message");
  if (errorMessage) {
    const closeBtn = document.createElement("button");
    closeBtn.innerHTML = "×";
    closeBtn.style.cssText = `
            position: absolute;
            top: 10px;
            right: 15px;
            background: none;
            border: none;
            color: white;
            font-size: 1.5rem;
            cursor: pointer;
            opacity: 0.7;
            transition: opacity 0.2s ease;
        `;

    closeBtn.addEventListener("click", () => {
      errorMessage.style.animation = "fadeOut 0.3s ease-out";
      setTimeout(() => errorMessage.remove(), 300);
    });

    closeBtn.addEventListener(
      "mouseenter",
      () => (closeBtn.style.opacity = "1")
    );
    closeBtn.addEventListener(
      "mouseleave",
      () => (closeBtn.style.opacity = "0.7")
    );

    errorMessage.style.position = "relative";
    errorMessage.appendChild(closeBtn);
    setTimeout(() => {
      if (errorMessage.parentElement) {
        errorMessage.style.animation = "fadeOut 0.5s ease-out";
        setTimeout(() => errorMessage.remove(), 500);
      }
    }, 5000);
  }

  let resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      // Recalculate any dynamic sizes if needed
      console.log("Window resized - recalculating layouts");
    }, 250);
  });

  document.body.style.opacity = "0";
  setTimeout(() => {
    document.body.style.transition = "opacity 0.8s ease-out";
    document.body.style.opacity = "1";
  }, 100);
});

const geoBtn = document.getElementById("geo-btn");

if (geoBtn) {
  geoBtn.addEventListener("click", () => {
    if (navigator.geolocation) {
      geoBtn.disabled = true;

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;

          // Crear form dinámico y enviarlo
          const form = document.createElement("form");
          form.method = "POST";
          form.action = "/weather";

          const latInput = document.createElement("input");
          latInput.type = "hidden";
          latInput.name = "lat";
          latInput.value = latitude;

          const lonInput = document.createElement("input");
          lonInput.type = "hidden";
          lonInput.name = "lon";
          lonInput.value = longitude;

          form.appendChild(latInput);
          form.appendChild(lonInput);
          document.body.appendChild(form);
          form.submit();
        },
        (err) => {
          alert("No pudimos obtener tu ubicación: " + err.message);
          geoBtn.disabled = false;
        }
      );
    } else {
      alert("Tu navegador no soporta geolocalización.");
    }
  });
}
(() => {
  const input = document.querySelector(".city-input");
  if (!input) return;

  let suggestionsBox = null;

  const removeBox = () => {
    if (suggestionsBox) {
      suggestionsBox.remove();
      suggestionsBox = null;
    }
  };

  const positionBox = () => {
    if (!suggestionsBox) return;
    const rect = input.getBoundingClientRect();
    suggestionsBox.style.position = "fixed"; // importante: fijo al viewport
    suggestionsBox.style.top = `${rect.bottom + 6}px`;
    suggestionsBox.style.left = `${rect.left}px`;
    suggestionsBox.style.width = `${rect.width}px`;
    suggestionsBox.style.zIndex = "99999";
  };

  input.addEventListener("input", async function () {
    const query = this.value.trim();
    if (query.length < 3) {
      removeBox();
      return;
    }

    try {
      const selectedCountry = document.querySelector(".country-select")?.value;
      const queryParam = selectedCountry
        ? `${query},${selectedCountry}`
        : query;

      const res = await fetch(`/geocode?q=${encodeURIComponent(queryParam)}`);
      const cities = await res.json();

      // --- Deduplicar ---
      const uniqueCities = [];
      const seen = new Set();

      cities.forEach((city) => {
        const key = `${city.name.toLowerCase()}-${city.country}`;
        if (!seen.has(key)) {
          seen.add(key);
          uniqueCities.push(city);
        }
      });

      // --- Priorizar coincidencia exacta ---
      const exactMatches = uniqueCities.filter(
        (c) => c.name.toLowerCase() === query.toLowerCase()
      );
      const others = uniqueCities.filter(
        (c) => c.name.toLowerCase() !== query.toLowerCase()
      );
      const finalResults = [...exactMatches, ...others].slice(0, 5);

      // --- Limpiar y crear box ---
      removeBox();
      suggestionsBox = document.createElement("div");
      suggestionsBox.className = "suggestions-box";
      document.body.appendChild(suggestionsBox);

      // --- Renderizar resultados ---
      finalResults.forEach((city) => {
        const item = document.createElement("div");
        item.className = "suggestion-item";
        item.textContent = `${city.name}, ${city.country}`;

        item.addEventListener("click", () => {
          const form = document.createElement("form");
          form.method = "POST";
          form.action = "/weather";

          const latInput = document.createElement("input");
          latInput.type = "hidden";
          latInput.name = "lat";
          latInput.value = city.lat;

          const lonInput = document.createElement("input");
          lonInput.type = "hidden";
          lonInput.name = "lon";
          lonInput.value = city.lon;

          const countryInput = document.createElement("input");
          countryInput.type = "hidden";
          countryInput.name = "country";
          countryInput.value = city.country;

          form.appendChild(latInput);
          form.appendChild(lonInput);
          form.appendChild(countryInput);

          document.body.appendChild(form);
          form.submit();
        });

        suggestionsBox.appendChild(item);
      });

      positionBox();
    } catch (err) {
      console.error("Error obteniendo sugerencias:", err);
    }
  });

  window.addEventListener("scroll", positionBox, { passive: true });
  window.addEventListener("resize", positionBox);
  document.addEventListener("click", (e) => {
    if (!suggestionsBox) return;
    if (e.target === input || suggestionsBox.contains(e.target)) return;
    removeBox();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") removeBox();
  });
})();

// Add fadeOut animation for error messages
const style = document.createElement("style");
style.textContent = `
    @keyframes fadeOut {
        from { opacity: 1; transform: translateY(0); }
        to { opacity: 0; transform: translateY(-20px); }
    }
    
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
    }
`;
document.head.appendChild(style);
