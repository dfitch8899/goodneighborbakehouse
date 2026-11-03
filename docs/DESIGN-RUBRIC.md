# Good Neighbor Bakehouse: Design Rubric

Method: WebSearch only. Direct fetches of bakery sites were blocked, so nothing here comes from looking at a live page. **[V]** means a search result confirmed it (the source is named). **[I]** means I inferred it from common DTC/Shopify bakery patterns or general knowledge. Check every [I] against the live sites before relying on it. Most of the measurable cues (px, ms, ratios) are targets I set, not measurements.

## 1. Benchmark notes

**Levain Bakery**
- [V] Shopify store. Has a "Limited Time Only" product page type (`/products/lemon-cookie`), named bundles ("cheers bundle"), a Cookie Club subscription, and a FAQ page. Packaging uses a signature blue (The Creative Pack). DesignRush calls the homepage "pastel, minimal."
- [I] The hero is one giant close-up of a thick cookie with one CTA ("Shop Cookies"). Nav has about 5 items with a cart at the right. Cards show photo, name, price and pack size. Seasonal cookies get a small "Limited" tag rather than a separate section.

**Milk Bar**
- [V] Type is Garnett (Sharp Type). The Black weight is used for headers and Regular for recipe and ingredient copy. The brand is known for being playful and bold.
- [I] Heavy all-caps display headings, flat saturated pastel blocks, and product shots on solid backgrounds. Strong scale contrast: the display size is about 4x the body size.

**Crumbl**
- [V] Rebrand by Turner Duckworth (2024). Black "Crumbl" wordmark set in a custom variable "Crumbl Sans" over a proprietary "Crumbl Pink"; the mascot was dropped. The weekly rotation has about 5 limited-time flavors and is revealed on Sundays. Scarcity drives repeat visits. The app is the hub (menu, pickup, delivery, rewards, flavor history) and there is a store locator.
- [I] The weekly menu shows one large card per flavor with a cutout cookie on pink, name, short description and "This week" framing. The location is chosen before ordering.

**King Arthur Baking**
- [V] Redesign alongside the 2020 rebrand (Drupal/Acquia, Third and Grove, Bukwild). Commerce is woven into content ("contextual commerce"). The brand is values-led: B-corp and employee-owned.
- [I] Dense mega-nav (Shop / Recipes / Learn / Blog), editorial photography in natural light, and an accessible, utilitarian footer with lots of links. Sets the bar for content clarity, not for small-site restraint.

**Mah-Ze-Dahr**
- [V] Shopify. DesignRush praises the "great food photography" and the clean, simple product grid on the homepage. Shop and About sit on the homepage, so visitors rarely navigate away. Sage Agency calls out a hero video and polished product cards. The signature color is a deep "Mah-Ze-Dahr blue" (in the interiors), and the mood is "airy but moody."
- [I] A serif and sans pairing with generous whitespace. Cards are photo, name and price, with no clutter.

**SusieCakes**
- [V] Rebrand by Red Antler: started from the typeface, added a "Susie" character, and used a soft robin's-egg "Susie blue" taken from Grandma's Pyrex. The aim was "vintage but modern," the closest analog to our brand. Ordering is split into Local Pickup, Local Delivery and National Shipping. Some decorated cakes are available same-day "depending on availability." Smash cakes need 24 hours' notice. There are location pages and a FAQ.
- [I] Ordering is first sorted by fulfillment method. Lead times are stated next to each product.

**Small and home bakeries**
- [V] Bellweather Bread Co. (via We.inc) pairs two hero buttons, "Preorder bread" and "See the bake list." We.inc warns against a "Preorder" button with nothing behind it. Brooki Bakehouse uses rust and terracotta accents with clean grids (Colorlib), close to our palette. Creswell Bakery uses huge, up-close photos.

**Not verified anywhere:** sold-out states, exact nav heights, hover timings, and mobile layouts for any benchmark. The scores below give these as targets, not observations.

## 2. Rubric (1 / 3 / 5)

**1. Hero impact.** 5 bar: Levain, Bellweather.
- 1: Stock photo, vague tagline, no CTA, or 3 or more competing CTAs.
- 3: Real photo and a clear headline, but the CTA is below the fold on mobile.
- 5: One macro shot of the product (texture visible); a headline of 8 words or fewer; a primary CTA plus one secondary ("Order" / "See menu"); at 375px the CTA is visible without scrolling.

**2. Nav clarity.** 5 bar: Mah-Ze-Dahr (inferred).
- 1: More than 7 items, no CTA, nav covers content.
- 3: 5–6 items; the CTA is styled like the other links.
- 5: 4–5 anchor links plus one filled CTA button. 64–72px tall on desktop, shrinking to about 56px on scroll. Shows the active section. Mobile shows the logo, the CTA and a menu toggle.

**3. Product card system.** 5 bar: Mah-Ze-Dahr, Levain.
- 1: Photo sizes and crops vary; prices are missing.
- 3: Consistent photos and prices; no dietary or status info.
- 5: Fixed aspect ratio (4:5 or 1:1). Each card has name, one-line description, price and unit ("$14 / half-dozen"), optional dietary tags (GF/V/nuts) and a status badge slot. Every card is the same height; text is 2 lines max.

**4. Photography treatment.** 5 bar: Mah-Ze-Dahr, Creswell.
- 1: Mixed lighting, phone flash, cluttered backgrounds.
- 3: Consistent but flat.
- 5: One light direction (soft side window), one surface or prop family (for us: cream linen or wood), matched color grade, and a mix of macro and overhead shots. No photo is used twice.

**5. Typography.** 5 bar: Milk Bar (scale), SusieCakes (vintage plus modern).
- 1: 3 or more families, or headings and body about the same size.
- 3: Pairing works but the scale is timid (ratio under 1.2).
- 5: Two families. Body 16–18px with 1.5–1.6 line height. A type scale of about 1.25–1.333, with H1 at roughly 3–3.5x body on desktop and 2.25x on mobile. Line length 60–75 characters. Weights are used deliberately.

**6. Color discipline.** 5 bar: Crumbl (one signature hue), SusieCakes.
- 1: More than 4 accent colors; low-contrast text.
- 3: The palette is followed but the accent is spread everywhere.
- 5: One neutral, one dark and one accent, with the accent kept for CTAs, badges and the one feature band. Text contrast is at least 4.5:1, so check terracotta on cream.

**7. Motion restraint.** 5 bar: inferred, no benchmark verified.
- 1: Parallax, autoplay carousels, scroll-jacking.
- 3: Fade-ins on every section.
- 5: Hover and focus at 150–250ms ease-out: card lift of 2–4px or image scale of 1.02–1.04, plus a button color shift. Respects `prefers-reduced-motion`. No carousel.

**8. Mobile ergonomics.** 5 bar: Crumbl (app-like ordering).
- 1: Horizontal scroll, tap targets under 32px.
- 3: Stacks correctly but the CTA is buried.
- 5: Tap targets at least 44px; a 16px gutter; grid is 1 column (or 2 compact columns), going to 3 at 900px and up; sticky CTA reachable by thumb; no hover-only information.

**9. Ordering clarity.** 5 bar: SusieCakes (methods and lead times), Crumbl (order cutoff).
- 1: "DM to order."
- 3: Steps are listed, but cutoffs, payment and pickup location are vague.
- 5: Numbered steps that each have a verb and a time ("Order by Wed 8pm"). Payment and pickup spot are named. Lead time and minimums are stated. The CTA opens a working form (per We.inc's warning).

**10. Polish and states.** 5 bar: Levain ("Limited Time Only"), Crumbl.
- 1: Sold-out items silently missing; broken links.
- 3: A "sold out" label, but the card still looks clickable.
- 5: Each card has a "Limited," "Sold out this week" or "Back [date]" state, with a greyed-out photo and a disabled CTA. Visible focus rings; a 404 and an empty-state message; images have alt text; footer is complete.

## 3. Patterns to adopt

1. **Two hero CTAs only:** "Order this week" (filled terracotta, links to the Google Form) and "See the menu" (ghost, anchor). Copy should state the pickup promise: "Baked Thursday, picked up on campus Friday."
2. **Nav:** Menu · Bundles · How it works · FAQ, plus the "Order" button. 64px tall, shrinking to 56px on scroll, cream at 92% opacity with a backdrop blur, and a 1px cocoa border at 10% opacity.
3. **Move-In band as Crumbl-style drop:** cocoa background with cream text. Include a "This week only" eyebrow, dates ("Aug 18–24"), 1–3 flavor cards and a small counter ("12 boxes left") if we can keep it honest.
4. **Card anatomy:** 4:5 photo, Fraunces name at 20–22px, one DM Sans line, price plus unit, and tags in caps at 12px. Keep a badge slot in the top-left corner.
5. **Sold-out state:** 40% desaturated photo, a "Sold out this week" pill and a disabled CTA. Never hide the card, so people learn the menu.
6. **Bundles as a 3-up price ladder:** make the middle bundle the "Most popular" (terracotta outline) and show the saving against buying items separately.
7. **Ordering steps with deadlines:** Form (by Wed 8pm) → Confirmation email within 24h → Venmo @handle or cash at pickup → Pickup at [named spot, e.g. a College Green landmark], Fri 3–6pm. Use large Fraunces numerals.
8. **Type scale:** 1.25 ratio, body 17px DM Sans. H1 in Fraunces at 56px desktop / 38px mobile, using the optical-size (opsz) axis for vintage warmth; drop the SOFT axis on body-adjacent text.
9. **Color tokens:** cream background, cocoa text, terracotta only for CTAs, badges and step numerals. Check terracotta on cream reaches 4.5:1, and darken it for text if it doesn't.
10. **Motion:** 200ms ease-out hover: card translateY(-3px) plus a soft shadow and image scale 1.03. Honor reduced motion. No carousels.
11. **Photo kit:** one window-light setup with a cream linen backdrop, the same angle across all 6 menu items, plus one human shot (hands, or a campus pickup) for the "neighbor" feel.
12. **Mobile sticky bar:** under 640px, a bottom "Order this week →" bar appears after the hero scrolls out of view; 48px tall.
13. **Footer:** pickup spot and hours, order cutoff, Instagram, an allergen note ("home kitchen, contains nuts/wheat"), a cottage-food disclosure if Ohio rules require one, and a FAQ link.
14. **FAQ:** short accordions grouped Ordering / Pickup / Payment / Allergens. Repeat the cutoff and the pickup spot in the first answer.
15. **Lead-time line on bundles and cards** (borrowed from SusieCakes): "Order 2 days ahead" in small type under the price.

## Sources
- [Levain FAQ](https://levainbakery.com/pages/faq) · [Levain LTO page](https://levainbakery.com/products/lemon-cookie) · [Creative Pack x Levain](https://packagingoftheworld.com/2021/12/the-creative-pack-designs-levain-bakery-ecommerce-packaging.html) · [DesignRush Levain](https://www.designrush.com/best-design/leva)
- [Sharp Type: Milk Bar & Garnett](https://www.sharptype.co/news/milk-bar-garnett)
- [Turner Duckworth Crumbl](https://turnerduckworth.com/work/crumbl) · [Transform](https://transformmagazine.net/articles/2024/crumbl-cookies-brand-simplified-by-turner-duckworth) · [Tasting Table](https://tastingtable.com/1426564/how-often-crumbl-change-cookie-flavors) · [Designbeep](https://designbeep.com/2026/07/31/crumbl-cookie-near-me/)
- [Acquia KAB](https://www.acquia.com/resources/case-study/king-arthur-baking-company) · [Third and Grove](https://thirdandgrove.com/work/king-arthur-flour)
- [DesignRush Mah-Ze-Dahr](https://www.designrush.com/best-design/mah-ze-dahr-bakery) · [Sage Agency](https://sage.agency/?p=19417) · [Hospitality Design](https://hospitalitydesign.com/news/mah-ze-dahr-bakery-washington-dc/106362)
- [SusieCakes FAQ](https://susiecakes.com/faq) · [Carlsbad page](https://susiecakes.com/locations/carlsbad-forum) · [Grits & Grids](https://gritsandgrids.com/?p=7877) · [Food Chain](https://foodchainmagazine.com/in-modernizing-a-homemade-feel-susiecakes-adapts-old-school-american-baking-for-the-21st-century/)
- [We.inc bakeries](https://we.inc/website-examples/bakeries) · [Colorlib](https://colorlib.com/wp/bakery-websites-design/) · [My Codeless Website](https://mycodelesswebsite.com/bakery-websites/)
