const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const root = __dirname;
const dataDir = process.env.DATA_DIR ? path.resolve(process.env.DATA_DIR) : path.join(root, "data");
const dbPath = path.join(dataDir, "db.json");
const port = Number(process.env.PORT || 8787);
const host = process.env.HOST || "0.0.0.0";

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".json": "application/json; charset=utf-8",
};

function ensureDb() {
  fs.mkdirSync(dataDir, { recursive: true });
  if (!fs.existsSync(dbPath)) {
    writeDb({ users: [], artists: [], sessions: [] });
    return;
  }

  const db = JSON.parse(fs.readFileSync(dbPath, "utf8"));
  let changed = false;
  for (const key of ["users", "artists", "sessions"]) {
    if (!Array.isArray(db[key])) {
      db[key] = [];
      changed = true;
    }
  }
  if (changed) writeDb(db);
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
  if (!sid) return null;

  const db = readDb();
  const session = db.sessions.find((item) => item.id === sid && new Date(item.expiresAt) > new Date());
  if (!session) return null;

  const user = db.users.find((item) => item.id === session.userId);
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
        reject(new Error("Istek cok buyuk."));
      }
    });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error("Gecersiz JSON."));
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
    twitter: cleanUrl(payload.twitter),
  };
}

function realArtists(db) {
  return db.artists.filter((artist) => artist.ownerId);
}

function validateArtist(artist) {
  if (!artist.name || !artist.genre || !artist.city) {
    return "Sanatci adi, tur ve sehir zorunlu.";
  }
  return "";
}

function createSession(db, userId) {
  const sid = crypto.randomUUID();
  const now = Date.now();
  const expiresAt = new Date(now + 1000 * 60 * 60 * 24 * 30).toISOString();
  db.sessions = (db.sessions || []).filter((session) => new Date(session.expiresAt) > new Date());
  db.sessions.push({ id: sid, userId, createdAt: new Date(now).toISOString(), expiresAt });
  return {
    "Set-Cookie": `sid=${sid}; HttpOnly; SameSite=Lax; Path=/; Max-Age=2592000`,
  };
}

async function handleApi(req, res, pathname) {
  if (req.method === "GET" && pathname === "/api/artists") {
    const db = readDb();
    sendJson(res, 200, { artists: realArtists(db).map(publicArtist) });
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
      sendJson(res, 400, { error: "Gecerli e-posta ve en az 6 karakter sifre gir." });
      return true;
    }

    if (artistError) {
      sendJson(res, 400, { error: artistError });
      return true;
    }

    const db = readDb();
    if (db.users.some((user) => user.email === email)) {
      sendJson(res, 409, { error: "Bu e-posta ile hesap zaten var. Giris yapabilirsin." });
      return true;
    }

    const userId = crypto.randomUUID();
    const artistId = crypto.randomUUID();
    const passwordData = hashPassword(password);
    const memberNo = realArtists(db).length + 1;
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
      memberNo,
      ...artist,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.users.push(user);
    db.artists.unshift(savedArtist);
    const sessionHeaders = createSession(db, userId);
    writeDb(db);

    sendJson(res, 201, { user: publicUser(user), artist: publicArtist(savedArtist) }, sessionHeaders);
    return true;
  }

  if (req.method === "POST" && pathname === "/api/login") {
    const payload = await readBody(req);
    const email = cleanText(payload.email).toLowerCase();
    const password = String(payload.password || "");
    const db = readDb();
    const user = db.users.find((item) => item.email === email);

    if (!user || !verifyPassword(password, user)) {
      sendJson(res, 401, { error: "E-posta veya sifre hatali." });
      return true;
    }

    const artist = db.artists.find((item) => item.id === user.artistId);
    const sessionHeaders = createSession(db, user.id);
    writeDb(db);
    sendJson(res, 200, { user: publicUser(user), artist: artist ? publicArtist(artist) : null }, sessionHeaders);
    return true;
  }

  if (req.method === "POST" && pathname === "/api/logout") {
    const sid = parseCookies(req).sid;
    if (sid) {
      const db = readDb();
      db.sessions = (db.sessions || []).filter((session) => session.id !== sid);
      writeDb(db);
    }
    sendJson(res, 200, { ok: true }, { "Set-Cookie": "sid=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0" });
    return true;
  }

  if (req.method === "PUT" && pathname === "/api/artists/me") {
    const auth = currentUser(req);
    if (!auth) {
      sendJson(res, 401, { error: "Profil guncellemek icin giris yapmalisin." });
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
      sendJson(res, 404, { error: "Sanatci profili bulunamadi." });
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
      sendJson(res, 500, { error: error.message || "Sunucu hatasi." });
    }
  })
  .listen(port, host, () => {
    console.log(`Noname Stage running on ${host}:${port}`);
  });

