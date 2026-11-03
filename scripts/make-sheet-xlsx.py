"""Builds the starting Google Sheet (as .xlsx) from scripts/fixtures/*.csv.
Uploaded once to Drive, where it converts to a Google Sheet that Mia edits."""
import csv, sys
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment
from openpyxl.worksheet.datavalidation import DataValidation

out = sys.argv[1]
wb = Workbook()
head_fill = PatternFill('solid', fgColor='4D352C')
head_font = Font(bold=True, color='F8F2E8')
note_font = Font(italic=True, color='6B5248')

def load(name):
    with open(f'scripts/fixtures/{name}.csv', newline='') as f:
        return list(csv.reader(f))

def typed(v):
    if v in ('TRUE', 'FALSE'): return v == 'TRUE'
    try:
        return int(v) if v.isdigit() else float(v) if v.replace('.', '', 1).isdigit() else v
    except ValueError:
        return v

def tab(ws, rows, widths, as_text=False):
    # as_text: every value stays a string. Google's CSV endpoint guesses one type per
    # column and blanks values of any other type, so mixed columns must be all text.
    for r in rows:
        ws.append([c if (r is rows[0] or as_text) else typed(c) for c in r])
        if as_text:
            for c in ws[ws.max_row]: c.number_format = '@'
    for c in ws[1]:
        c.fill, c.font = head_fill, head_font
    ws.freeze_panes = 'A2'
    for col, w in widths.items():
        ws.column_dimensions[col].width = w
    for row in ws.iter_rows(min_row=2):
        for c in row:
            c.alignment = Alignment(vertical='top', wrap_text=True)

def dropdown(ws, col, options, last=60):
    dv = DataValidation(type='list', formula1='"' + ','.join(options) + '"', allow_blank=True)
    dv.add(f'{col}2:{col}{last}')
    ws.add_data_validation(dv)

# menu
ws = wb.active; ws.title = 'menu'
tab(ws, load('menu'), dict(A=20, B=26, C=8, D=9, E=52, F=11, G=11, H=10, I=6, J=28, K=18))
dropdown(ws, 'D', ['each', '4-pack'])
dropdown(ws, 'F', ['cookie', 'brownie', 'bites'])
dropdown(ws, 'G', ['signature', 'limited', 'new'])
dropdown(ws, 'H', ['TRUE', 'FALSE'])
for r in range(2, 60): ws[f'C{r}'].number_format = '$0.00'

ws = wb.create_sheet('bundles')
tab(ws, load('bundles'), dict(A=16, B=24, C=8, D=46, E=14, F=10, G=6))
dropdown(ws, 'F', ['TRUE', 'FALSE'])
for r in range(2, 30): ws[f'C{r}'].number_format = '$0.00'

ws = wb.create_sheet('settings')
tab(ws, load('settings'), dict(A=24, B=90), as_text=True)
for r in ws.iter_rows(min_row=2):
    if r[0].value == 'ordering_open':
        dv = DataValidation(type='list', formula1='"TRUE,FALSE"'); dv.add(r[1].coordinate); ws.add_data_validation(dv)

ws = wb.create_sheet('How to edit')
ws.column_dimensions['A'].width = 110
lines = [
    ('How to update the website', True),
    ('Edit cells on the menu, bundles and settings tabs. The website picks up changes within about 3 hours (or right away if Devin runs the update).', False),
    ('', False),
    ('menu tab', True),
    ('• price: just the number, like 3.75', False),
    ('• available: set to FALSE when something sells out. It stays on the site with a "Sold out this week" label.', False),
    ('• tag: signature, limited or new adds a little label. Leave it blank for none.', False),
    ('• sort: order on the page, smallest first.', False),
    ('• id: short name with dashes, no spaces (like caramel-cone-crunch). Don\'t change an existing one: photos are matched to it.', False),
    ('• To add an item, add a row. To remove one, delete its row.', False),
    ('', False),
    ('settings tab (only change the value column)', True),
    ('• movein_item_id: the id of this week\'s Neighborhood Move-In (like smores). Leave blank to hide that section.', False),
    ('• movein_headline / movein_blurb: the words for the Move-In section. movein_until: optional, like "Sunday, Nov 9".', False),
    ('• announcement: the strip at the very top of the site. Leave blank to hide it.', False),
    ('• ordering_open: set to FALSE to pause orders. Order buttons switch to "Orders reopen soon" and orders_closed_message shows at the top.', False),
    ('• pickup_location / pickup_times: fill these in once you know them. Until then the site says you\'ll confirm by email.', False),
    ('', False),
    ('If something looks wrong on the site', True),
    ('If a cell has a mistake (like a price with letters), the site ignores the whole update and keeps showing the last good menu. Fix the cell and it will update next time.', False),
]
for text, bold in lines:
    ws.append([text])
    c = ws.cell(row=ws.max_row, column=1)
    c.font = Font(bold=bold, size=13 if bold else 11, color='4D352C')
    c.alignment = Alignment(wrap_text=True)
wb.move_sheet('How to edit', offset=-3)
wb.active = 0
wb.save(out)
print('saved', out)
