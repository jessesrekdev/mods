const prevData = JSON.parse(localStorage.getItem('prev_data'));

if (!prevData) {
//   alert('No app data found.');
//   window.location.href = '/';
} else {
  const appLogo = document.getElementById('ic_logo');
  const appLogoo = document.getElementById('ic_logoo');
  const appName = document.getElementById('prev_name');
  const screenshot = document.getElementById('screenshot');
  const downloadBtn = document.getElementById('download_btn');
const modinfocategory = document.getElementById('detail_category');
const modinfoversion = document.getElementById('detail_version');
const modinfosize = document.getElementById('detail_size');
const modinfoupdated = document.getElementById('detail_updated');
const modinfoname = document.getElementById('detail_name');
const info = document.getElementById('info');

  appLogo.src = prevData.icon;
  appLogo.alt = prevData.name;
  appLogoo.src = prevData.icon;
  appName.textContent = prevData.name;
  screenshot.src = prevData.screenshot;
  modinfoname.textContent = prevData.name;
  modinfocategory.textContent = prevData.category;
  modinfoversion.textContent = prevData.version;
  modinfosize.textContent = prevData.size;
  modinfoupdated.textContent = prevData.updated;
  info.textContent = prevData.info;

  console.log(prevData);

  // Clear any existing screenshots
  appScreenshotsContainer.innerHTML = '';

  if (prevData.screenshot && prevData.screenshot.length > 0) {
    prevData.screenshot.forEach(src => {
      const img = document.createElement('img');
      img.src = src;
      img.alt = `${prevData.name} screenshot`;
      img.classList.add('screenshot-img');
      appScreenshotsContainer.appendChild(img);
    });
  } else {
    appScreenshotsContainer.textContent = 'No screenshots available.';
  }

  if (prevData.dw) {
    downloadBtn.href = prevData.dw;
  } else {
    downloadBtn.style.display = 'none';
  }
}

document.getElementById('app_detail_icon').src = prevData.icon;
document.getElementById('detail_name').textContent = prevData.name;

// Optional: if your JSON includes these, update accordingly
if (prevData.category) document.getElementById('detail_category').textContent = prevData.category;
if (prevData.version) document.getElementById('detail_version').textContent = prevData.version;
if (prevData.size) document.getElementById('detail_size').textContent = prevData.size;
if (prevData.updated) document.getElementById('detail_updated').textContent = prevData.updated;

