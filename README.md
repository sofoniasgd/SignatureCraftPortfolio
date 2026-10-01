# Signature Craft — Portfolio Website

A single-page, elegant portfolio site for **Signature Craft** — handmade jewelry and
artisanal pieces crafted from high-quality wood board.
Plain HTML, CSS, and JavaScript. No build step, no frameworks, no dependencies.

> *Handmade. Timeless. You.*

---

## What's on the site

- **Hero** — logo, tagline, and buttons to the collection and custom orders.
- **Our Story** — brand story and values (Authenticity · Individuality · Elegance).
- **Gallery** — product cards with category filter buttons. Click a card to open a
  details popup; pieces with several photos can be browsed inside it
  (arrows, dots, clicking the photo, or the ←/→ keys).
- **Custom Orders** — the 4-step commission process.
- **Contact** — phone, email, and socials, plus a message form that opens the
  visitor's email app pre-filled.
- **Footer** — nav and social links.

All products **and all contact details** come from one file:
[`data/products.json`](data/products.json). Day-to-day updates never touch code.

---

## View it

Start a preview server, then open <http://localhost:5173/> in your browser.
Press `Ctrl+C` to stop it.

- **WSL (Ubuntu):** in a WSL terminal, from the project folder:
  ```bash
  cd /mnt/c/Users/metasebia/Documents/projects/SignatureCraftPortfolio
  bash serve.sh
  ```
  Or straight from PowerShell / the VS Code terminal:
  ```powershell
  wsl -d Ubuntu-20.04 --cd /mnt/c/Users/metasebia/Documents/projects/SignatureCraftPortfolio -- bash serve.sh
  ```
- **Windows only (no WSL):** right-click `serve.ps1` → **Run with PowerShell**.
  It opens the browser automatically.

Edits to `data/products.json`, CSS, or JS show up on a normal browser refresh.

> Double-clicking `index.html` directly won't show the gallery — browsers
> block a plain file from loading `data/products.json` for security reasons.
> This only matters for local preview; once uploaded to any real web host
> (shared hosting, Netlify, GitHub Pages, …) it works normally.

---

## Project structure

```
index.html            The whole page (all sections) — you shouldn't need to touch this
css/styles.css        All styling — brand colours & type live at the top
js/main.js            Interactions (loads the data file, gallery, popup, form)
data/products.json    ← YOUR CONTENT: contact details, categories, products
assets/
  SGLOGO.svg          The logo mark (nav, hero, footer, browser tab)
  logo-mark.svg       Mark used on placeholder product tiles
  brillant/           "Signature" wordmark font (kept out of git, included by package.sh)
  products/           ← Drop your product photos here
serve.sh              Local preview server for WSL (needs python3)
serve.ps1             Local preview server for plain Windows (no installs needed)
package.sh            Builds the upload bundle for your web host
```

After editing `data/products.json` (or adding photos), upload just those files to
your host — the live site picks up the change on the next page load.

---

## Editing `data/products.json`

The file has three parts:

```json
{
  "contact":    { ... },   your email, phones, and social handles
  "links":      { ... },   where the order buttons go
  "categories": [ ... ],   the filter buttons above the gallery
  "products":   [ ... ]    one block per piece
}
```

### JSON rules (the only "gotchas")
- All keys and text go in **double quotes** `"like this"`.
- Items in a list are separated by **commas** — but **no comma after the last one**.
- If the gallery suddenly shows *"Couldn't load the product list"*, there's a typo
  in the file. Paste it into <https://jsonlint.com> and it will point at the line.

### 1. Contact details
```json
"contact": {
  "email": "hello@signaturecraft.com",
  "phones": ["+251 939 954 213", "+251 941 246 822"],
  "instagram": "signa_ture277",
  "tiktok": "signature.craft",
  "telegram": "Signaturecraft"
}
```
- `email` — shown in the Contact section **and** is where the contact form sends
  messages. Change this to your real inbox.
- `phones` — any number of phone numbers, written however you like them displayed.
- `instagram` / `tiktok` / `telegram` — just the handle, **without the `@`**.
  The links are built automatically. To hide one, set it to `""`.

These appear in both the Contact section and the footer.

### Order links
```json
"links": {
  "order": "#contact",
  "commission": "#contact",
  "product": "#contact"
}
```
| Key          | Button |
|--------------|--------|
| `order`      | **Order Now** in the top navigation (and mobile menu) |
| `commission` | **Start your commission** in the Custom Orders section |
| `product`    | **Inquire about this piece** in every product popup |

`"#contact"` scrolls to the contact form (how they work today). When your online
shop is live, replace them with full web addresses, e.g.
`"order": "https://shop.signaturecraft.com/"` — just re-upload
`data/products.json`, nothing else.

A single product can also send its popup button somewhere specific (e.g. its
own shop page) by adding a `"link"` to that product — see the table below.

### 2. Categories
```json
"categories": ["All", "Earrings", "Necklaces", "Bracelets", "Décor", "Keepsakes"]
```
Keep `"All"` first. Add a new name here and a filter button for it appears
automatically. A product's `category` must match one of these exactly.

### 3. Adding a new product
Copy an existing product block, paste it into the `products` list, and change
the fields. Remember the comma between blocks.

```json
{
  "name": "Aurora Drop Earrings",
  "category": "Earrings",
  "material": "Walnut board · brass hooks",
  "desc": "Featherlight teardrop earrings with a hand-sanded curve.",
  "price": "Br 750",
  "tone": "chestnut",
  "images": []
}
```

| Field      | What it does |
|------------|--------------|
| `name`     | Product title on the card and in the popup. |
| `category` | Must match a value in `categories`. Controls which filter shows it. |
| `material` | Short line under the title in the popup. |
| `desc`     | The description in the popup. |
| `price`    | Any text: `"Br 750"`, `"From Br 1,200"`, `"Inquire"`, or `""` to hide. |
| `tone`     | Placeholder colour when there's no photo: `"chestnut"`, `"sand"`, `"deep"`, or `"ink"`. |
| `images`   | List of photo paths (see below). `[]` shows a branded placeholder. |
| `link`     | *Optional.* Where this product's "Inquire about this piece" button goes. Leave it out to use `links.product`. |

Products appear in the gallery in the same order as in the file. To remove a
product, delete its whole `{ ... }` block (and fix the comma).

### 4. Adding photos
1. **Prepare the photo** — square (1:1), about 1000×1000 px, `.jpg` or `.webp`,
   ideally under ~300 KB.
2. **Name it simply** — lowercase, dashes, no spaces: `aurora-walnut.jpg`.
3. **Put it in** `assets/products/`.
4. **List it** in that product's `images` in `data/products.json`:
   ```json
   "images": ["assets/products/aurora-walnut.jpg"]
   ```
   The path must match the filename exactly (including `.jpg` vs `.jpeg`, and
   capital letters — many web hosts are case-sensitive).

**Several photos / colour variants of one piece** — list them all on the same
product instead of creating separate products. The first photo is the card cover:
```json
"images": [
  "assets/products/aurora-walnut.jpg",
  "assets/products/aurora-maple.jpg",
  "assets/products/aurora-cherry.jpg"
]
```
The card gets a small "3 photos" badge and the popup becomes a slideshow.

**Phone photos (`.heic`) won't display** in Chrome, Edge, or Firefox — convert
them to `.jpg` first (most phones can export as JPG, or use any free online
converter). Full-size camera photos (3–8 MB) also make the site slow; shrink them
to ~1200 px before adding.

`assets/products/originals/` holds the untouched full-size photos the current
web versions were made from. The site doesn't use that folder, so you can leave
it out when uploading.

---

## Contact form

The form opens the visitor's email app addressed to `contact.email` — no server
needed. **Want messages to arrive without the visitor's email app?** Sign up at
[Formspree](https://formspree.io) (free tier) or host on **Netlify** and use
Netlify Forms; either needs a small change in `js/main.js`.

## Brand reference (from the profile PDF)

| Colour       | Hex       | Used for                        |
|--------------|-----------|---------------------------------|
| Ghost White  | `#F8F8FF` | text on dark, light surfaces    |
| Sand         | `#C4A484` | accents, placeholders           |
| Chestnut     | `#8B5E3C` | primary buttons, links, eyebrows|
| Dark Gray    | `#2D2D2D` | body text, contact section      |
| Warm Cream   | `#F1EAE3` | page background                 |

Fonts: **Brillant** by suhadidesign (the "Signature" wordmark, from
`assets/brillant/`), **Cormorant Garamond** (headings) + **Jost** (body / labels)
from Google Fonts.

## Still to do

- Add prices — every product currently has `"price": ""` (hidden).
- Check product names/descriptions (written from the photos) and adjust wording.
- Replace the "Studio / maker photo" placeholder in the Story section (`index.html`).

## Publishing to your shared hosting

The site is fully static, so it runs on any shared host (cPanel, Plesk, etc.) —
no PHP, database, or Node needed.

**1. Build the upload bundle** (WSL):
```bash
bash package.sh
```
This creates `signature-craft-site.zip` (and the same files unzipped in `dist/`)
containing only what the live site needs — no originals, PDFs, or dev files — and
warns you if any photo listed in `products.json` is missing.

**2. Upload it** — cPanel File Manager:
1. Open **File Manager** → `public_html` (or the folder for your domain/subdomain).
2. **Upload** `signature-craft-site.zip`.
3. Right-click it → **Extract**, into that same folder. Then delete the zip.
4. Check that `index.html` sits directly inside `public_html`
   (not in `public_html/dist/`).

Or with an FTP client (e.g. FileZilla): upload the **contents** of `dist/` into
`public_html`.

**3. Visit your domain.** If you still see an old page, do a hard refresh
(`Ctrl+F5`).

**Updating later:** for product/contact changes, just re-upload
`data/products.json` (and any new photos into `assets/products/`). For anything
else, re-run `package.sh` and re-upload the zip.

> If the gallery says it couldn't load the product list on the live site, check
> that `data/products.json` was uploaded and that the host serves `.json` files
> (nearly all do).

---

### Note on the logo
The infinity "S" mark is a clean SVG recreation of your brand mark (it scales to any
size without blur). If you'd like the *exact* artwork from your logo PDF used instead,
export it as `logo-mark.svg` and drop it in `assets/` (same filename) — everything
will pick it up.
