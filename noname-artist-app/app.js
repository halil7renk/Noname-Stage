const platforms = [
  { key: "apple", label: "Apple Music", tone: "#f1b45f" },
  { key: "spotify", label: "Spotify", tone: "#74c67a" },
  { key: "youtube", label: "YouTube", tone: "#e66a8d" },
  { key: "youtubeMusic", label: "YouTube Music", tone: "#e66a8d" },
  { key: "instagram", label: "Instagram", tone: "#c879ff" },
  { key: "facebook", label: "Facebook", tone: "#7bb6ff" },
  { key: "tiktok", label: "TikTok", tone: "#42d6c5" },
];

const artistForm = document.querySelector("#artistForm");
const artistList = document.querySelector("#artistList");
const searchInput = document.querySelector("#searchInput");
const formStatus = document.querySelector("#formStatus");
const artistCountHero = document.querySelector("#artistCountHero");
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
    : "Kayıtlar sunucudaki veri dosyasına kaydedilir.";
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

function platformCount(artist) {
  return platforms.filter((platform) => artist[platform.key]).length;
}

function filteredArtists() {
  const query = searchInput.value.trim().toLocaleLowerCase("tr-TR");
  if (!query) return artists;

  return artists.filter((artist) => {
    const text = `${artist.name} ${artist.genre} ${artist.city}`.toLocaleLowerCase("tr-TR");
    return text.includes(query);
  });
}

function renderArtists() {
  const visibleArtists = filteredArtists();
  artistCountHero.textContent = artists.length;

  if (visibleArtists.length === 0) {
    artistList.innerHTML = `<div class="empty-state">Sonuç bulunamadı.</div>`;
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

function renderProfile(artist) {
  profileAvatar.textContent = initials(artist.name);
  profileGenre.textContent = artist.genre;
  profileName.textContent = artist.name;
  profileCity.textContent = artist.city;

  const links = platforms.filter((platform) => artist[platform.key]);
  profileLinks.innerHTML = links.length
    ? links
        .map(
          (platform) => `
            <a class="link-item" href="${escapeHtml(artist[platform.key])}" target="_blank" rel="noreferrer">
              <span class="link-item__icon" style="color: ${platform.tone}">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M7 17 17 7M8 7h9v9" />
                </svg>
              </span>
              <span>
                <span class="link-item__label">${platform.label}</span>
                <span class="link-item__url">${escapeHtml(artist[platform.key])}</span>
              </span>
              <span class="link-item__open">Aç</span>
            </a>
          `
        )
        .join("")
    : `<div class="empty-state">Bu profilde henüz bağlantı yok.</div>`;

  profilePanel.classList.add("is-open");
  profilePanel.setAttribute("aria-hidden", "false");
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
    } else if (authMode === "edit") {
      const result = await api("/api/artists/me", { method: "PUT", body: JSON.stringify(payload) });
      currentArtist = result.artist;
      fillProfileForm(currentArtist);
      showStatus("Profil güncellendi ve canlı listeye işlendi.");
    } else {
      const result = await api("/api/register", { method: "POST", body: JSON.stringify(payload) });
      currentUser = result.user;
      currentArtist = result.artist;
      authMode = "edit";
      updateAuthUi();
      showStatus("Hesap oluşturuldu ve profil yayınlandı.");
    }

    await refreshArtists();
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
    updateAuthUi();
    showStatus("Çıkış yapıldı.");
  } catch (error) {
    showStatus(error.message, "error");
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
