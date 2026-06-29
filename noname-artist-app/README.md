# Noname Stage

Noname Stage is a web app for independent musicians. Artists can create an account, publish one profile, and list their Apple Music, Spotify, YouTube, YouTube Music, Instagram, Facebook, and TikTok links in one place.

## Features

- Artist registration with email and password
- Login and logout
- Password hashing on the server
- Editable artist profile after login
- Public artist directory with search
- Persistent local JSON database for the current prototype

## Run Locally

```bash
npm start
```

Open:

```text
http://127.0.0.1:8787/
```

## Notes

This app uses a Node.js server for registration, login, profile updates, and the public artist API. It is not suitable for GitHub Pages by itself because GitHub Pages only serves static files.

For a public deployment, use a Node-capable host such as Render, Railway, Fly.io, or a VPS. For production, replace the local JSON file with a managed database.
