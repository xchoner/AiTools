# Aether AI — Minimalist AI Tools Directory

A lightweight, modern, and completely free AI Tools Directory built with **HTML5**, **CSS3**, and **Vanilla JavaScript (ES6+)**. Designed for instant discovery, searching, and filtering of curated AI tools with zero server overhead, zero framework bloat, and $0 hosting on **GitHub Pages**.

---

## Table of Contents

1. [Features](#features)
2. [Project Architecture](#project-architecture)
3. [Important Architectural Limitation](#important-architectural-limitation)
4. [Live Preview & Local Development](#live-preview--local-development)
5. [Free Hosting on GitHub Pages ($0 Deployment)](#free-hosting-on-github-pages-0-deployment)
6. [Formspree & Web3Forms Integration Guide](#formspree--web3forms-integration-guide)
7. [Managing and Adding AI Tools](#managing-and-adding-ai-tools)
8. [Testing & Verification Checklist](#testing--verification-checklist)
9. [Future Upgrades (Database & Admin Dashboard)](#future-upgrades-database--admin-dashboard)
10. [License](#license)

---

## Features

- **Blazing Fast & Zero Dependencies**: Built with pure Vanilla JS and modern CSS3 custom properties. No npm build process required for static hosting.
- **Instant Search & Debouncing**: Responsive search by tool name, description, and keywords without page reloads.
- **Multi-Filter System**:
  - Filter across 9 categories: Writing, Image Generation, Video, Coding, Audio, Productivity, Research, Business, Education.
  - Filter by Pricing model: Free, Freemium, and Paid.
  - Sort by Featured First, Name (A–Z), and Name (Z–A).
  - Dynamic result counter and real-time category counts.
- **Curated Database**: Comes pre-populated with 38 verified real-world AI tools in `tools.json`.
- **Light & Dark Theme**: Persistent theme switcher with system preference auto-detection.
- **Graceful Asset Fallbacks**: Monogram fallback icons if third-party logo images fail or fail to load offline.
- **Accessible & Responsive**: WCAG AA compliant contrast, semantic HTML5, keyboard navigation, and mobile-friendly touch targets.
- **Production-Ready Submission Form**: Validated submission form integrated with Formspree and Web3Forms to receive tool submissions directly in your email.

---

## Project Architecture

```
├── index.html       # Semantic HTML5 single-page application entry point
├── style.css        # Clean CSS3 design system with light/dark theme variables
├── script.js        # Vanilla JS logic: Fetch API, search, filtering, form validation
├── tools.json       # AI tools database (38 verified entries)
└── README.md        # Comprehensive documentation & setup guides
```

---

## Important Architectural Limitation

> **Crucial Note for Directory Owners:**
>
> A static website hosted on **GitHub Pages has no server-side execution or persistent write database**. Client-side JavaScript running in a visitor's browser cannot directly write to or modify `tools.json` in your GitHub repository.
>
> Therefore:
> 1. When a user or creator submits an AI tool via the submission form, the details are sent securely via **Formspree** or **Web3Forms** directly to **your email inbox**.
> 2. Submissions do **not** automatically appear on the live website immediately. This protects your site from spam, malicious URLs, or low-quality entries.
> 3. As the directory administrator, you review the submitted tool, open `tools.json` in your repository, add the new entry, and commit. GitHub Pages automatically redeploys in seconds.

---

## Live Preview & Local Development

Because this project uses standard browser APIs (`fetch('./tools.json')`), opening `index.html` via `file://` might be blocked by browser CORS security policies. Use any local HTTP static server:

### Option 1: Python (Built into Mac/Linux/Windows)
```bash
# In the project directory:
python3 -m http.server 8000
# Open http://localhost:8000 in your browser
```

### Option 2: Node.js / npx
```bash
npx serve .
# Or run with Vite in this repository:
npm run dev
```

### Option 3: VS Code Live Server
Right-click `index.html` and click **"Open with Live Server"**.

---

## Free Hosting on GitHub Pages ($0 Deployment)

Deploy your AI tools directory in less than 3 minutes without paying a cent:

### Step 1: Create a GitHub Account
If you don't have one, sign up for free at [github.com](https://github.com).

### Step 2: Create a New Repository
1. Click the **+** icon in the top-right corner and select **New repository**.
2. Name your repository (e.g., `ai-tools-directory` or `tools`).
3. Set the repository visibility to **Public**.
4. Leave "Initialize with a README" unchecked (since we already have one).
5. Click **Create repository**.

### Step 3: Upload Project Files
You can upload either via the Git command line or the GitHub web UI:

**Via Git CLI:**
```bash
git init
git add index.html style.css script.js tools.json README.md
git commit -m "Initial commit of AI Tools Directory"
git branch -M main
git remote add origin https://github.com/<YOUR-USERNAME>/<REPO-NAME>.git
git push -u origin main
```

**Via GitHub Web Browser:**
1. In your empty repository, click **"uploading an existing file"**.
2. Drag and drop `index.html`, `style.css`, `script.js`, `tools.json`, and `README.md`.
3. Click **Commit changes**.

### Step 4: Enable GitHub Pages
1. In your GitHub repository, click on the **Settings** tab.
2. In the left navigation sidebar, click on **Pages** (under "Code and automation").
3. Under **Build and deployment**:
   - **Source**: Select `Deploy from a branch`.
   - **Branch**: Select `main` (or `master`) and directory `/ (root)`.
4. Click **Save**.

### Step 5: Access Your Live Website
Within 1 to 2 minutes, GitHub will publish your site. Refresh the Pages settings page to find your public URL:
```
https://<YOUR-USERNAME>.github.io/<REPO-NAME>/
```

### Step 6: Updating Your Directory in the Future
Whenever you edit `tools.json` or any other file and commit changes to the `main` branch, GitHub Pages will automatically rebuild and update your site within 60 seconds.

---

## Formspree & Web3Forms Integration Guide

To receive submissions without running a server, integrate either **Formspree** or **Web3Forms**. Both offer generous free tiers.

### Provider Free-Plan Limits (Current)
- **Formspree**: Free tier includes 50 submissions per month, spam filtering, and instant email alerts.
- **Web3Forms**: Free tier includes 250 submissions per month, unlimited forms, and zero server setup.

---

### Option A: Formspree Setup (Recommended)

1. **Create an account**: Visit [formspree.io](https://formspree.io) and register with your email.
2. **Create a form**:
   - In your Formspree dashboard, click **+ New Form**.
   - Name your form (e.g., `AI Directory Submissions`).
   - Enter the email address where you want to receive new tool submissions.
   - Click **Create Form**.
3. **Verify email**: If prompted, confirm your email address by clicking the verification link sent by Formspree.
4. **Copy endpoint**: Formspree gives you an endpoint URL that looks like:
   `https://formspree.io/f/mqkvanzy`
5. **Configure `script.js`**:
   Open `script.js` and locate lines 11–24:
   ```javascript
   const SUBMISSION_CONFIG = {
     provider: 'formspree',
     formspreeEndpoint: 'https://formspree.io/f/mqkvanzy', // <-- Paste your endpoint here
     web3FormsAccessKey: 'YOUR_ACCESS_KEY'
   };
   ```
6. **Test your form**:
   Open your website, navigate to the **Submit an AI Tool** section, fill out all fields with test information, and click submit. You will immediately receive a notification in your email with the tool details!

---

### Option B: Web3Forms Setup

1. **Get an access key**: Visit [web3forms.com](https://web3forms.com) and enter your email address.
2. **Verify inbox**: Check your email inbox for your unique Access Key (e.g., `a1b2c3d4-e5f6-7890-abcd-ef1234567890`).
3. **Configure `script.js`**:
   Open `script.js` and update:
   ```javascript
   const SUBMISSION_CONFIG = {
     provider: 'web3forms',
     formspreeEndpoint: 'https://formspree.io/f/YOUR_FORM_ID',
     web3FormsAccessKey: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' // <-- Paste your access key here
   };
   ```
4. **Test submission**: Submit a test entry on your website and verify the email delivery.

---

## Managing and Adding AI Tools

All directory tools live in `tools.json`. Each entry adheres to this schema:

```json
{
  "id": "unique-slug",
  "name": "Tool Name",
  "description": "Short description of capabilities (10–200 characters).",
  "category": "Writing",
  "pricing": "Freemium",
  "url": "https://official-website.com",
  "logo": "https://official-website.com/logo.svg",
  "featured": true
}
```

### Supported Categories:
- `Writing`
- `Image Generation`
- `Video`
- `Coding`
- `Audio`
- `Productivity`
- `Research`
- `Business`
- `Education`

### Supported Pricing Models:
- `Free`
- `Freemium`
- `Paid`

### Approving a Submitted Tool:
1. Review the tool submitted to your email.
2. Confirm that the URL is official, safe, and active.
3. Open `tools.json` in your repository or text editor.
4. Add the new tool object inside the JSON array.
5. Save/commit your changes. The directory will update automatically.

---

## Testing & Verification Checklist

Before publishing, verify each item:

- [x] **Search**: Typing into the search bar filters tools in real time.
- [x] **Debounce**: Fast typing does not cause lag or jitter.
- [x] **Category Filters**: Clicking any category (e.g. Coding, Audio) updates the list and category tool count.
- [x] **Pricing Filters**: Filtering by Free, Freemium, or Paid shows only corresponding tools.
- [x] **Combined Filters**: Searching while a category and pricing filter are active correctly intersects all criteria.
- [x] **Empty State**: Searching for an unfindable query (e.g., "xyzqwe123") displays the friendly "No AI Tools Found" message with a working "Clear All Filters" button.
- [x] **External Links**: Clicking "Visit" opens the tool's verified website in a new tab with `rel="noopener noreferrer"`.
- [x] **Image Fallbacks**: If a logo URL is unreachable or blocked, the card displays clean initials without breaking layout.
- [x] **Theme Switcher**: Toggling dark and light modes persists across page refreshes.
- [x] **Form Validation**: Submitting an empty or invalid form highlights errors in red with accessible descriptions.
- [x] **Form Submission**: Submitting valid data delivers to your email (or demonstrates demo mode if unconfigured).
- [x] **Responsive Layout**: Layout adjusts smoothly on mobile (360px), tablet (768px), and desktop (1280px+).

---

## Future Upgrades (Database & Admin Dashboard)

If your directory grows and you wish to transition from static moderation to automated updates:

1. **Serverless Database**: Connect to a free-tier database like Supabase (PostgreSQL) or Firebase Firestore.
2. **Admin Dashboard**: Build a protected `/admin` route requiring OAuth/authentication to click "Approve" or "Reject" on incoming submissions.
3. **Automated Deployment**: Set up a GitHub Action webhook that automatically writes approved submissions into `tools.json` and creates a commit.

---

## License

MIT License. Feel free to fork, customize, and launch your own directory.
