"# Ekamnoor Singh — Interactive 3D AI Portfolio

A unique, interactive 3D developer portfolio for **Ekamnoor Singh** (aspiring Full Stack AI Engineer from Punjab) featuring:

- A 3D animated background (Three.js) — neural-network constellation + floating code tokens.
- 5 switchable colour themes (live).
- **Singh AI** — an AI chatbot (Emergent LLM gateway) with a high-quality AI-generated bot avatar, that answers recruiter questions about Ekamnoor, with conversation memory.
- Animated greeting intro, projects (with live demo + code links), achievements, tech stack, volunteer experience.
- Privacy-friendly \"Request Phone Number\" lead capture, contact form, visitor counter.
- An **Admin Dashboard** (`/admin`) to view & export all visitor data.

## Tech Stack
- **Next.js 15** (App Router) + **React 18**
- **Tailwind CSS** + shadcn/ui + lucide-react icons + framer-motion
- **Three.js** (custom 3D background)
- **MongoDB** (data storage)
- **Emergent Universal LLM Key** (OpenAI-compatible gateway) for the chatbot & AI image generation

---
## ▶️ Run locally in VS Code (step by step)

### 1. Install the prerequisites (one time)
- **Node.js 20 LTS** (or 18.18+) — https://nodejs.org
- **Yarn**: after Node is installed, run `npm install -g yarn`
- **MongoDB** — either:
  - Install **MongoDB Community Server** locally (gives you `mongodb://localhost:27017`), or
  - Create a free cloud DB at **MongoDB Atlas** and copy its connection string.

### 2. Open the project
- Unzip the downloaded source.
- In VS Code: **File → Open Folder…** and select the unzipped project folder.
- Open the built-in terminal: **Terminal → New Terminal**.

### 3. Install dependencies
```bash
yarn install
```

### 4. Environment file (already included ✅)
This project already ships with a working `.env` in the root (chatbot key, admin password, etc.), so you can run it as-is. Only edit it if you want to change something — e.g. point MongoDB to Atlas, or rename the database. See the variables below.

### 5. Make sure MongoDB is running
- If you installed MongoDB locally, ensure the service is started (on Windows it usually runs automatically; on Mac/Linux: `mongod` or `brew services start mongodb-community`).
- Or set `MONGO_URL` in `.env` to your Atlas connection string.

### 6. Start the dev server
```bash
yarn dev
```
Open **http://localhost:3000** 🎉  (API runs at `http://localhost:3000/api`).

> The frontend calls the backend using relative `/api/...` paths, so it just works on localhost — you do **not** need to change `NEXT_PUBLIC_BASE_URL` for local development.

### Build for production (optional)
```bash
yarn build
yarn start
```

### Environment variables (`.env`)
```env
MONGO_URL=mongodb://localhost:27017
DB_NAME=portfolio                 # any name you like; the DB is created automatically
NEXT_PUBLIC_BASE_URL=http://localhost:3000
CORS_ORIGINS=*

# Chatbot + AI image generation (Emergent Universal Key)
EMERGENT_LLM_KEY=your_emergent_universal_key
EMERGENT_LLM_BASE_URL=https://integrations.emergentagent.com/llm

# Admin dashboard password (visit /admin)
ADMIN_PASSWORD=

# OPTIONAL: live Google Sheets / n8n sync (see below). Leave empty to disable.
SHEETS_WEBHOOK_URL=
```
> NOTE: The `EMERGENT_LLM_KEY` works through Emergent's gateway. If it ever stops working, switch `EMERGENT_LLM_BASE_URL` to `https://api.openai.com/v1`, set the model in `app/api/[[...path]]/route.js` to a standard OpenAI model, and use your own `OPENAI_API_KEY` as the key. Keep this key private — don't commit it to a public GitHub repo.

---
## 🔐 Admin Dashboard — view all visitor data
The admin page is **hidden** (not linked anywhere on the public site). Go to **`/admin`** (e.g. http://localhost:3000/admin), enter the `ADMIN_PASSWORD`, and you can browse + **Export CSV** for:
- Contact form messages
- Phone-number leads
- Chatbot conversations
- Total visitor count

CSV files open directly in Google Sheets / Excel.

---
## OPTIONAL: Live Google Sheets / n8n sync
Every contact + lead can also be pushed live into a Google Sheet you own. The app POSTs JSON `{ type, name, email, message, ts }` to whatever URL you put in `SHEETS_WEBHOOK_URL`.

**Option A — n8n:** add a **Webhook** trigger node → a **Google Sheets \"Append Row\"** node, then paste the n8n webhook URL into `SHEETS_WEBHOOK_URL` and restart.

**Option B — Google Apps Script (no Google Cloud account):**
1. Create a Google Sheet. In `Sheet1` row 1 add headers: `Date | Type | Name | Email | Message`.
2. **Extensions → Apps Script**, paste:
   ```javascript
   function doPost(e) {
     var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Sheet1');
     var d = JSON.parse(e.postData.contents);
     sheet.appendRow([new Date(), d.type || '', d.name || '', d.email || '', d.message || '']);
     return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(ContentService.MimeType.JSON);
   }
   ```
3. **Deploy → New deployment → Web app**, Execute as **Me**, Access **Anyone**, copy the Web app URL.
4. Paste it into `SHEETS_WEBHOOK_URL` and restart.

---
## Deploying to your own domain (.com / .in)
1. Push the code to GitHub.
2. Deploy on **Vercel** (recommended for Next.js) or any Node host. Add all `.env` variables in the host's dashboard.
3. Use a managed **MongoDB Atlas** connection string for `MONGO_URL`.
4. Point your custom domain at the deployment in your host's settings.

---
## Project structure
```
app/
  app/
    api/[[...path]]/route.js   # Backend: chat, contact, lead, visit, admin
    admin/page.js              # Admin dashboard
    page.js                    # Main portfolio page
    layout.js                  # Fonts + metadata
    globals.css                # Styles + animations
  components/
    Scene3D.js                 # Three.js 3D background
    ChatBot.js                 # Singh AI chat widget
    BotAvatar.js               # Singh AI bot avatar (AI-generated bust)
    SinghAvatar.js             # (legacy animated SVG avatar)
  lib/portfolioData.js         # All portfolio content + themes
  public/bot-avatar.png        # AI-generated chatbot avatar
  scripts/gen_avatar*.mjs      # Scripts used to generate the AI avatars
```

Built with ❤️ in Punjab by Ekamnoor Singh. Code, create, repeat.
"
