# -*- coding: utf-8 -*-
"""
Fabrique une infographie de tableau dans le style des visuels d'article du site.

Les images d'illustration de concierge-ai.fr ne sont pas des photos : ce sont
des tableaux dessinés, fond bleu très pâle, titre en Archivo, valeurs en Inter,
une cellule mise en avant en vert, et la signature en bas à gauche. Ce script
reproduit cette maquette, mesurée sur les visuels existants.

    python3 outils/infographie.py fiche.json

La fiche :
    { "sortie": "public/images/mon-visuel",
      "titre": ["Première ligne", "Deuxième ligne"],
      "colonnes": ["", "Colonne A", "Colonne B"],
      "lignes": [["Libellé", "valeur A", "valeur B"], ...],
      "surligne": [2, 2] }        # [ligne, colonne], repères à partir de 0
"""

import json
import sys
import urllib.request
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

RACINE = Path(__file__).resolve().parent.parent
POLICES = RACINE / '.polices'

# Maquette relevée sur public/images/…embaucher-ou-automatiser….png
LARGEUR, HAUTEUR = 1499, 1049
MARGE = 273
HAUT_TITRE = 172
HAUT_TABLEAU = 347
BAS_SIGNATURE = 880

FOND = (243, 247, 252)
BLANC = (255, 255, 255)
ENCRE = (10, 37, 64)
GRIS = (71, 92, 114)
MUET = (124, 141, 161)
TRAIT = (228, 235, 242)
VERT = (21, 128, 61)
TEINTE = (229, 233, 238)   # fond de la colonne des libellés

# Les polices du site, prises chez Google Fonts et gardées hors dépôt.
SOURCES = {
    'Archivo-800.ttf': 'https://fonts.gstatic.com/s/archivo/v25/k3k6o8UDI-1M0wlSV9XAw6lQkqWY8Q82sJaRE-NWIDdgffTTtDRp8A.ttf',
    'Inter-400.ttf': 'https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfMZg.ttf',
    'Inter-600.ttf': 'https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuGKYMZg.ttf',
    'Inter-700.ttf': 'https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuFuYMZg.ttf',
}


def police(nom, taille):
    POLICES.mkdir(exist_ok=True)
    chemin = POLICES / nom
    if not chemin.exists():
        requete = urllib.request.Request(SOURCES[nom], headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(requete, timeout=30) as r:
            chemin.write_bytes(r.read())
    return ImageFont.truetype(str(chemin), taille)


def largeur_texte(d, texte, f):
    return d.textbbox((0, 0), texte, font=f)[2]


def couper(d, texte, f, large):
    """Coupe un libellé trop long en deux lignes, comme sur les visuels d'origine."""
    if largeur_texte(d, texte, f) <= large:
        return [texte]
    mots, lignes, courante = texte.split(), [], ''
    for m in mots:
        essai = (courante + ' ' + m).strip()
        if largeur_texte(d, essai, f) <= large or not courante:
            courante = essai
        else:
            lignes.append(courante)
            courante = m
    lignes.append(courante)
    return lignes[:2]


def dessiner(fiche):
    im = Image.new('RGB', (LARGEUR, HAUTEUR), FOND)
    d = ImageDraw.Draw(im)

    titre = police('Archivo-800.ttf', 58)
    entete = police('Inter-700.ttf', 25)
    libelle = police('Inter-400.ttf', 25)
    valeur = police('Inter-600.ttf', 25)
    forte = police('Inter-700.ttf', 29)
    signature = police('Inter-400.ttf', 24)

    y = HAUT_TITRE
    for ligne in fiche['titre']:
        d.text((MARGE, y), ligne, font=titre, fill=ENCRE)
        y += 71

    colonnes, lignes = fiche['colonnes'], fiche['lignes']
    surligne = tuple(fiche.get('surligne') or (-1, -1))
    large = LARGEUR - 2 * MARGE

    part_libelle = 0.40 if len(colonnes) == 3 else 0.34
    l_libelle = int(large * part_libelle)
    l_valeur = (large - l_libelle) // (len(colonnes) - 1)

    # le tableau tient toujours entre son haut et la signature
    rangs = len(lignes) + 1
    hauteur_ligne = min(95, (BAS_SIGNATURE - 40 - HAUT_TABLEAU) // rangs)
    haut = HAUT_TABLEAU
    bas = haut + hauteur_ligne * rangs

    d.rounded_rectangle([MARGE, haut, MARGE + large, bas], radius=18, fill=BLANC, outline=TRAIT, width=2)
    # la colonne des libellés est légèrement teintée, comme sur les visuels d'origine
    d.rounded_rectangle([MARGE, haut, MARGE + int(large * part_libelle), bas], radius=18, fill=TEINTE)
    d.rectangle([MARGE + int(large * part_libelle) - 18, haut, MARGE + int(large * part_libelle), bas], fill=TEINTE)
    d.rounded_rectangle([MARGE, haut, MARGE + large, bas], radius=18, outline=TRAIT, width=2)

    x_col = [MARGE] + [MARGE + l_libelle + i * l_valeur for i in range(len(colonnes) - 1)]
    l_col = [l_libelle] + [l_valeur] * (len(colonnes) - 1)

    # séparateurs verticaux entre colonnes
    for x in x_col[1:]:
        d.line([x, haut + 2, x, bas - 2], fill=TRAIT, width=2)
    # trait sous l'en-tête, sur toute la largeur
    d.line([MARGE + 2, haut + hauteur_ligne, MARGE + large - 2, haut + hauteur_ligne], fill=TRAIT, width=2)

    def poser(texte, f, couleur, i, y_centre, gras=False):
        lg = couper(d, texte, f, l_col[i] - 56)
        h = len(lg) * (34 if len(lg) > 1 else 30)
        yy = y_centre - h / 2
        for t in lg:
            tx = x_col[i] + 28 if i == 0 else x_col[i] + l_col[i] - 28 - largeur_texte(d, t, f)
            d.text((tx, yy), t, font=f, fill=couleur)
            yy += 34

    for i, t in enumerate(colonnes):
        if t:
            poser(t, entete, ENCRE, i, haut + hauteur_ligne / 2)

    for r, rang in enumerate(lignes):
        yl = haut + hauteur_ligne * (r + 1)
        if r:
            d.line([MARGE + 2, yl, MARGE + large - 2, yl], fill=TRAIT, width=2)
        for i, texte in enumerate(rang):
            vedette = (r, i) == surligne
            if vedette:
                d.rectangle([x_col[i] + 2, yl + 2, x_col[i] + l_col[i] - 2, yl + hauteur_ligne - 2], fill=VERT)
            f = forte if vedette else (libelle if i == 0 else valeur)
            poser(texte, f, BLANC if vedette else (GRIS if i == 0 else ENCRE), i, yl + hauteur_ligne / 2)

    d.text((MARGE, BAS_SIGNATURE), 'concierge-ai.fr', font=signature, fill=MUET)

    sortie = RACINE / fiche['sortie']
    sortie.parent.mkdir(parents=True, exist_ok=True)
    im.save(sortie.with_suffix('.png'))
    im.resize((760, 475), Image.LANCZOS).save(sortie.parent / (sortie.name + '-vignette.webp'), quality=88)
    im.crop((0, 110, LARGEUR, 110 + int(LARGEUR / 1.905))).resize((1200, 630), Image.LANCZOS) \
      .save(sortie.parent / (sortie.name + '-og.jpg'), quality=86)
    return sortie


if __name__ == '__main__':
    fiche = json.loads(Path(sys.argv[1]).read_text(encoding='utf-8'))
    s = dessiner(fiche)
    for f in (s.with_suffix('.png'), s.parent / (s.name + '-vignette.webp'), s.parent / (s.name + '-og.jpg')):
        print(f'{f.relative_to(RACINE)}  {f.stat().st_size // 1024} Ko')
