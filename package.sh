#!/usr/bin/env bash
# Signature Craft — bundle the site for upload to shared hosting.
# From the project folder (WSL):   bash package.sh
# Produces:
#   dist/                     exactly the files the live site needs
#   signature-craft-site.zip  the same, zipped — upload & extract into public_html
# Leaves out originals, PDFs, README, preview scripts, git and editor files.
set -euo pipefail
cd "$(dirname "$0")"

rm -rf dist signature-craft-site.zip
mkdir -p dist/assets/products

cp index.html dist/
cp -r css js data dist/
cp assets/*.svg dist/assets/
# logo font (only the font file, not the preview images/licence)
mkdir -p dist/assets/brillant
cp assets/brillant/brillant.otf dist/assets/brillant/
# web-ready product photos only (not assets/products/originals/)
find assets/products -maxdepth 1 -type f \
  \( -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.png' -o -iname '*.webp' \) \
  -exec cp {} dist/assets/products/ \;

# warn about photos referenced in products.json that don't exist
missing=0
while IFS= read -r img; do
  if [ ! -f "dist/$img" ]; then echo "  MISSING: $img"; missing=1; fi
done < <(grep -o '"assets/products/[^"]*"' data/products.json | tr -d '"')

(cd dist && zip -qr ../signature-craft-site.zip .)

echo ""
echo "  dist/ and signature-craft-site.zip ready ($(du -sh dist | cut -f1), $(find dist -type f | wc -l) files)"
[ "$missing" = 1 ] && echo "  ^ fix the missing photos above before uploading" || echo "  All product photos found."
echo ""
