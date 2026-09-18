# Signature Craft — Portfolio Website

A single-page, elegant portfolio site for **Signature Craft** — handmade jewelry and
artisanal pieces crafted from high-quality wood board.
Plain HTML, CSS, and JavaScript. No build step, no frameworks, no dependencies.

> *Handmade. Timeless. You.*

---

## View it

**Easiest:** double-click `index.html` — it opens in your browser.
(Needs an internet connection the first time, to load the two brand fonts.)

**Nicer (local server, recommended for editing):**
right-click `serve.ps1` → **Run with PowerShell**. It opens
`http://localhost:5173/` automatically. Press `Ctrl+C` to stop.

---

## Project structure

```
index.html            The whole page (all sections)
css/styles.css        All styling — brand colours & type live at the top
js/products.js        ← YOUR PRODUCT LIST. Edit this to add/change pieces.
js/main.js            Interactions (nav, filtering, lightbox, form)
assets/
  logo-mark.svg       The infinity "S" mark, recreated as scalable vector
  products/           ← Drop your product photos here (see its README.txt)
serve.ps1             Optional local preview server
```

## The three things you'll actually edit

### 1. Add or change products — `js/products.js`
Each product is a small block. Copy one, change the fields:
```js
{
  name: "Aurora Drop Earrings",
  category: "Earrings",              // must match a filter category
  material: "Walnut board · brass hooks",
  desc: "Featherlight teardrop earrings…",
  price: "Br 750",                   // or "From Br 1,200", "Inquire", or ""
  image: "assets/products/aurora.jpg", // or "" for a branded placeholder tile
  tone: "chestnut",                  // placeholder colour if no image
}
```
Categories are listed at the top of the same file (`CATEGORIES`). Add one there and
the matching filter button appears automatically.

### 2. Add real photos
Put images in `assets/products/` (square, ~1000×1000, .jpg/.webp), then point each
product's `image:` at the file. Until you do, each piece shows a tasteful branded
placeholder — nothing looks broken.

### 3. Contact form email
The form opens the visitor's email app addressed to the business
(no server needed). Set the destination inbox in `js/main.js`:
```js
const ORDER_EMAIL = "hello@signaturecraft.com"; // ← change to the real inbox
```
**Want submissions to arrive without the visitor's email app?** Sign up at
[Formspree](https://formspree.io) (free tier) and replace the form's `submit`
handling — or host on **Netlify** and add `netlify` to the `<form>` tag. Ask and
I'll wire either one up.

## Brand reference (from the profile PDF)

| Colour       | Hex       | Used for                        |
|--------------|-----------|---------------------------------|
| Ghost White  | `#F8F8FF` | text on dark, light surfaces    |
| Sand         | `#C4A484` | accents, placeholders           |
| Chestnut     | `#8B5E3C` | primary buttons, links, eyebrows|
| Dark Gray    | `#2D2D2D` | body text, contact section      |
| Warm Cream   | `#F1EAE3` | page background                 |

Fonts: **Cormorant Garamond** (headings / logotype) + **Jost** (body / labels),
loaded from Google Fonts.

Contact details wired into the footer & contact section:
+251 939 954 213 · +251 941 246 822 · Instagram @signa_ture277 ·
TikTok @signature.craft · Telegram @Signaturecraft

## Publishing it online (free options)

- **Netlify Drop** — drag this whole folder onto <https://app.netlify.com/drop>. Done.
- **GitHub Pages** — push to a repo, enable Pages on the `main` branch.
- **Cloudflare Pages / Vercel** — connect the repo, no build command needed.

All work as-is because the site is fully static.

---

### Note on the logo
The infinity "S" mark is a clean SVG recreation of your brand mark (it scales to any
size without blur). If you'd like the *exact* artwork from your logo PDF used instead,
export it as `logo-mark.svg` or a transparent `logo-mark.png` and drop it in `assets/`
(same filename) — everything will pick it up.
