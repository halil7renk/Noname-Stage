const platformLogos = {
  apple: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16.45 12.6c-.02-2.42 1.98-3.58 2.07-3.64-1.13-1.65-2.88-1.88-3.5-1.9-1.49-.15-2.9.87-3.66.87-.76 0-1.94-.85-3.19-.83-1.64.03-3.15.95-4 2.42-1.7 2.95-.44 7.31 1.22 9.7.81 1.17 1.78 2.49 3.05 2.44 1.22-.05 1.69-.79 3.17-.79 1.48 0 1.9.79 3.19.77 1.32-.02 2.16-1.2 2.96-2.38.93-1.36 1.31-2.68 1.33-2.75-.03-.01-2.57-.98-2.64-3.91ZM14.06 5.49c.67-.81 1.12-1.94 1-3.06-.96.04-2.12.64-2.81 1.45-.62.72-1.16 1.87-1.02 2.97 1.07.08 2.16-.55 2.83-1.36Z"/></svg>`,
  spotify: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm4.58 14.42a.74.74 0 0 1-1.02.24c-2.8-1.71-6.32-2.1-10.47-1.15a.75.75 0 0 1-.33-1.46c4.55-1.04 8.45-.59 11.58 1.32.35.22.46.69.24 1.05Zm1.22-2.72a.92.92 0 0 1-1.27.31c-3.2-1.97-8.08-2.54-11.86-1.39a.93.93 0 0 1-.54-1.78c4.32-1.31 9.7-.68 13.36 1.57.43.26.57.84.31 1.29Zm.1-2.84C14.06 8.58 7.73 8.37 4.07 9.48a1.11 1.11 0 1 1-.64-2.13c4.2-1.27 11.2-1.03 15.6 1.58a1.11 1.11 0 0 1-1.13 1.93Z"/></svg>`,
  youtube: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M23.5 6.2a3 3 0 0 0-2.11-2.12C19.53 3.58 12 3.58 12 3.58s-7.53 0-9.39.5A3 3 0 0 0 .5 6.2 31.24 31.24 0 0 0 0 12a31.24 31.24 0 0 0 .5 5.8 3 3 0 0 0 2.11 2.12c1.86.5 9.39.5 9.39.5s7.53 0 9.39-.5a3 3 0 0 0 2.11-2.12A31.24 31.24 0 0 0 24 12a31.24 31.24 0 0 0-.5-5.8ZM9.6 15.58V8.42L15.86 12 9.6 15.58Z"/></svg>`,
  youtubeMusic: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 1 0 .01 0H12Zm0 2.2a7.8 7.8 0 1 1 0 15.6 7.8 7.8 0 0 1 0-15.6Zm0 2.6a5.2 5.2 0 1 0 0 10.4 5.2 5.2 0 0 0 0-10.4Zm-1.6 2.56L14.8 12l-4.4 2.64V9.36Z"/></svg>`,
  instagram: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.8 2h8.4A5.8 5.8 0 0 1 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8A5.8 5.8 0 0 1 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2Zm0 2A3.8 3.8 0 0 0 4 7.8v8.4A3.8 3.8 0 0 0 7.8 20h8.4a3.8 3.8 0 0 0 3.8-3.8V7.8A3.8 3.8 0 0 0 16.2 4H7.8Zm4.2 3.25A4.75 4.75 0 1 1 7.25 12 4.75 4.75 0 0 1 12 7.25Zm0 2A2.75 2.75 0 1 0 14.75 12 2.75 2.75 0 0 0 12 9.25Zm5-2.75a1.1 1.1 0 1 1-1.1 1.1A1.1 1.1 0 0 1 17 6.5Z"/></svg>`,
  facebook: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.7 4.53-4.7 1.31 0 2.68.24 2.68.24v2.96h-1.51c-1.49 0-1.96.93-1.96 1.89v2.27h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07Z"/></svg>`,
  tiktok: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16.6 5.82a5.77 5.77 0 0 0 3.36 1.08v3.48a9.2 9.2 0 0 1-3.33-.64v5.75a6.13 6.13 0 1 1-6.12-6.13c.37 0 .72.03 1.07.1v3.54a2.7 2.7 0 1 0 1.9 2.58V2h3.36c.06 1.52.72 2.9 1.76 3.82Z"/></svg>`,
  twitter: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18.9 2H22l-6.78 7.75L23.2 22h-6.24l-4.89-6.39L6.48 22H3.37l7.25-8.29L2.97 2h6.4l4.42 5.84L18.9 2Zm-1.1 17.84h1.72L8.44 4.05H6.59L17.8 19.84Z"/></svg>`,
};

const platforms = [
  { key: "apple", label: "Apple Music", tone: "#f1b45f" },
  { key: "spotify", label: "Spotify", tone: "#74c67a" },
  { key: "youtube", label: "YouTube", tone: "#e66a8d" },
  { key: "youtubeMusic", label: "YouTube Music", tone: "#e66a8d" },
  { key: "instagram", label: "Instagram", tone: "#c879ff" },
  { key: "facebook", label: "Facebook", tone: "#7bb6ff" },
  { key: "tiktok", label: "TikTok", tone: "#42d6c5" },
  { key: "twitter", label: "Twitter / X", tone: "#f5f7f8" },
];

const homeView = document.querySelector("#homeView");
const memberScreen = document.querySelector("#memberScreen");
const artistForm = document.querySelector("#artistForm");
const artistList = document.querySelector("#artistList");
const searchInput = document.querySelector("#searchInput");
const formStatus = document.querySelector("#formStatus");
const artistCountHero = document.querySelector("#artistCountHero");
const platformCountHero = document.querySelector("#platformCountHero");
const profileCountHero = document.querySelector("#profileCountHero");
const profilePanel = document.querySelector("#profilePanel");
const profileAvatar = document.querySelector("#profileAvatar");
const profileGenre = document.querySelector("#profileGenre");
const profileName = document.querySelector("#profileName");
const profileCity = document.querySelector("#profileCity");
const profileLinks = document.querySelector("#profileLinks");
const authTabs = document.querySelectorAll("[data-auth-mode]");
const profileFields = document.querySelector("#profileFields");
const submitButton = document.querySelector("#submitButton");
const formTitle = document.querySelector("#formTitle");
const formEyebrow = document.querySelector("#formEyebrow");
const accountStatus = document.querySelector("#accountStatus");
const logoutButton = document.querySelector("#logoutButton");
const joinLink = document.querySelector("#joinLink");
const backToHomeButton = document.querySelector("#backToHomeButton");
const memberAvatar = document.querySelector("#memberAvatar");
const memberNumber = document.querySelector("#memberNumber");
const memberName = document.querySelector("#memberName");
const memberMeta = document.querySelector("#memberMeta");
const memberStats = document.querySelector("#memberStats");
const memberLinks = document.querySelector("#memberLinks");
const memberDetails = document.querySelector("#memberDetails");
const memberOtherArtists = document.querySelector("#memberOtherArtists");

let artists = [];
let currentUser = null;
let currentArtist = null;
let authMode = "register";

function api(path, options = {}) {
  return fetch(path, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    credentials: "same-origin",
    ...options,
  }).then(async (response) => {
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(payload.error || "İşlem tamamlanamadı.");
    }
    return payload;
  });
}

async function init() {
  try {
    const [artistPayload, mePayload] = await Promise.all([api("/api/artists"), api("/api/me")]);
    artists = artistPayload.artists || [];
    currentUser = mePayload.user;
    currentArtist = mePayload.artist;
    if (currentUser && currentArtist) {
      authMode = "edit";
      fillProfileForm(currentArtist);
      updateAuthUi();
      renderArtists();
      showMemberScreen(currentArtist);
      return;
    }
    updateAuthUi();
    renderArtists();
  } catch (error) {
    showStatus(error.message, "error");
  }
}

function updateAuthUi() {
  const isLoggedIn = Boolean(currentUser);
  const isLogin = authMode === "login";
  const isEdit = authMode === "edit";

  authTabs.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.authMode === authMode);
    button.hidden = isEdit;
  });

  profileFields.hidden = isLogin;
  profileFields.querySelectorAll("input[name='name'], input[name='genre'], input[name='city']").forEach((input) => {
    input.required = !isLogin;
  });

  logoutButton.hidden = !isLoggedIn;
  joinLink.textContent = isLoggedIn ? "Profilim" : "Katıl";

  if (isEdit) {
    formEyebrow.textContent = "Profil yönetimi";
    formTitle.textContent = "Profil bilgilerini güncelle";
    accountStatus.textContent = "Üyelik oluşturma tamamlandı. Buradan sadece profilini düzenlersin.";
    submitButton.textContent = "Profili güncelle";
    artistForm.email.value = currentUser.email;
    artistForm.email.disabled = true;
    artistForm.password.value = "";
    artistForm.password.required = false;
    artistForm.password.disabled = true;
    return;
  }

  artistForm.email.disabled = false;
  artistForm.password.disabled = false;
  artistForm.password.required = true;
  formEyebrow.textContent = isLogin ? "Giriş" : "Gerçek üyelik";
  formTitle.textContent = isLogin ? "Sanatçı hesabına giriş yap" : "Sanatçı hesabı oluştur";
  accountStatus.textContent = isLogin
    ? "Kayıtlı e-posta ve şifrenle profilini yönetebilirsin."
    : "Kayıt olduğunda sana özel profil ekranı açılır.";
  submitButton.textContent = isLogin ? "Giriş yap" : "Hesabı oluştur ve yayınla";
}

function getFormPayload() {
  const formData = new FormData(artistForm);
  const payload = Object.fromEntries(formData.entries());
  for (const key of Object.keys(payload)) {
    payload[key] = typeof payload[key] === "string" ? payload[key].trim() : payload[key];
  }
  return payload;
}

function fillProfileForm(artist) {
  if (!artist) return;
  for (const key of ["name", "genre", "city", ...platforms.map((platform) => platform.key)]) {
    if (artistForm.elements[key]) {
      artistForm.elements[key].value = artist[key] || "";
    }
  }
}

async function refreshArtists() {
  const payload = await api("/api/artists");
  artists = payload.artists || [];
  renderArtists();
  if (currentArtist) {
    const freshArtist = artists.find((artist) => artist.id === currentArtist.id);
    if (freshArtist) currentArtist = freshArtist;
  }
}

function initials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toLocaleUpperCase("tr-TR");
}

function artistLinks(artist) {
  return platforms.filter((platform) => artist[platform.key]);
}

function platformCount(artist) {
  return artistLinks(artist).length;
}

function activePlatformCount() {
  return platforms.filter((platform) => artists.some((artist) => artist[platform.key])).length;
}

function filteredArtists() {
  const query = searchInput.value.trim().toLocaleLowerCase("tr-TR");
  if (!query) return artists;

  return artists.filter((artist) => {
    const text = `${artist.name} ${artist.genre} ${artist.city}`.toLocaleLowerCase("tr-TR");
    return text.includes(query);
  });
}

function renderCounters() {
  artistCountHero.textContent = artists.length;
  platformCountHero.textContent = activePlatformCount();
  profileCountHero.textContent = artists.length;
}

function renderArtists() {
  const visibleArtists = filteredArtists();
  renderCounters();

  if (visibleArtists.length === 0) {
    artistList.innerHTML = `<div class="empty-state">Henüz gerçek sanatçı kaydı yok. İlk profili oluşturmak için katıl.</div>`;
    return;
  }

  artistList.innerHTML = visibleArtists
    .map(
      (artist) => `
        <button class="artist-row" type="button" data-artist-id="${artist.id}">
          <span class="avatar">${initials(artist.name)}</span>
          <span>
            <span class="artist-row__name">${escapeHtml(artist.name)}</span>
            <span class="artist-row__meta">${escapeHtml(artist.genre)} · ${escapeHtml(artist.city)}</span>
          </span>
          <span class="artist-row__count">${platformCount(artist)} bağlantı</span>
        </button>
      `
    )
    .join("");
}

function platformIcon(platform) {
  return `<span class="platform-mark" style="--platform-tone: ${platform.tone}">${platformLogos[platform.key]}</span>`;
}

function renderLinkItems(artist, mode = "modal") {
  const links = artistLinks(artist);
  if (!links.length) {
    return `<div class="empty-state">Bu profilde henüz bağlantı yok.</div>`;
  }

  return links
    .map(
      (platform) => `
        <a class="${mode === "member" ? "member-link-card" : "link-item"}" href="${escapeHtml(artist[platform.key])}" target="_blank" rel="noreferrer">
          <span class="${mode === "member" ? "member-link-card__icon" : "link-item__icon"}">
            ${platformIcon(platform)}
          </span>
          <span>
            <span class="${mode === "member" ? "member-link-card__label" : "link-item__label"}">${platform.label}</span>
            <span class="${mode === "member" ? "member-link-card__url" : "link-item__url"}">${escapeHtml(artist[platform.key])}</span>
          </span>
          <span class="${mode === "member" ? "member-link-card__open" : "link-item__open"}">Aç</span>
        </a>
      `
    )
    .join("");
}

function renderMemberDirectory() {
  const otherArtists = artists.filter((artist) => !currentArtist || artist.id !== currentArtist.id);

  if (!otherArtists.length) {
    memberOtherArtists.innerHTML = `<div class="empty-state">Henüz başka üye yok. Yeni üyeler geldikçe burada görünecek.</div>`;
    return;
  }

  memberOtherArtists.innerHTML = otherArtists
    .map(
      (artist) => `
        <button class="member-artist-card" type="button" data-artist-id="${artist.id}">
          <span class="avatar">${initials(artist.name)}</span>
          <span>
            <span class="artist-row__name">${escapeHtml(artist.name)}</span>
            <span class="artist-row__meta">${escapeHtml(artist.genre)} · ${escapeHtml(artist.city)}</span>
          </span>
          <span class="artist-row__count">${platformCount(artist)} bağlantı</span>
        </button>
      `
    )
    .join("");
}

function renderProfile(artist) {
  profileAvatar.textContent = initials(artist.name);
  profileGenre.textContent = "Bağlantılar";
  profileName.textContent = artist.name;
  profileCity.textContent = "";
  profileLinks.innerHTML = renderLinkItems(artist);

  profilePanel.classList.add("is-open");
  profilePanel.setAttribute("aria-hidden", "false");
}

function renderMemberScreen(artist) {
  memberAvatar.textContent = initials(artist.name);
  memberNumber.textContent = artist.memberNo ? `Üye #${artist.memberNo}` : "Yeni üye";
  memberName.textContent = artist.name;
  memberMeta.textContent = `${artist.genre} · ${artist.city}`;
  memberStats.innerHTML = `
    <span><strong>${platformCount(artist)}</strong> bağlantı</span>
    <span><strong>${artists.length}</strong> toplam sanatçı</span>
    <span><strong>${activePlatformCount()}</strong> aktif platform</span>
  `;
  memberDetails.innerHTML = `
    <span><strong>Sanatçı adı</strong>${escapeHtml(artist.name)}</span>
    <span><strong>Tür</strong>${escapeHtml(artist.genre)}</span>
    <span><strong>Şehir</strong>${escapeHtml(artist.city)}</span>
  `;
  memberLinks.innerHTML = renderLinkItems(artist, "member");
  renderMemberDirectory();
}

function showMemberScreen(artist) {
  renderMemberScreen(artist);
  homeView.hidden = true;
  memberScreen.hidden = false;
  document.querySelector("#artists").hidden = true;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function showHomeScreen() {
  homeView.hidden = false;
  memberScreen.hidden = true;
  document.querySelector("#artists").hidden = false;
}

function closeProfile() {
  profilePanel.classList.remove("is-open");
  profilePanel.setAttribute("aria-hidden", "true");
}

function showStatus(message, type = "success") {
  formStatus.textContent = message;
  formStatus.classList.toggle("is-error", type === "error");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

artistForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  submitButton.disabled = true;
  showStatus("İşleniyor...");

  try {
    const payload = getFormPayload();

    if (authMode === "login") {
      const result = await api("/api/login", { method: "POST", body: JSON.stringify(payload) });
      currentUser = result.user;
      currentArtist = result.artist;
      authMode = "edit";
      fillProfileForm(currentArtist);
      updateAuthUi();
      showStatus("Giriş başarılı. Profilini düzenleyebilirsin.");
      await refreshArtists();
      if (currentArtist) showMemberScreen(currentArtist);
    } else if (authMode === "edit") {
      const result = await api("/api/artists/me", { method: "PUT", body: JSON.stringify(payload) });
      currentArtist = result.artist;
      fillProfileForm(currentArtist);
      showStatus("Profil güncellendi ve canlı listeye işlendi.");
      await refreshArtists();
      showMemberScreen(currentArtist);
    } else {
      const result = await api("/api/register", { method: "POST", body: JSON.stringify(payload) });
      currentUser = result.user;
      currentArtist = result.artist;
      authMode = "edit";
      updateAuthUi();
      await refreshArtists();
      showStatus("Hesap oluşturuldu ve profil yayınlandı.");
      showMemberScreen(currentArtist);
    }
  } catch (error) {
    showStatus(error.message, "error");
  } finally {
    submitButton.disabled = false;
  }
});

authTabs.forEach((button) => {
  button.addEventListener("click", () => {
    authMode = button.dataset.authMode;
    artistForm.reset();
    showStatus("");
    showHomeScreen();
    updateAuthUi();
  });
});

logoutButton.addEventListener("click", async () => {
  try {
    await api("/api/logout", { method: "POST", body: "{}" });
    currentUser = null;
    currentArtist = null;
    authMode = "login";
    artistForm.reset();
    showHomeScreen();
    updateAuthUi();
    showStatus("Çıkış yapıldı.");
  } catch (error) {
    showStatus(error.message, "error");
  }
});

backToHomeButton.addEventListener("click", showHomeScreen);

joinLink.addEventListener("click", () => {
  if (currentArtist) {
    showMemberScreen(currentArtist);
  }
});

artistList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-artist-id]");
  if (!button) return;
  const artist = artists.find((item) => item.id === button.dataset.artistId);
  if (artist) renderProfile(artist);
});

memberOtherArtists.addEventListener("click", (event) => {
  const button = event.target.closest("[data-artist-id]");
  if (!button) return;
  const artist = artists.find((item) => item.id === button.dataset.artistId);
  if (artist) renderProfile(artist);
});

searchInput.addEventListener("input", renderArtists);

profilePanel.addEventListener("click", (event) => {
  if (event.target.closest("[data-close-panel]")) closeProfile();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeProfile();
});

init();
