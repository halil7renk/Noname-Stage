const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const root = __dirname;
const dataDir = path.join(root, "data");
const dbPath = path.join(dataDir, "db.json");
const port = Number(process.env.PORT || 8787);
const host = process.env.HOST || "0.0.0.0";
const sessions = new Map();

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".json": "application/json; charset=utf-8",
};

const starterArtists = [
  {
    id: crypto.randomUUID(),
    ownerId: null,
    name: "Lal Gece",
    genre: "Alternatif pop",
    city: "İstanbul",
    apple: "https://music.apple.com/",
    spotify: "https://open.spotify.com/",
    youtube: "https://youtube.com/",
    youtubeMusic: "https://music.youtube.com/",
    instagram: "https://instagram.com/",
    facebook: "",
    tiktok: "https://tiktok.com/",
    createdAt: new Date().toISOString(),
  },
  {
    id: crypto.randomUUID(),
    ownerId: null,
    name: "Mavi Perde",
    genre: "Indie rock",
    city: "Ankara",
    apple: "",
    spotify: "https://open.spotify.com/",
    youtube: "https://youtube.com/",
    youtubeMusic: "https://music.youtube.com/",
    instagram: "https://instagram.com/",
    facebook: "https://facebook.com/",
    tiktok: "",
    createdAt: new Date().toISOString(),
  },
  {
    id: crypto.randomUUID(),
    ownerId: null,
    name: "Nova Ritim",
    genre: "Elektronik",
    city: "İzmir",
    apple: "https://music.apple.com/",
    spotify: "https://open.spotify.com/",
    youtube: "",
    youtubeMusic: "https://music.youtube.com/",
    instagram: "https://instagram.com/",
    facebook: "",
    tiktok: "https://tiktok.com/",
    createdAt: new Date().toISOString(),
  },
];

function ensureDb() {
  fs.mkdirSync(dataDir, { recursive: true });
  if (!fs.existsSync(dbPath)) {
    writeDb({ users: [], artists: starterArtists });
  }
}

function readDb() {
  ensureDb();
  return JSON.parse(fs.readFileSync(dbPath, "utf8"));
}

function writeDb(db) {
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), "utf8");
}

function sendJson(res, status, payload, headers = {}) {
  res.writeHead(status, { "Content-Type": types[".json"], ...headers });
  res.end(JSON.stringify(payload));
}

function parseCookies(req) {
  const raw = req.headers.cookie || "";
  return Object.fromEntries(
    raw
      .split(";")
      .map((item) => item.trim().split("="))
      .filter(([key, value]) => key && value)
  );
}

function currentUser(req) {
  const sid = parseCookies(req).sid;
  if (!sid || !sessions.has(sid)) return null;

  const db = readDb();
  const userId = sessions.get(sid);
  const user = db.users.find((item) => item.id === userId);
  return user ? { db, user, sid } : null;
}

function publicArtist(artist) {
  const { ownerId, ...safeArtist } = artist;
  return safeArtist;
}

function publicUser(user) {
  return { id: user.id, email: user.email, artistId: user.artistId };
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) {
        req.destroy();
        reject(new Error("İstek çok büyük."));
      }
    });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error("Geçersiz JSON."));
      }
    });
    req.on("error", reject);
  });
}

function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto.pbkdf2Sync(password, salt, 120000, 64, "sha512").toString("hex");
  return { salt, hash };
}

function verifyPassword(password, user) {
  const { hash } = hashPassword(password, user.salt);
  return crypto.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(user.passwordHash, "hex"));
}

function cleanText(value) {
  return String(value || "").trim();
}

function cleanUrl(value) {
  const text = cleanText(value);
  if (!text) return "";

  try {
    const url = new URL(text);
    return ["http:", "https:"].includes(url.protocol) ? url.toString() : "";
  } catch {
    return "";
  }
}

function normalizeArtist(payload) {
  return {
    name: cleanText(payload.name),
    genre: cleanText(payload.genre),
    city: cleanText(payload.city),
    apple: cleanUrl(payload.apple),
    spotify: cleanUrl(payload.spotify),
    youtube: cleanUrl(payload.youtube),
    youtubeMusic: cleanUrl(payload.youtubeMusic),
    instagram: cleanUrl(payload.instagram),
    facebook: cleanUrl(payload.facebook),
    tiktok: cleanUrl(payload.tiktok),
  };
}

function validateArtist(artist) {
  if (!artist.name || !artist.genre || !artist.city) {
    return "Sanatçı adı, tür ve şehir zorunlu.";
  }
  return "";
}

function createSession(res, userId) {
  const sid = crypto.randomUUID();
  sessions.set(sid, userId);
  return {
    "Set-Cookie": `sid=${sid}; HttpOnly; SameSite=Lax; Path=/; Max-Age=604800`,
  };
}

async function handleApi(req, res, pathname) {
  if (req.method === "GET" && pathname === "/api/artists") {
    const db = readDb();
    sendJson(res, 200, { artists: db.artists.map(publicArtist) });
    return true;
  }

  if (req.method === "GET" && pathname === "/api/me") {
    const auth = currentUser(req);
    if (!auth) {
      sendJson(res, 200, { user: null, artist: null });
      return true;
    }

    const artist = auth.db.artists.find((item) => item.id === auth.user.artistId);
    sendJson(res, 200, { user: publicUser(auth.user), artist: artist ? publicArtist(artist) : null });
    return true;
  }

  if (req.method === "POST" && pathname === "/api/register") {
    const payload = await readBody(req);
    const email = cleanText(payload.email).toLowerCase();
    const password = String(payload.password || "");
    const artist = normalizeArtist(payload);
    const artistError = validateArtist(artist);

    if (!email.includes("@") || password.length < 6) {
      sendJson(res, 400, { error: "Geçerli e-posta ve en az 6 karakter şifre gir." });
      return true;
    }

    if (artistError) {
      sendJson(res, 400, { error: artistError });
      return true;
    }

    const db = readDb();
    if (db.users.some((user) => user.email === email)) {
      sendJson(res, 409, { error: "Bu e-posta ile hesap zaten var. Giriş yapabilirsin." });
      return true;
    }

    const userId = crypto.randomUUID();
    const artistId = crypto.randomUUID();
    const passwordData = hashPassword(password);
    const user = {
      id: userId,
      email,
      salt: passwordData.salt,
      passwordHash: passwordData.hash,
      artistId,
      createdAt: new Date().toISOString(),
    };
    const savedArtist = {
      id: artistId,
      ownerId: userId,
      ...artist,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.users.push(user);
    db.artists.unshift(savedArtist);
    writeDb(db);

    sendJson(res, 201, { user: publicUser(user), artist: publicArtist(savedArtist) }, createSession(res, userId));
    return true;
  }

  if (req.method === "POST" && pathname === "/api/login") {
    const payload = await readBody(req);
    const email = cleanText(payload.email).toLowerCase();
    const password = String(payload.password || "");
    const db = readDb();
    const user = db.users.find((item) => item.email === email);

    if (!user || !verifyPassword(password, user)) {
      sendJson(res, 401, { error: "E-posta veya şifre hatalı." });
      return true;
    }

    const artist = db.artists.find((item) => item.id === user.artistId);
    sendJson(res, 200, { user: publicUser(user), artist: artist ? publicArtist(artist) : null }, createSession(res, user.id));
    return true;
  }

  if (req.method === "POST" && pathname === "/api/logout") {
    const sid = parseCookies(req).sid;
    if (sid) sessions.delete(sid);
    sendJson(res, 200, { ok: true }, { "Set-Cookie": "sid=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0" });
    return true;
  }

  if (req.method === "PUT" && pathname === "/api/artists/me") {
    const auth = currentUser(req);
    if (!auth) {
      sendJson(res, 401, { error: "Profil güncellemek için giriş yapmalısın." });
      return true;
    }

    const payload = await readBody(req);
    const artist = normalizeArtist(payload);
    const artistError = validateArtist(artist);
    if (artistError) {
      sendJson(res, 400, { error: artistError });
      return true;
    }

    const index = auth.db.artists.findIndex((item) => item.id === auth.user.artistId && item.ownerId === auth.user.id);
    if (index === -1) {
      sendJson(res, 404, { error: "Sanatçı profili bulunamadı." });
      return true;
    }

    auth.db.artists[index] = {
      ...auth.db.artists[index],
      ...artist,
      updatedAt: new Date().toISOString(),
    };
    writeDb(auth.db);
    sendJson(res, 200, { artist: publicArtist(auth.db.artists[index]) });
    return true;
  }

  return false;
}

function serveStatic(req, res, pathname) {
  const cleanPath = pathname === "/" ? "index.html" : pathname.replace(/^\/+/, "");
  const file = path.resolve(root, cleanPath);

  if (!file.startsWith(root) || file.startsWith(dataDir)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  fs.readFile(file, (error, data) => {
    if (error) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }

    res.writeHead(200, { "Content-Type": types[path.extname(file)] || "application/octet-stream" });
    res.end(data);
  });
}

ensureDb();

http
  .createServer(async (req, res) => {
    const { pathname } = new URL(req.url, "http://localhost");

    try {
      if (pathname.startsWith("/api/") && (await handleApi(req, res, pathname))) {
        return;
      }

      serveStatic(req, res, decodeURIComponent(pathname));
    } catch (error) {
      sendJson(res, 500, { error: error.message || "Sunucu hatası." });
    }
  })
  .listen(port, host, () => {
    console.log(`Noname Stage running on ${host}:${port}`);
  });
