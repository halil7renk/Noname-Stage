const platforms = [
  { key: "apple", label: "Apple Music", shortLabel: "Apple", tone: "#f1b45f", mark: "" },
  { key: "spotify", label: "Spotify", shortLabel: "SP", tone: "#74c67a", mark: "S" },
  { key: "youtube", label: "YouTube", shortLabel: "YT", tone: "#e66a8d", mark: "▶" },
  { key: "youtubeMusic", label: "YouTube Music", shortLabel: "YTM", tone: "#e66a8d", mark: "♫" },
  { key: "instagram", label: "Instagram", shortLabel: "IG", tone: "#c879ff", mark: "◎" },
  { key: "facebook", label: "Facebook", shortLabel: "FB", tone: "#7bb6ff", mark: "f" },
  { key: "tiktok", label: "TikTok", shortLabel: "TT", tone: "#42d6c5", mark: "♪" },
  { key: "twitter", label: "Twitter / X", shortLabel: "X", tone: "#f5f7f8", mark: "X" },
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
    if (currentUser) {
      authMode = "edit";
      fillProfileForm(currentArtist);
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
    formTitle.textContent = "Sanatçı profilini güncelle";
    accountStatus.textContent = `${currentUser.email} hesabıyla giriş yaptın.`;
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
    : "Kayıt olduğunda sana özel bağlantı ekranı açılır.";
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
          <span class="artist-row__count">${platformCount(artist)} link</span>
        </button>
      `
    )
    .join("");
}

function platformIcon(platform) {
  return `<span class="platform-mark" style="--platform-tone: ${platform.tone}">${platform.mark}</span>`;
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

function renderProfile(artist) {
  profileAvatar.textContent = initials(artist.name);
  profileGenre.textContent = artist.genre;
  profileName.textContent = artist.name;
  profileCity.textContent = artist.city;
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
  memberLinks.innerHTML = renderLinkItems(artist, "member");
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

searchInput.addEventListener("input", renderArtists);

profilePanel.addEventListener("click", (event) => {
  if (event.target.closest("[data-close-panel]")) closeProfile();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeProfile();
});

init();
