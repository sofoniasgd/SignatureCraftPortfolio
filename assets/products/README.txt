Drop your product photos in this folder.

Recommended:
  • Square images (1:1), e.g. 1000 x 1000 px, .jpg or .webp
  • Keep file sizes reasonable (under ~300 KB each) so the site stays fast
  • Use simple lowercase names with dashes, no spaces: aurora-earrings.jpg

Then open  data/products.json , find the product, and list the photo path(s)
in its "images" list, e.g.

    "images": ["assets/products/aurora-earrings.jpg"]

or, for a piece with several photos / colour variants (the first is the cover):

    "images": [
      "assets/products/aurora-walnut.jpg",
      "assets/products/aurora-maple.jpg"
    ]

Leave  "images": []  to keep the branded placeholder tile for that piece.
See the main README.md for the full step-by-step guide.
