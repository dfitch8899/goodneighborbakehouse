# Running the website (for Mia)

You never need to touch code. Everything on the site that changes week to week comes from
the **Good Neighbor Bakehouse — Website Menu** Google Sheet.

## How fast do changes show up?

The site checks the sheet **every 3 hours**. If you want a change live right now, ask Devin to
press **Run workflow** (GitHub → Actions → Deploy site), and it's live in about 2 minutes.

## Common jobs

| I want to… | Do this in the sheet |
| --- | --- |
| Change a price | `menu` tab → `price` column. Just the number, like `3.75`. |
| Mark something sold out | `menu` tab → `available` → `FALSE`. It stays on the site with a "Sold out this week" label. Set back to `TRUE` when it's back. |
| Change this week's Move-In flavor | `settings` tab → `movein_item_id` → the item's `id` (like `smores`). Update `movein_headline` and `movein_blurb` too. Leave `movein_item_id` blank to hide the section. |
| Add an end date to the Move-In | `settings` → `movein_until`, e.g. `Sunday, Nov 9`. Shows "Here through Sunday, Nov 9". |
| Change the strip at the very top | `settings` → `announcement`. Blank hides it. |
| Pause orders (exams, vacation) | `settings` → `ordering_open` → `FALSE`. Every Order button becomes "Orders reopen soon" and `orders_closed_message` shows at the top. |
| Add pickup details | `settings` → `pickup_location` and `pickup_times`. Until they're filled in, the site says you'll confirm pickup by email. |
| Add allergens | `menu` → `allergens`, e.g. `wheat · dairy · egg`. Shows on the item's card. Also check `settings` → `allergen_statement`. |
| Add a new item | Add a row to `menu`. Give it a short `id` with dashes and no spaces (`maple-pecan`). Pick a `category` (cookie, brownie, bites). |
| Label something | `menu` → `tag`: `signature`, `limited` or `new`. |
| Change the order on the page | `menu` → `sort`, smallest first. |
| Edit a bundle | `bundles` tab. `badge` (like `Best value`) highlights it. |
| Change the order form link | `settings` → `order_form_url`. Every Order button uses it. |
| Set the drop-off fee | `settings` → add a row `dropoff_fee` with the amount, like `2` (shows "a $2 fee"). Optional row `dropoff_notes` replaces the whole drop-off sentence. Add `dropoff_available` = `FALSE` to turn drop-off off. Without these rows the site says drop-off is "a small extra fee". |
| Remove an item for good | Delete its row on the `menu` tab. (For a week or two, `available` = `FALSE` is better: people still see it's on the menu.) |

## Photos

Don't paste pictures into the sheet: pictures float over the cells, so they can't stay
attached to an item. Instead, put a **link** in the item's `image` cell:

1. Upload the photo to Google Drive.
2. Right-click it → **Share** → General access: **Anyone with the link** (Viewer).
3. **Copy link** and paste it into that item's `image` cell on the `menu` tab.

On the next update the website downloads it, turns it the right way up and sizes it. To change
a photo, paste a new link. Leave the cell blank to keep the current photo. Until an item has a
photo, the site shows a designed "stamp" with its name, so nothing looks broken. Tips for great
photos: [PHOTO-BRIEF.md](PHOTO-BRIEF.md).

## If something looks wrong

If a cell has a mistake the site can't understand (like `three fifty` in a price, or an `id`
in `movein_item_id` that isn't on the menu tab), the site **ignores the whole update and keeps
showing the last good menu**. Fix the cell and it'll update next time. Devin can see exactly
which cell is the problem in the GitHub Actions log.

## Things to double-check before launch

- [ ] Pickup spot and times are filled in.
- [ ] Allergens are filled in for every item, and the allergy statement is accurate.
- [ ] Ohio home-bakery / cottage food rules have been checked for labels and selling.
- [ ] Venmo: consider a Venmo business profile for sales.
- [ ] Place a real test order: form → confirmation email → Venmo → pickup.
