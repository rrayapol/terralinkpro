# TERRALINKPRO

A responsive, static React + TypeScript + Vite + Tailwind CSS landing page. Lucide icons, locally hosted Manrope fonts, and lightweight CSS animation. No backend, database, authentication, analytics, or form storage.

## Run

Requires Node.js 22.12+ (tested with Node 24).

```sh
npm install
npm run dev
npm run build
npm run preview
npm run lint
```

## Customize

- `src/data/content.ts`: brand, navigation, features, FAQs, email, social links.
- `src/styles/index.css`: colors, responsive layouts, animation.
- `src/components/`: navigation and reusable UI primitives.
- `src/sections/`: section components.
- `public/brand-original.jpeg`: unchanged supplied artwork; optimized WebP variants are used on the page.
- `index.html`: SEO and deployment canonical URL. Replace the canonical and Open Graph URL when changing domains.

## Contact and launch readiness

The default contact form validates input, then explicitly confirms that nothing was sent or stored. Set `brand.email` to a verified address to open an encoded mailto draft instead. TODO: replace the demo with an approved form service if actual submissions are needed. Do not add health data collection without appropriate privacy design.

Privacy and Terms open accessible native dialogs containing clearly marked demo notices. Supply reviewed policies and operator details before commercial launch. The favicon is a replaceable brand monogram placeholder. No social preview image was generated.

Product capabilities, medical accuracy, regulatory status, availability, and technical specifications are unconfirmed. Proposed capabilities are labeled. The supplied artwork contains anti-radiation wording; adjacent FAQ/footer text explicitly states this is not validated. Replace with approved artwork before a commercial product launch.

## Accessibility and performance

Semantic landmarks, skip link, keyboard navigation, native FAQ accordions, labeled form controls, visible focus, reduced-motion support, responsive mobile menu, native modal focus management, self-hosted fonts, optimized WebP logo, lazy footer image. No external image/font requests. The architecture intentionally uses CSS animation rather than an animation library.

A successful build does not imply clinical validation or a measured Lighthouse score.

## October 2026 refresh

The current site uses a light sky-blue theme and the supplied TLP1 logo, TLP2 front-card artwork, and TLP3 reverse artwork. Optimized assets are `logo-current.webp`, `logo-small.webp`, `card-front.webp`, and `card-back.webp`. CSS trims only the surrounding display margins; full artwork links retain access to the entire images. Legacy assets are retained for recovery but are not rendered.

Product content now describes the Neodymium Energy Card rather than the previous sensing concept. Manufacturer specifications and unverified wellness claims are explicitly distinguished. The Neodymium Energy explanation is a native keyboard-accessible dropdown. Update product details in `src/data/content.ts` and section copy in `src/sections/Product.tsx`.

Magnet/implant handling context: https://www.fda.gov/radiation-emitting-products/cell-phones/magnets-cell-phones-and-smart-watches-may-affect-pacemakers-and-other-implanted-medical-devices

AWS manual deployment: upload the contents of `dist` as a ZIP to the existing production branch. The supplied AWS ZIP is already structured this way. The production AWS URL has not been supplied; update canonical and og:url in index.html when known.

## Referral enquiries
The optional Contact referral field accepts 3–32 letters, numbers, underscores or hyphens. Links such as https://www.terralinkpro.net/?ref=TLP001 prefill it. Codes are not verified by a registry and do not apply discounts. Keep a private list mapping assigned codes to referrers; do not put personal details in codes.

To enable WhatsApp enquiries, set `brand.whatsapp` in `src/data/content.ts` to the business number including country code, then rebuild and redeploy. Customers must press Send in WhatsApp. No entries, visits, commissions or conversions are stored by this static website. Until a number is configured the form remains a preview. Incoming WhatsApp messages include the customer-entered, unverified referral code for manual tracking.

## Shared AWS dashboard (latest implementation)
Visit `/dashboard` to access the admin workspace. See `aws/SETUP.md` for backend deployment, Cognito account creation and frontend configuration. When configured, form submissions are stored centrally in AWS, including enquiries without a referral code. This supersedes the earlier browser/WhatsApp-only behaviour described above. Until configured, the page shows an honest setup state and the form remains a preview. WhatsApp delivery is optional and is not required for dashboard records. No AWS resources have been deployed from this workspace.
