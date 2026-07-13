# Open Graph Brand Image

## Goal

Replace the temporary social preview with a production-ready 1200 x 630 px image for Telegram, VK, WhatsApp, and other Open Graph consumers.

## Composition

- Use the current real Hero shawarma photograph as the main food image.
- Keep the food on the right side and preserve a clear, appetizing view of the filling.
- Use the current brand icon without redrawing or changing it.
- Place the brand icon and the exact name `Шаурма №1 Халяль` on the left.
- Use the existing warm graphite background and saffron accent.
- Add a soft dark transition behind the text for readability.
- Do not add a tagline, temporary notice, small decorative text, or interface elements.
- Keep important content inside safe margins so messenger crops do not remove the name or food.

## Output

- New file: `public/images/brand/og-shawarma-no1.png`.
- Dimensions: exactly 1200 x 630 px.
- Format: PNG, optimized without visible quality loss.
- The old `og-placeholder.png` and `og-placeholder.svg` files are removed.

## Metadata

- Open Graph uses the absolute URL for `og-shawarma-no1.png` with width 1200, height 630, and a useful Russian alt description.
- Twitter uses `summary_large_image` and the same absolute image URL.
- No metadata entry references the old placeholder.

## Validation

- Confirm the image dimensions and file format.
- Search the project for old placeholder references and temporary preview text.
- Run formatting, ESLint, TypeScript, unit tests, and the production build.
- Inspect the generated HTML metadata.
- After deployment, verify that the image URL returns HTTP 200 with an image content type.

## Public URL

After deployment the image is available at:

`https://fastnightshadow-bit.github.io/chaurma/images/brand/og-shawarma-no1.png`
