# ✦ AuraCloset

> **Local-First AI Stylist, Interactive Mannequin Drape & Wardrobe Intelligence**  
> Built for Hacktoberfest @ UCSD 2026.

[![Tests](https://img.shields.io/badge/tests-12%20passing-success?style=flat-square)](file:///Users/dylanlouie/Projects/hacktoberfest-ucsd/src/lib/gapFillService.test.ts)
[![Next.js](https://img.shields.io/badge/Next.js-16%20(Turbopack)-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Offline First](https://img.shields.io/badge/Database-Dexie.js%20(IndexedDB)-orange?style=flat-square)](https://dexie.org)
[![Gemini](https://img.shields.io/badge/AI-Google%20GenAI%20%2F%20Gemma-8E75B2?style=flat-square&logo=google)](https://ai.google.dev)

---

## ⚡ Overview

**AuraCloset** is a local-first wardrobe curation platform that transforms your actual clothing photos into styled outfits. By pairing client-side background isolation and zero-latency IndexedDB storage with Gemini and Gemma vision models, AuraCloset builds a responsive digital closet with real-time physical garment draping and online gap-fill shopping recommendations.

---

## ✨ Key Features Across All 4 Tracks

### 🧥 1. Ingestion & Vision Isolation (Track 1)
* **Client-Side Background Removal:** Strips messy backgrounds from clothing photos into clean, transparent PNG cutouts.
* **Gemma & Gemini Vision Analysis:** Automatically classifies category (`outerwear`, `top`, `bottom`, `footwear`, `accessory`), fabric materials, primary hex colors, vibe tags, formality scores (1–10), and weather suitability.
* **Robust Offline Fallback:** Fully operational without network access, using client-side heuristics and safe fallbacks.

### 🗄️ 2. Zero-Latency Local Closet (Track 2)
* **IndexedDB via Dexie.js:** Entire wardrobe inventory persists locally in your browser with zero server roundtrips.
* **Smart Filter & Search:** Real-time filtering by category, aesthetic vibe (e.g. *workwear*, *streetwear*, *minimalist*), and owned vs. wishlist status.
* **Supplied Editorial Wardrobe:** Comes pre-seeded with 16 authentic clothing pieces (jackets, tees, cargo pants, clogs, hoodies, and accessories).

### 🪄 3. AI Stylist & Vibe Coach (Track 3)
* **Scenario-Based Fit Builder:** Prompt the stylist with natural language (e.g. *"Rainy day coffee run"*, *"Indie rock concert in Paris"*, *"Pitch meeting then dinner"*).
* **Vibe Coach Closet Audit:** Analyzes your wardrobe staples, identifies stylistic blind spots, and provides actionable silhouette critiques.
* **Live Web Grounding:** Toggle Google Search grounding to fetch real-time weather and event dress codes.
* **Editorial Themes:** Switch between warm tactile **Paper Light** (`#FAF9F6`) and minimalist **Studio Dark** (`#0C0D10`).

### 🧍 4. Interactive Mannequin Drape & Online Gap-Fill (Track 4)
* **Live Mannequin Drape:** A sculptural tailor mannequin silhouette that dynamically layers your **actual clothing cutouts** by body zone:
  * *Accessories:* Collar / neck region
  * *Tops & Outerwear:* Shoulders and torso with realistic depth scaling
  * *Bottoms:* Waist and leg alignment
  * *Footwear:* Base of the iron stand
* **Flat-Lay vs. Mannequin Switcher:** Instant one-click toggle between editorial flat-lay collage and vertical tailor dummy draping.
* **Interactive Layer Checklist:** Hover over pieces in the checklist to spotlight them on the mannequin; peel layers off with one click.
* **Online Gap-Fill Engine:** When your closet lacks a key piece to complete a look, AuraCloset estimates price brackets and generates direct encoded Google Shopping links. One-click "Mark as Owned" promotes wishlist finds into your closet.

---

## 🏗️ Architecture & Tech Stack

```
auracloset/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── stylist/          # Gemini 3.8 / Gemma stylist & research endpoint
│   │   ├── page.tsx              # Main studio orchestrator & view management
│   │   └── layout.tsx            # Root layout & Google Fonts integration
│   ├── components/
│   │   ├── canvas/
│   │   │   ├── FitCanvas.tsx     # View switcher (Flat-Lay vs. Mannequin Drape)
│   │   │   ├── FlatLayCollage.tsx# Editorial flat-lay garment layout
│   │   │   └── MannequinView.tsx # Interactive tailor dummy draping engine
│   │   ├── chat/
│   │   │   └── PromptBar.tsx     # Styling prompt bar with online search toggle
│   │   └── wardrobe/
│   │       ├── ClosetGrid.tsx    # My Closet inventory grid & filters
│   │       ├── VibeCoachView.tsx # Closet audit & wardrobe staple recommendations
│   │       └── WishlistView.tsx  # Gap-fill suggestions with live shopping links
│   ├── lib/
│   │   ├── gapFillService.ts     # Google Shopping URL generator & price brackets
│   │   ├── localDb.ts            # Dexie.js offline IndexedDB database
│   │   └── stylistPrompt.ts      # Multi-turn prompt formatting & normalization
│   ├── services/
│   │   └── ingestion/            # Image validation, background cutouts & vision
│   └── types/
│       └── closet.ts             # Strict TypeScript models & schemas
└── public/
    └── wardrobe/                 # High-resolution isolated garment assets
```

---

## 🚀 Quick Start

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/Dylan916/hacktoberfest-ucsd.git
cd hacktoberfest-ucsd
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the project root:
```env
# Google AI Studio API Key (for Gemini stylist & vision analysis)
GEMINI_API_KEY=your_api_key_here
```
*(The app is fully offline-resilient: if no key is provided, AuraCloset seamlessly falls back to local closet heuristics and offline styling.)*

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing

AuraCloset features automated unit tests covering ingestion, prompt formulation, gap-fill pricing, and offline styling:

```bash
# Run all unit tests
npm test

# Run TypeScript compiler check
npx tsc --noEmit
```

```
✔ generateShoppingLink creates valid encoded Google Shopping URL
✔ estimatePriceRange assigns realistic bracket by garment category
✔ formatGapFillSuggestions enriches missing pieces with prices and shop links
✔ Track 1 prompt data carries only owned Track 2 closet records into Track 3
✔ response normalization keeps only owned IDs and returns a complete audit
✔ offline outfit builder respects rain suitability and checks accessories
✔ offline Vibe Coach audits every owned garment and returns staples
✔ accepts an accessory with complete metadata, including fenced model JSON
✔ rejects invented categories and invalid metadata
✔ validates supported image types, empty files, and size
✔ rejects malformed vision requests before calling Google
✔ returns an actionable configuration error without exposing secrets

ℹ 12 tests passing (0 failures)
```

---

## 👥 Contributors

* **Dylan Louie** ([@Dylan916](https://github.com/Dylan916)) — Track 4 (Interactive Mannequin Drape & Online Gap-Fill), UI Architecture, & Integration
* **Ryan Rulkens** ([@ryanrulkens](https://github.com/ryanrulkens)) — Wardrobe Assets, Mock Ingestion & Dataset Curation
* **Shreyesh Vankina** ([@shreyeshvankina](https://github.com/shreyeshvankina)) — Tracks 1–3 Integration, Ingestion & Stylist Flows
