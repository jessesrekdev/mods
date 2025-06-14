
const main_name = document.getElementById('name');
const main_logo = document.getElementById('app_logo');

document.addEventListener('DOMContentLoaded', () => {
  const topContainer = document.getElementById('top-list');
  const modContainer = document.getElementById('mod-list');
  const favs = JSON.parse(localStorage.getItem('favorites')) || [];

  let topData = [], modData = [];
  let globalTopData = [];
  let globalModData = [];

  // Load top.json
  fetch('/top.json')
    .then(res => res.json())
    .then(data => {
      topData = data;
      globalTopData = data;
      topContainer.innerHTML = topData.map(app => generateTopCard(app, favs)).join('');
      bindFavButtons();
    });

  // Load data.json
  fetch('/data.json')
    .then(res => res.json())
    .then(data => {
      modData = data;
      globalModData = data;
      modContainer.innerHTML = modData.map(app => generateModCard(app, favs)).join('');
      bindFavButtons();
      bindCardClicks();
    });

  function generateModCard(app, favs) {
    const template = document.getElementById('mod-card-template');
    const clone = template.content.cloneNode(true);
    const card = clone.querySelector('.card');
    const img = clone.querySelector('img');
    const h3 = clone.querySelector('h3');
    const favBtn = clone.querySelector('.fav-btn');

    img.src = app.icon;
    img.alt = app.name;
    h3.textContent = app.name;
    favBtn.dataset.id = app.id;
    card.dataset.id = app.id;

    if (favs.includes(app.id)) {
      favBtn.classList.add('fav-active');
    }

    return card.outerHTML;
  }

  function generateTopCard(app, favs = []) {
    return `
      <div class="topcontainer">
        <div class="topmod-card" style="background-image: url('${app.bg}'); background-size: cover; background-position: center;">
          <div class="topapp-icon">
            <img src="${app.icon}" alt="${app.name}">
          </div>
          <div class="topapp-info">
            <div class="topapp-name">${app.name}</div>
            <div class="topstar-rating">
              ${'<svg viewBox="0 0 24 24"><path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.782 1.402 8.172L12 18.896l-7.336 3.858 1.402-8.172L.132 9.21l8.2-1.192z"/></svg>'.repeat(5)}
            </div>
          </div>
          <button class="topfav-btn ${favs.includes(app.id) ? 'fav-active' : ''}" data-id="${app.id}">
            <svg viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 
              2 12.28 2 8.5 2 5.42 
              4.42 3 7.5 3c1.74 0 
              3.41 0.81 4.5 2.09C13.09 3.81 
              14.76 3 16.5 3 19.58 3 
              22 5.42 22 8.5c0 
              3.78-3.4 6.86-8.55 11.54L12 
              21.35z"></path></svg>
          </button>
        </div>
      </div>
    `;
  }

  function bindFavButtons() {
    document.querySelectorAll('.fav-btn, .topfav-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        let favList = JSON.parse(localStorage.getItem('favorites')) || [];
        if (favList.includes(id)) {
          favList = favList.filter(f => f !== id);
          btn.classList.remove('fav-active');
        } else {
          favList.push(id);
          btn.classList.add('fav-active');
        }
        localStorage.setItem('favorites', JSON.stringify(favList));
      });
    });
  }

  function bindCardClicks() {
    document.querySelectorAll('.card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (!e.target.closest('.fav-btn')) {
          const id = card.dataset.id;

          // Find app data from global arrays
          const app = globalModData.find(a => a.id === id) || globalTopData.find(a => a.id === id);

          if (app) {
            localStorage.setItem('prev_data', JSON.stringify({
              name: app.name,
              icon: app.icon,
              screenshot: app.screenshot || [],
              dw: app.dw || '',
              category: app.category,
              version: app.version,
              size: app.size,
              updated: app.updated,
              info: app.info
            }));

            window.location.href = `/app_prev`;
          } else {
            console.error('App data not found for id:', id);
          }
        }
      });
    });
  }

  // === SEARCH LOGIC ===
  const searchIcon = document.querySelector('.search-icon img');
  const menuIcon = document.querySelector('.menu-icon');
  const searchWrapper = document.querySelector('.search-bar-wrapper');
  const searchBar = document.getElementById('search-bar');
  const noResults = document.getElementById('no-results');
  const topList = document.getElementById('top-list');
  const modList = document.getElementById('mod-list');
  const footer_v = document.getElementById('footer');

  let isSearchActive = false;

  function toggleSearch() {
    if (!isSearchActive) {
      searchIcon.src = '/assets/icons/close.svg';
      searchWrapper.classList.add('active');
      menuIcon.style.display = 'none';
      searchBar.focus();
      isSearchActive = true;
      main_name.style.display = 'none';
    } else {
      searchIcon.src = '/assets/icons/search.svg';
      searchWrapper.classList.remove('active');
      menuIcon.style.display = '';
      searchBar.value = '';
      const favs = JSON.parse(localStorage.getItem('favorites')) || [];
      topList.innerHTML = globalTopData.map(app => generateTopCard(app, favs)).join('');
      modList.innerHTML = globalModData.map(app => generateModCard(app, favs)).join('');
      bindFavButtons();
      bindCardClicks();
      noResults.classList.remove('active');
      isSearchActive = false;
      main_name.style.display = 'block';
      footer_v.style.display = 'block';
    }
  }

  searchIcon.parentElement.addEventListener('click', toggleSearch);

  searchBar.addEventListener('input', () => {
    footer_v.style.display = 'none';

    const query = searchBar.value.toLowerCase();
    let topMatch = false;
    let modMatch = false;

    const topCards = topList.querySelectorAll('.topcontainer');
    const modCards = modList.querySelectorAll('.card');

    topCards.forEach(card => {
      const name = card.querySelector('.topapp-name')?.textContent.toLowerCase();
      const match = name.includes(query);
      card.style.display = match ? '' : 'none';
      if (match) topMatch = true;
    });

    modCards.forEach(card => {
      const name = card.querySelector('h3')?.textContent.toLowerCase();
      const match = name.includes(query);
      card.style.display = match ? '' : 'none';
      if (match) modMatch = true;
    });

    if (!topMatch && !modMatch) {
      noResults.classList.add('active');
    } else {
      noResults.classList.remove('active');
    }
  });
});

function openInstagram() {
  const username = "_cutest_problem_";
  const scheme = `instagram://user?username=${username}`;
  const fallback = `https://instagram.com/${username}`;

  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  const timeout = setTimeout(() => {
    window.location.href = fallback;
  }, 1000);

  const iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  iframe.src = scheme;
  document.body.appendChild(iframe);

  setTimeout(() => {
    document.body.removeChild(iframe);
    clearTimeout(timeout);
  }, 1500);
}

function openTelegram() {
  const username = "jesse_network";
  const tgAppLink = `tg://resolve?domain=${username}`;
  const tgWebLink = `https://t.me/${username}`;

  const timeout = setTimeout(() => {
    window.location.href = tgWebLink;
  }, 1000);

  const iframe = document.createElement("iframe");
  iframe.style.display = "none";
  iframe.src = tgAppLink;
  document.body.appendChild(iframe);

  setTimeout(() => {
    document.body.removeChild(iframe);
    clearTimeout(timeout);
  }, 1500);
}

const close_menu = document.getElementById('close_menu');
const app_menu_ic = document.getElementById('app_menu_ic');

close_menu.addEventListener('click', function () {
  document.getElementById('glassOverlay').style.display = 'none';
});

document.querySelector('.menu-icon img').addEventListener('click', function () {
  document.getElementById('glassOverlay').style.display = 'flex';
});
