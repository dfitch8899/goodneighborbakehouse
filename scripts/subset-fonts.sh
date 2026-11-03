#!/usr/bin/env bash
# Subsets the variable fonts in raw/fonts to Basic Latin + Latin-1 + common punctuation.
# Requires: pip install fonttools brotli
set -euo pipefail
cd "$(dirname "$0")/.."
U="U+0020-007E,U+00A0-00FF,U+0131,U+0152-0153,U+02C6,U+02DA,U+02DC,U+2013-2014,U+2018-201A,U+201C-201E,U+2022,U+2026,U+2032-2033,U+20AC,U+2122,U+200B"
for f in fraunces fraunces-italic dm-sans; do
  pyftsubset "raw/fonts/$f.woff2" --unicodes="$U" --layout-features='kern,liga,calt,lnum,tnum,onum,pnum' --flavor=woff2 --output-file="src/assets/fonts/$f.woff2"
done
ls -la src/assets/fonts
