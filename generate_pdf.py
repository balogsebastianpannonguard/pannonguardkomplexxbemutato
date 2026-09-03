#!/usr/bin/env python3
"""
PannonGuard Komplex – 3 oldalas elegáns PDF generátor
Balog Sebastian Máté · PannonGuard Zrt. · 2026
"""

import os
import math
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm, cm
from reportlab.lib.colors import (
    HexColor, white, black, Color
)
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table,
    TableStyle, HRFlowable, KeepTogether
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

# ── Colors ──────────────────────────────────────────────────────────────────
NAVY        = HexColor("#080e1f")
NAVY_MID    = HexColor("#0f1a35")
NAVY_LIGHT  = HexColor("#162040")
GOLD        = HexColor("#c9a227")
GOLD_LIGHT  = HexColor("#f0c940")
GOLD_DIM    = HexColor("#2d2208")
BLUE_ACC    = HexColor("#2d4db8")
BLUE_LIGHT  = HexColor("#96b4ff")
WHITE       = HexColor("#ffffff")
WHITE_70    = HexColor("#b3b8c9")
WHITE_50    = HexColor("#7a8099")
WHITE_30    = HexColor("#4a5070")
GREEN_ACC   = HexColor("#22c55e")
GREEN_LIGHT = HexColor("#86efac")
RED_ACC     = HexColor("#ef4444")

W, H = A4  # 595.27 x 841.89 pts

OUTPUT = os.path.join(
    os.path.dirname(os.path.abspath(__file__)),
    "public",
    "PannonGuard_Komplex_Biztonsagi_Dokumentacio.pdf"
)

SHIELD_IMG = os.path.join(
    os.path.dirname(os.path.abspath(__file__)),
    "public",
    "pannongard_shield_1788357724079.jpg"
)

# ── Helper: draw background on every page ───────────────────────────────────
def draw_background(c: canvas.Canvas, page_num: int):
    """Dark navy background + subtle gold grid + radial glow simulation."""
    c.saveState()

    # Fill background
    c.setFillColor(NAVY)
    c.rect(0, 0, W, H, fill=1, stroke=0)

    # Grid lines (subtle gold tint) – every 20mm
    step = 20 * mm
    c.setStrokeColor(HexColor("#c9a2270f"))
    c.setLineWidth(0.3)
    x = 0
    while x <= W:
        c.line(x, 0, x, H)
        x += step
    y = 0
    while y <= H:
        c.line(0, y, W, y)
        y += step

    # Top radial glow (blue)
    for i in range(8, 0, -1):
        alpha = 0.015 * i
        r = (9 - i) * 28
        c.setFillColor(Color(0.18, 0.30, 0.72, alpha=alpha))
        c.ellipse(W / 2 - r * 2, H - r * 0.6, W / 2 + r * 2, H + r * 0.4, fill=1, stroke=0)

    # Bottom-right glow (gold)
    for i in range(6, 0, -1):
        alpha = 0.012 * i
        r = (7 - i) * 22
        c.setFillColor(Color(0.79, 0.64, 0.15, alpha=alpha))
        c.ellipse(W - r * 1.2, -r * 0.3, W + r * 0.2, r * 0.9, fill=1, stroke=0)

    c.restoreState()


def draw_header(c: canvas.Canvas, page_label: str, page_num: int, total: int):
    """Draw page header bar."""
    c.saveState()
    bar_h = 14 * mm
    bar_y = H - bar_h

    # Background
    c.setFillColor(Color(0.03, 0.05, 0.12, alpha=0.88))
    c.rect(0, bar_y, W, bar_h, fill=1, stroke=0)

    # Bottom border line (gold)
    c.setStrokeColor(HexColor("#c9a22733"))
    c.setLineWidth(0.5)
    c.line(0, bar_y, W, bar_y)

    # Shield image
    if os.path.exists(SHIELD_IMG):
        c.drawImage(
            SHIELD_IMG,
            8 * mm, bar_y + 2 * mm,
            width=10 * mm, height=10 * mm,
            preserveAspectRatio=True, mask="auto"
        )

    # Brand name
    c.setFillColor(WHITE_70)
    c.setFont("Helvetica-Bold", 9)
    c.drawString(21 * mm, bar_y + 5 * mm, "PannonGuard Komplex")

    # Gold pill tag
    tag_x = 62 * mm
    c.setFillColor(GOLD)
    c.roundRect(tag_x, bar_y + 4.5 * mm, 22 * mm, 5 * mm, 2, fill=1, stroke=0)
    c.setFillColor(NAVY)
    c.setFont("Helvetica-Bold", 6)
    c.drawCentredString(tag_x + 11 * mm, bar_y + 6.3 * mm, "ISO COMPLIANT")

    # Page label (right side)
    c.setFillColor(HexColor("#c9a22788"))
    c.setFont("Helvetica", 7)
    c.drawRightString(W - 8 * mm, bar_y + 5 * mm, f"{page_num} / {total}  ·  {page_label}")

    c.restoreState()


def draw_footer(c: canvas.Canvas):
    """Draw page footer bar."""
    c.saveState()
    bar_h = 8 * mm

    c.setFillColor(Color(0.03, 0.05, 0.12, alpha=0.65))
    c.rect(0, 0, W, bar_h, fill=1, stroke=0)

    c.setStrokeColor(HexColor("#ffffff12"))
    c.setLineWidth(0.4)
    c.line(0, bar_h, W, bar_h)

    c.setFillColor(WHITE_30)
    c.setFont("Helvetica", 6.5)
    c.drawString(8 * mm, 3 * mm, "Bizalmas – Belső használatra")

    c.setFillColor(HexColor("#c9a22766"))
    c.setFont("Helvetica", 6.5)
    c.drawRightString(W - 8 * mm, 3 * mm, "PannonGuard Zrt.  ·  2026")

    c.restoreState()


def gold_line(c: canvas.Canvas, x: float, y: float, width: float, alpha: float = 0.5):
    """Draw a horizontal gold gradient line."""
    c.saveState()
    steps = 30
    seg = width / steps
    for i in range(steps):
        t = i / steps
        a = alpha * (1 - abs(2 * t - 1))
        c.setStrokeColor(Color(0.79, 0.64, 0.15, alpha=a))
        c.setLineWidth(0.6)
        c.line(x + i * seg, y, x + (i + 1) * seg, y)
    c.restoreState()


def draw_rounded_rect(c, x, y, w, h, radius=4, fill_color=None, stroke_color=None, stroke_width=0.5):
    c.saveState()
    if fill_color:
        c.setFillColor(fill_color)
    if stroke_color:
        c.setStrokeColor(stroke_color)
        c.setLineWidth(stroke_width)
    c.roundRect(x, y, w, h, radius, fill=1 if fill_color else 0, stroke=1 if stroke_color else 0)
    c.restoreState()


# ════════════════════════════════════════════════════════════════════════════
#  PAGE 1 – FEDŐLAP
# ════════════════════════════════════════════════════════════════════════════
def draw_page1(c: canvas.Canvas):
    draw_background(c, 1)

    # Decorative rings around logo area
    cx, cy = W / 2, H / 2 + 40 * mm
    for r, alpha in [(35 * mm, 0.08), (55 * mm, 0.055), (78 * mm, 0.035)]:
        c.saveState()
        c.setStrokeColor(Color(0.79, 0.64, 0.15, alpha=alpha))
        c.setLineWidth(0.6)
        c.circle(cx, cy, r, fill=0, stroke=1)
        c.restoreState()

    # Logo / shield image
    shield_size = 38 * mm
    if os.path.exists(SHIELD_IMG):
        # Gold glow behind shield
        for i in range(5, 0, -1):
            a = 0.04 * i
            r = shield_size / 2 + i * 4 * mm
            c.saveState()
            c.setFillColor(Color(0.79, 0.64, 0.15, alpha=a))
            c.circle(cx, cy, r, fill=1, stroke=0)
            c.restoreState()

        c.drawImage(
            SHIELD_IMG,
            cx - shield_size / 2, cy - shield_size / 2,
            width=shield_size, height=shield_size,
            preserveAspectRatio=True, mask="auto"
        )
    else:
        # Fallback circle with star
        c.saveState()
        c.setFillColor(NAVY_LIGHT)
        c.setStrokeColor(GOLD)
        c.setLineWidth(1)
        c.circle(cx, cy, shield_size / 2, fill=1, stroke=1)
        c.setFillColor(GOLD)
        c.setFont("Helvetica-Bold", 24)
        c.drawCentredString(cx, cy - 8, "✦")
        c.restoreState()

    # Gold ring around shield
    c.saveState()
    c.setStrokeColor(HexColor("#c9a22744"))
    c.setLineWidth(0.8)
    c.circle(cx, cy, shield_size / 2 + 3 * mm, fill=0, stroke=1)
    c.restoreState()

    # Eyebrow text
    eyebrow_y = cy - shield_size / 2 - 12 * mm
    c.setFillColor(HexColor("#c9a227bb"))
    c.setFont("Helvetica", 7.5)
    txt = "IGAZGATÓI TANÁCS  ·  2026"
    c.drawCentredString(cx, eyebrow_y, txt)

    # Main title
    title_y = eyebrow_y - 14 * mm
    c.setFillColor(WHITE)
    c.setFont("Helvetica-Bold", 32)
    c.drawCentredString(cx, title_y, "PannonGuard")

    # Gold "Komplex"
    c.setFillColor(GOLD_LIGHT)
    c.setFont("Helvetica-Bold", 32)
    c.drawCentredString(cx, title_y - 13 * mm, "Komplex")

    # Subtitle
    c.setFillColor(WHITE_50)
    c.setFont("Helvetica", 10)
    c.drawCentredString(cx, title_y - 22 * mm, "Intelligens Vállalatirányítási Rendszer")

    # Gold divider
    gold_line(c, cx - 40 * mm, title_y - 27 * mm, 80 * mm, 0.6)

    # Document type label
    doc_y = title_y - 35 * mm
    c.setFillColor(WHITE_70)
    c.setFont("Helvetica-Bold", 10.5)
    c.drawCentredString(cx, doc_y, "Biztonsági, Adatvédelmi & Üzemeltetési Dokumentáció")

    # Badges row
    badge_y = doc_y - 12 * mm
    badges = [
        ("◈  ISO COMPLIANT",     GOLD,        Color(0.79,0.64,0.15,0.18), Color(0.79,0.64,0.15,0.42)),
        ("⬡  AES-256",           BLUE_LIGHT,  Color(0.18,0.30,0.72,0.14), Color(0.18,0.30,0.72,0.38)),
        ("◎  GDPR MEGFELELŐ",    GREEN_LIGHT, Color(0.13,0.77,0.37,0.10), Color(0.13,0.77,0.37,0.32)),
        ("◇  ZERO-TRUST",        GOLD,        Color(0.79,0.64,0.15,0.18), Color(0.79,0.64,0.15,0.42)),
        ("◉  MongoDB + MariaDB", BLUE_LIGHT,  Color(0.18,0.30,0.72,0.14), Color(0.18,0.30,0.72,0.38)),
    ]
    total_w = 185 * mm
    bx = (W - total_w) / 2
    bw = total_w / len(badges) - 2 * mm
    for i, (label, tc, fc, sc) in enumerate(badges):
        bxl = bx + i * (bw + 2 * mm)
        draw_rounded_rect(c, bxl, badge_y - 4 * mm, bw, 7 * mm,
                          radius=3, fill_color=fc, stroke_color=sc, stroke_width=0.5)
        c.setFillColor(tc)
        c.setFont("Helvetica-Bold", 6.5)
        c.drawCentredString(bxl + bw / 2, badge_y - 0.5 * mm, label)

    # Abstract paragraph
    abstract_y = badge_y - 18 * mm
    abstract = (
        "Ez a dokumentum a PannonGuard Komplex vállalatirányítási rendszer biztonsági "
        "infrastruktúráját, adatvédelmi megoldásait, adatbázis-architektúráját, valamint "
        "az üzemeltetési és karbantartási felelősségeket foglalja össze. A rendszer "
        "a Diana Holding és Pannon Guard Zrt. saját szerverein üzemel, teljes körű "
        "titkosítással és ISO-megfelelőséggel."
    )
    # Draw abstract in a box
    abox_w = 140 * mm
    abox_x = (W - abox_w) / 2
    abox_h = 22 * mm
    draw_rounded_rect(c, abox_x, abstract_y - abox_h, abox_w, abox_h,
                      radius=6, fill_color=Color(1,1,1,0.04), stroke_color=Color(1,1,1,0.09))
    # Word-wrap the abstract text
    c.setFillColor(WHITE_50)
    c.setFont("Helvetica", 7.8)
    # Simple wrapping
    words = abstract.split()
    lines_ab = []
    cur = ""
    max_chars = 68
    for w_word in words:
        test = cur + (" " if cur else "") + w_word
        if len(test) > max_chars:
            lines_ab.append(cur)
            cur = w_word
        else:
            cur = test
    if cur:
        lines_ab.append(cur)
    line_h_ab = 4.2 * mm
    total_text_h = len(lines_ab) * line_h_ab
    start_y = abstract_y - abox_h / 2 + total_text_h / 2 - line_h_ab * 0.3
    for li, line in enumerate(lines_ab):
        c.drawCentredString(cx, start_y - li * line_h_ab, line)

    # Meta info cells (3 cols)
    meta_y = abstract_y - abox_h - 8 * mm
    meta_items = [
        ("KIADÁS ÉVE", "2026"),
        ("SZERVER", "Diana Holding\nPannon Guard Zrt."),
        ("ÜZEMELTETŐ", "Balog Sebastian Máté"),
    ]
    cell_w = 52 * mm
    cell_gap = 4 * mm
    total_meta_w = len(meta_items) * cell_w + (len(meta_items) - 1) * cell_gap
    mx = (W - total_meta_w) / 2
    cell_h = 18 * mm
    for i, (label, val) in enumerate(meta_items):
        cxl = mx + i * (cell_w + cell_gap)
        draw_rounded_rect(c, cxl, meta_y - cell_h, cell_w, cell_h,
                          radius=6, fill_color=Color(1,1,1,0.05),
                          stroke_color=Color(1,1,1,0.10), stroke_width=0.5)
        # Label
        c.setFillColor(HexColor("#c9a22788"))
        c.setFont("Helvetica-Bold", 5.8)
        c.drawCentredString(cxl + cell_w / 2, meta_y - 5 * mm, label)
        # Value
        c.setFillColor(WHITE_70)
        c.setFont("Helvetica-Bold", 8.5)
        val_lines = val.split("\n")
        for vi, vl in enumerate(val_lines):
            c.drawCentredString(cxl + cell_w / 2, meta_y - 10 * mm - vi * 4.5 * mm, vl)

    draw_header(c, "Fedőlap", 1, 3)
    draw_footer(c)


# ════════════════════════════════════════════════════════════════════════════
#  PAGE 2 – ISO & SECURITY
# ════════════════════════════════════════════════════════════════════════════
def section_eyebrow(c, x, y, text):
    c.setFillColor(HexColor("#c9a227aa"))
    c.setFont("Helvetica-Bold", 6.5)
    c.drawString(x, y, text)


def section_title(c, x, y, text_plain, text_gold=""):
    c.setFillColor(WHITE)
    c.setFont("Helvetica-Bold", 18)
    w1 = c.stringWidth(text_plain, "Helvetica-Bold", 18)
    c.drawString(x, y, text_plain)
    if text_gold:
        c.setFillColor(GOLD_LIGHT)
        c.drawString(x + w1 + 2, y, text_gold)


def draw_short_gold_line(c, x, y, w=18 * mm):
    c.saveState()
    c.setStrokeColor(GOLD)
    c.setLineWidth(1.2)
    c.line(x, y, x + w, y)
    c.restoreState()


def draw_icon_card(c, x, y, w, h, icon, title, desc, border_color=None):
    """Draw a card with top gold border, icon, title, desc."""
    bc = border_color or Color(0.79, 0.64, 0.15, 0.42)
    draw_rounded_rect(c, x, y, w, h, radius=6,
                      fill_color=Color(1,1,1,0.055),
                      stroke_color=Color(1,1,1,0.13))
    # Top accent bar
    c.saveState()
    c.setFillColor(bc)
    c.roundRect(x, y + h - 1.5, w, 1.5, 3, fill=1, stroke=0)
    c.restoreState()
    # Icon
    c.setFillColor(GOLD)
    c.setFont("Helvetica-Bold", 11)
    c.drawString(x + 4 * mm, y + h - 7 * mm, icon)
    # Title
    c.setFillColor(WHITE)
    c.setFont("Helvetica-Bold", 8)
    c.drawString(x + 4 * mm, y + h - 12 * mm, title)
    # Description — simple word wrap
    c.setFillColor(WHITE_50)
    c.setFont("Helvetica", 7)
    words = desc.split()
    lines = []
    cur = ""
    max_c = int(w / (2.2 * mm))
    for wd in words:
        test = cur + (" " if cur else "") + wd
        if len(test) > max_c:
            lines.append(cur)
            cur = wd
        else:
            cur = test
    if cur:
        lines.append(cur)
    for li, line in enumerate(lines):
        c.drawString(x + 4 * mm, y + h - 17 * mm - li * 3.8 * mm, line)


def draw_num_item(c, x, y, w, num_str, title, desc, h_estimate=22 * mm):
    """Draw a numbered item row."""
    badge_size = 9 * mm
    # Badge box
    draw_rounded_rect(c, x, y - badge_size, badge_size, badge_size,
                      radius=3,
                      fill_color=Color(0.79, 0.64, 0.15, 0.16),
                      stroke_color=Color(0.79, 0.64, 0.15, 0.30))
    c.setFillColor(GOLD_LIGHT)
    c.setFont("Helvetica-Bold", 9)
    c.drawCentredString(x + badge_size / 2, y - badge_size + 2.5 * mm, num_str)

    # Content box
    box_x = x + badge_size + 3 * mm
    box_w = w - badge_size - 3 * mm
    box_h = h_estimate
    draw_rounded_rect(c, box_x, y - box_h, box_w, box_h,
                      radius=5,
                      fill_color=Color(1,1,1,0.04),
                      stroke_color=Color(1,1,1,0.10))
    # Left accent bar (gold)
    c.saveState()
    c.setFillColor(Color(0.79, 0.64, 0.15, 0.40))
    c.roundRect(box_x, y - box_h, 1.5, box_h, 1, fill=1, stroke=0)
    c.restoreState()

    # Title
    c.setFillColor(WHITE)
    c.setFont("Helvetica-Bold", 8)
    c.drawString(box_x + 4 * mm, y - 5 * mm, title)

    # Desc word wrap
    c.setFillColor(WHITE_50)
    c.setFont("Helvetica", 7)
    words = desc.split()
    lines = []
    cur = ""
    max_c = int(box_w / (1.95 * mm))
    for wd in words:
        test = cur + (" " if cur else "") + wd
        if len(test) > max_c:
            lines.append(cur)
            cur = wd
        else:
            cur = test
    if cur:
        lines.append(cur)
    for li, line in enumerate(lines):
        c.drawString(box_x + 4 * mm, y - 10 * mm - li * 3.5 * mm, line)

    return box_h


def draw_highlight_box(c, x, y, w, h, icon, text):
    draw_rounded_rect(c, x, y - h, w, h,
                      radius=7,
                      fill_color=Color(0.79, 0.64, 0.15, 0.10),
                      stroke_color=Color(0.79, 0.64, 0.15, 0.32))
    c.setFillColor(GOLD)
    c.setFont("Helvetica-Bold", 12)
    c.drawString(x + 4 * mm, y - 7 * mm, icon)

    # Wrap text
    c.setFillColor(WHITE_70)
    c.setFont("Helvetica", 7.5)
    words = text.split()
    lines = []
    cur = ""
    max_c = int((w - 12 * mm) / (2.0 * mm))
    for wd in words:
        test = cur + (" " if cur else "") + wd
        if len(test) > max_c:
            lines.append(cur)
            cur = wd
        else:
            cur = test
    if cur:
        lines.append(cur)
    for li, line in enumerate(lines):
        c.drawString(x + 12 * mm, y - 6 * mm - li * 3.8 * mm, line)


def draw_page2(c: canvas.Canvas):
    draw_background(c, 2)

    margin_x = 14 * mm
    content_w = W - 2 * margin_x
    top_y = H - 20 * mm  # below header

    # ── Section A: ISO ──────────────────────────────────────────────────────
    ey = top_y - 4 * mm
    section_eyebrow(c, margin_x, ey, "SZABVÁNYMEGFELELŐSÉG")
    draw_short_gold_line(c, margin_x, ey - 3 * mm)
    section_title(c, margin_x, ey - 10 * mm, "ISO Szabályok & ", "Megfelelőség")

    # 3 icon cards
    card_y_top = ey - 14 * mm
    card_h = 36 * mm
    card_gap = 4 * mm
    card_w = (content_w - 2 * card_gap) / 3

    iso_cards = [
        ("🛡", "ISO 27001",
         "Információbiztonsági irányítási rendszer – adatok és folyamatok teljes körű védelme, kockázatkezelés, hozzáférés-szabályozás.",
         Color(0.79, 0.64, 0.15, 0.50)),
        ("📋", "ISO 9001",
         "Minőségirányítási rendszer – a modulok fejlesztési és üzemeltetési folyamatai auditálható, dokumentált eljárásrend szerint zajlanak.",
         Color(0.79, 0.64, 0.15, 0.50)),
        ("🔒", "GDPR & Adatvédelem",
         "Minden személyes adat kezelése az EU GDPR előírásai alapján történik. Adatminimalizálás, törlési kérelmek, hozzájáruláskezelés beépítve.",
         Color(0.13, 0.77, 0.37, 0.50)),
    ]
    for i, (icon, title, desc, bc) in enumerate(iso_cards):
        cx_ = margin_x + i * (card_w + card_gap)
        draw_icon_card(c, cx_, card_y_top - card_h, card_w, card_h,
                       icon, title, desc, border_color=bc)

    # Gold divider
    gold_line(c, margin_x, card_y_top - card_h - 6 * mm, content_w, 0.45)

    # ── Section B: Titkosítás ───────────────────────────────────────────────
    sec2_y = card_y_top - card_h - 12 * mm
    section_eyebrow(c, margin_x, sec2_y, "ADATVÉDELEM")
    draw_short_gold_line(c, margin_x, sec2_y - 3 * mm)
    section_title(c, margin_x, sec2_y - 10 * mm, "Teljes körű ", "Titkosítás")

    num_items = [
        ("01", "End-to-End titkosítás (AES-256)",
         "Minden adat – nyugalmi állapotban (at rest) és átvitel közben (in transit) is – AES-256 szimmetrikus titkosítással védett. Ez az iparágban alkalmazott legmagasabb szintű védelmi standard."),
        ("02", "TLS 1.3 kommunikáció",
         "A rendszer és az adatbázisok közötti összes kommunikáció TLS 1.3 protokollon zajlik, lehallgatás és man-in-the-middle támadások ellen teljes körűen védve."),
        ("03", "Szerepkör-alapú hozzáférés (RBAC)",
         "Minden modul és adatrekord hozzáférése egyedileg konfigurált jogosultsági szintekhez kötött. Jogosulatlan hozzáférési kísérletek automatikusan naplózásra és riasztásra kerülnek."),
        ("04", "Auditnapló & Verziókövetés",
         "Minden adatmódosítás, hozzáférés és rendszeresemény időbélyeges auditnaplóban kerül rögzítésre – visszakövethetőség és megfelelőség biztosítása céljából."),
    ]

    item_y = sec2_y - 14 * mm
    item_h = 17 * mm
    item_gap = 3 * mm
    for num, title, desc in num_items:
        draw_num_item(c, margin_x, item_y, content_w, num, title, desc, h_estimate=item_h)
        item_y -= (item_h + item_gap)

    # Highlight box
    hl_h = 16 * mm
    draw_highlight_box(c, margin_x, item_y - 3 * mm, content_w, hl_h,
                       "◈",
                       "Zero-Trust biztonsági modell: A rendszer a \"soha ne bízz, mindig ellenőrizz\" elvén alapul. "
                       "Minden kérés – belső hálózatról is – hitelesítésen és jogosultság-ellenőrzésen megy keresztül. "
                       "Nincs alapértelmezett megbízhatóság egyetlen felhasználó vagy eszköz számára sem.")

    draw_header(c, "Biztonság & Megfelelőség", 2, 3)
    draw_footer(c)


# ════════════════════════════════════════════════════════════════════════════
#  PAGE 3 – DATABASE & OPERATOR
# ════════════════════════════════════════════════════════════════════════════
def draw_db_box(c, x, y, w, h, icon, name, db_type, desc, fill_color, stroke_color):
    draw_rounded_rect(c, x, y - h, w, h, radius=7, fill_color=fill_color, stroke_color=stroke_color)
    # Icon
    c.setFillColor(WHITE_70)
    c.setFont("Helvetica-Bold", 14)
    c.drawCentredString(x + w / 2, y - 9 * mm, icon)
    # Name
    c.setFillColor(WHITE)
    c.setFont("Helvetica-Bold", 10)
    c.drawCentredString(x + w / 2, y - 14 * mm, name)
    # Type
    c.setFillColor(WHITE_50)
    c.setFont("Helvetica", 6.5)
    c.drawCentredString(x + w / 2, y - 17.5 * mm, db_type)
    # Desc
    c.setFillColor(WHITE_50)
    c.setFont("Helvetica", 6.8)
    words = desc.split()
    lines = []
    cur = ""
    max_c = int(w / (1.9 * mm))
    for wd in words:
        test = cur + (" " if cur else "") + wd
        if len(test) > max_c:
            lines.append(cur)
            cur = wd
        else:
            cur = test
    if cur:
        lines.append(cur)
    for li, line in enumerate(lines):
        c.drawCentredString(x + w / 2, y - 22 * mm - li * 3.5 * mm, line)


def draw_chip(c, x, y, label, text_color, fill_color, stroke_color):
    c.setFont("Helvetica-Bold", 6)
    tw = c.stringWidth(label, "Helvetica-Bold", 6)
    chip_w = tw + 8 * mm
    chip_h = 5.5 * mm
    draw_rounded_rect(c, x, y - chip_h, chip_w, chip_h,
                      radius=chip_h / 2,
                      fill_color=fill_color,
                      stroke_color=stroke_color,
                      stroke_width=0.4)
    c.setFillColor(text_color)
    c.drawString(x + 4 * mm, y - 3.8 * mm, label)
    return chip_w


def draw_page3(c: canvas.Canvas):
    draw_background(c, 3)

    margin_x = 14 * mm
    content_w = W - 2 * margin_x
    top_y = H - 20 * mm

    # ── Section A: Adatbázis ────────────────────────────────────────────────
    ey = top_y - 4 * mm
    section_eyebrow(c, margin_x, ey, "ADATTÁROLÁS")
    draw_short_gold_line(c, margin_x, ey - 3 * mm)
    section_title(c, margin_x, ey - 10 * mm, "Adatbázis ", "Architektúra")

    # DB boxes + connector
    db_h = 52 * mm
    db_w = (content_w - 18 * mm) / 2
    db_y_top = ey - 14 * mm

    # MongoDB
    draw_db_box(c, margin_x, db_y_top, db_w, db_h,
                "🍃", "MongoDB",
                "NoSQL  ·  Dokumentum-alapú",
                "Strukturálatlan és szemidokumentum adatok – modulkonfigurációk, MI-interakciók, "
                "napló-rekordok, riportok, rugalmas sémakezeléssel.",
                Color(0.13, 0.77, 0.37, 0.07),
                Color(0.13, 0.77, 0.37, 0.30))

    # Connector symbol
    conn_x = margin_x + db_w + 2 * mm
    conn_center_y = db_y_top - db_h / 2
    c.setFillColor(GOLD)
    c.setFont("Helvetica-Bold", 14)
    c.drawCentredString(conn_x + 7 * mm, conn_center_y, "+")
    c.setStrokeColor(Color(0.79, 0.64, 0.15, 0.35))
    c.setLineWidth(0.5)
    c.line(conn_x + 7 * mm, conn_center_y + 8, conn_x + 7 * mm, db_y_top - 5)
    c.line(conn_x + 7 * mm, conn_center_y - 8, conn_x + 7 * mm, db_y_top - db_h + 5)

    # MariaDB
    draw_db_box(c, margin_x + db_w + 16 * mm, db_y_top, db_w, db_h,
                "🐬", "MariaDB",
                "Relációs SQL  ·  ACID-kompatibilis",
                "Strukturált tranzakcionális adatok – pénzügyi kimutatások, jogosultságok, "
                "HR-rekordok, szerződések, közbeszerzési adatok.",
                Color(0.38, 0.65, 0.98, 0.07),
                Color(0.38, 0.65, 0.98, 0.30))

    # Encryption chips row
    chip_y = db_y_top - db_h - 5 * mm
    c.setFillColor(WHITE_30)
    c.setFont("Helvetica-Bold", 6)
    c.drawString(margin_x, chip_y, "ADATBÁZIS-SZINTŰ VÉDELEM:")

    chips = [
        ("🔑 AES-256 at rest",    GOLD,        Color(0.79,0.64,0.15,0.12), Color(0.79,0.64,0.15,0.35)),
        ("🔐 TLS 1.3 in transit", BLUE_LIGHT,  Color(0.18,0.30,0.72,0.12), Color(0.18,0.30,0.72,0.35)),
        ("✓ Napi backup",         GREEN_LIGHT, Color(0.13,0.77,0.37,0.08), Color(0.13,0.77,0.37,0.28)),
        ("🛡 IP whitelisting",    GOLD,        Color(0.79,0.64,0.15,0.12), Color(0.79,0.64,0.15,0.35)),
        ("✓ Point-in-time",       GREEN_LIGHT, Color(0.13,0.77,0.37,0.08), Color(0.13,0.77,0.37,0.28)),
        ("⚡ Failover",           BLUE_LIGHT,  Color(0.18,0.30,0.72,0.12), Color(0.18,0.30,0.72,0.35)),
    ]
    cx_ = margin_x
    chip_row_y = chip_y - 5 * mm
    for label, tc, fc, sc in chips:
        cw = draw_chip(c, cx_, chip_row_y, label, tc, fc, sc)
        cx_ += cw + 2.5 * mm

    # Gold divider
    gold_line(c, margin_x, chip_row_y - 8 * mm, content_w, 0.40)

    # ── Section B: Szerver ──────────────────────────────────────────────────
    srv_y = chip_row_y - 13 * mm
    section_eyebrow(c, margin_x, srv_y, "SZERVER INFRASTRUKTÚRA")
    draw_short_gold_line(c, margin_x, srv_y - 3 * mm)

    server_box_h = 22 * mm
    draw_rounded_rect(c, margin_x, srv_y - 7 * mm - server_box_h, content_w, server_box_h,
                      radius=8,
                      fill_color=Color(0.18, 0.30, 0.72, 0.10),
                      stroke_color=Color(0.18, 0.30, 0.72, 0.28))
    c.setFillColor(WHITE)
    c.setFont("Helvetica-Bold", 11)
    c.drawString(margin_x + 3.5 * mm, srv_y - 13 * mm, "🏢")
    c.setFillColor(BLUE_LIGHT)
    c.setFont("Helvetica-Bold", 8.5)
    c.drawString(margin_x + 10 * mm, srv_y - 11.5 * mm,
                 "Diana Holding – Pannon Guard Zrt. Dedikált Szerver")
    c.setFillColor(WHITE_50)
    c.setFont("Helvetica", 7.5)
    srv_text = (
        "A PannonGuard Komplex kizárólag a Diana Holding csoporthoz tartozó Pannon Guard Zrt. saját, dedikált fizikai szerverein "
        "üzemel. Nincs külső felhőszolgáltatóra való adatátvitel – minden adat a vállalat infrastruktúrájában marad, "
        "teljes körű fizikai és logikai szeparációval, tűzfalvédelemmel és behatolás-érzékelő rendszerrel (IDS/IPS) ellátva."
    )
    words = srv_text.split()
    lines = []
    cur = ""
    max_c = int((content_w - 8 * mm) / (1.95 * mm))
    for wd in words:
        test = cur + (" " if cur else "") + wd
        if len(test) > max_c:
            lines.append(cur)
            cur = wd
        else:
            cur = test
    if cur:
        lines.append(cur)
    for li, line in enumerate(lines):
        c.drawString(margin_x + 10 * mm, srv_y - 16 * mm - li * 3.6 * mm, line)

    # ── Section C: Üzemeltetés ──────────────────────────────────────────────
    op_section_y = srv_y - 7 * mm - server_box_h - 8 * mm
    section_eyebrow(c, margin_x, op_section_y, "ÜZEMELTETÉS & KARBANTARTÁS")
    draw_short_gold_line(c, margin_x, op_section_y - 3 * mm)
    section_title(c, margin_x, op_section_y - 10 * mm, "Üzemeltetői ", "Felelősség")

    # Operator card
    op_card_y = op_section_y - 14 * mm
    op_card_h = 30 * mm

    # Gradient background simulation
    draw_rounded_rect(c, margin_x, op_card_y - op_card_h, content_w, op_card_h,
                      radius=10,
                      fill_color=Color(0.18, 0.30, 0.72, 0.14),
                      stroke_color=Color(0.18, 0.30, 0.72, 0.35))

    # Left accent
    c.saveState()
    c.setFillColor(Color(0.18, 0.30, 0.72, 0.50))
    c.roundRect(margin_x, op_card_y - op_card_h, 1.5, op_card_h, 1, fill=1, stroke=0)
    c.restoreState()

    # Avatar circle
    av_cx = margin_x + 14 * mm
    av_cy = op_card_y - op_card_h / 2
    c.saveState()
    c.setFillColor(Color(0.18, 0.30, 0.72, 0.25))
    c.setStrokeColor(Color(0.79, 0.64, 0.15, 0.40))
    c.setLineWidth(0.8)
    c.circle(av_cx, av_cy, 10 * mm, fill=1, stroke=1)
    c.setFillColor(GOLD_LIGHT)
    c.setFont("Helvetica-Bold", 14)
    c.drawCentredString(av_cx, av_cy - 2.5, "✦")
    c.restoreState()

    # Name
    txt_x = margin_x + 27 * mm
    c.setFillColor(WHITE)
    c.setFont("Helvetica-Bold", 12)
    c.drawString(txt_x, op_card_y - 6 * mm, "Balog Sebastian Máté")

    # Role badge
    role_text = "RENDSZERÜZEMELTETŐ & KARBANTARTÓ  ·  PANNONGUAR ZRT."
    draw_rounded_rect(c, txt_x, op_card_y - 13 * mm, 115 * mm, 5.5 * mm,
                      radius=3,
                      fill_color=Color(0.79, 0.64, 0.15, 0.16),
                      stroke_color=Color(0.79, 0.64, 0.15, 0.35))
    c.setFillColor(GOLD)
    c.setFont("Helvetica-Bold", 5.8)
    c.drawString(txt_x + 2.5 * mm, op_card_y - 10.5 * mm, role_text)

    # Desc
    c.setFillColor(WHITE_50)
    c.setFont("Helvetica", 7)
    op_desc = (
        "A PannonGuard Komplex rendszer elsődleges üzemeltetési és karbantartási felelőse Balog Sebastian Máté, "
        "a PannonGuard Zrt. munkatársa. Felelősségi köre kiterjed a szerver- és adatbázis-felügyeletre, "
        "a biztonsági frissítésekre, a hozzáférés-kezelésre, az incidensek elhárítására, "
        "valamint az ISO-megfelelőségi auditokra."
    )
    words = op_desc.split()
    lines = []
    cur = ""
    max_c = int((content_w - 29 * mm) / (1.92 * mm))
    for wd in words:
        test = cur + (" " if cur else "") + wd
        if len(test) > max_c:
            lines.append(cur)
            cur = wd
        else:
            cur = test
    if cur:
        lines.append(cur)
    for li, line in enumerate(lines):
        c.drawString(txt_x, op_card_y - 16 * mm - li * 3.5 * mm, line)

    # Continuity box
    cont_y = op_card_y - op_card_h - 5 * mm
    cont_h = 20 * mm
    draw_rounded_rect(c, margin_x, cont_y - cont_h, content_w, cont_h,
                      radius=7,
                      fill_color=Color(0.13, 0.77, 0.37, 0.07),
                      stroke_color=Color(0.13, 0.77, 0.37, 0.22))
    c.setFillColor(GREEN_LIGHT)
    c.setFont("Helvetica-Bold", 9)
    c.drawString(margin_x + 3.5 * mm, cont_y - 8 * mm, "♻")
    c.setFont("Helvetica-Bold", 7.5)
    c.drawString(margin_x + 10 * mm, cont_y - 6.5 * mm, "Üzemeltetői folytonosság garantált")
    c.setFillColor(WHITE_50)
    c.setFont("Helvetica", 7.2)
    cont_text = (
        "A rendszer teljes körű technikai dokumentációval, üzemeltetési kézikönyvvel és verziókövetett kódbázissal rendelkezik. "
        "Amennyiben Balog Sebastian Máté elhagyja a szervezetet, a rendszer a dokumentáció és strukturált átadás-átvételi "
        "folyamat révén zökkenőmentesen karban tartható és tovább üzemeltethető egy kijelölt utód vagy külső szakember által is."
    )
    words = cont_text.split()
    lines = []
    cur = ""
    max_c = int((content_w - 10 * mm) / (1.92 * mm))
    for wd in words:
        test = cur + (" " if cur else "") + wd
        if len(test) > max_c:
            lines.append(cur)
            cur = wd
        else:
            cur = test
    if cur:
        lines.append(cur)
    for li, line in enumerate(lines):
        c.drawString(margin_x + 10 * mm, cont_y - 11 * mm - li * 3.5 * mm, line)

    draw_header(c, "Adatbázis & Üzemeltetés", 3, 3)
    draw_footer(c)


# ════════════════════════════════════════════════════════════════════════════
#  MAIN
# ════════════════════════════════════════════════════════════════════════════
def main():
    print(f"[PannonGuard PDF] Generálás indítása…")
    print(f"  Output: {OUTPUT}")

    c = canvas.Canvas(OUTPUT, pagesize=A4)
    c.setTitle("PannonGuard Komplex – Biztonsági & Üzemeltetési Dokumentáció")
    c.setAuthor("Balog Sebastian Máté · PannonGuard Zrt.")
    c.setSubject("Biztonsági, adatvédelmi és üzemeltetési dokumentáció")
    c.setKeywords("PannonGuard, ISO, MongoDB, MariaDB, biztonság, titkosítás, Diana Holding")

    # Page 1
    draw_page1(c)
    c.showPage()

    # Page 2
    draw_page2(c)
    c.showPage()

    # Page 3
    draw_page3(c)
    c.showPage()

    c.save()
    print(f"[PannonGuard PDF] ✓ Kész! → {OUTPUT}")


if __name__ == "__main__":
    main()
