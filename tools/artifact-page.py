"""Turn index.html into the page body that the claude.ai Artifact expects.

The Artifact host adds its own <!doctype>, <html>, <head> and <body>, so the
published page keeps only what is inside them. Everything else (css/, js/,
assets/, quiz.html) is published unchanged next to it.

Usage: python3 tools/artifact-page.py index.html OUT.html
"""
import re
import sys

src = open(sys.argv[1], encoding="utf-8").read()
head = re.search(r"<head>(.*?)</head>", src, re.S).group(1)
head = re.sub(r'<meta (charset|name="viewport")[^>]*>\n?', "", head)
body = re.search(r"<body>(.*?)</body>", src, re.S).group(1)
open(sys.argv[2], "w", encoding="utf-8").write(head.strip() + "\n" + body.strip() + "\n")
