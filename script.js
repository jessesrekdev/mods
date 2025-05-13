function goToSite() {
  animateStars(event);
  setTimeout(() => window.location.href = "https://jesse-network.com", 500);
}

function goToTelegram() {
  animateStars(event);
  setTimeout(() => window.location.href = "https://t.me/jesse_network", 500);
}

function animateStars(e) {
  const btn = e.currentTarget;
  const starsContainer = btn.querySelector(".stars");
  starsContainer.innerHTML = "";

  for (let i = 0; i < 5; i++) {
    const star = document.createElement("div");
    star.className = "star";
    const x = (Math.random() - 0.5) * 100 + "px";
    const y = (Math.random() - 1) * 100 + "px";
    star.style.setProperty("--x", x);
    star.style.setProperty("--y", y);
    starsContainer.appendChild(star);
  }
}


function goToSite(event) {
  animateStars(event);
  setTimeout(() => window.location.href = "https://jesse-network.com", 500);
}

function goToTelegram(event) {
  animateStars(event);
  setTimeout(() => window.location.href = "https://t.me/jesse_network", 500);
}
