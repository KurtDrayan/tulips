from pathlib import Path
import html, json
p = Path(__file__).parent
m = json.loads((p / 'messages.json').read_text(encoding='utf-8-sig'))
letter = ''.join('<p>' + html.escape(paragraph) + '</p>' for paragraph in m['letter'].split('\n\n'))
page = '''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#f9e8ed"><title>For Miss Nurse</title><link rel="stylesheet" href="style.css"></head><body><button class="letter-button" id="open-letter" aria-label="Open letter" title="Open letter"><svg viewBox="0 0 32 32" aria-hidden="true"><rect x="3" y="7" width="26" height="19" rx="3"/><path d="m4 9 12 9L28 9"/><path d="M14 19c-3-3 1-5 2-2 1-3 5-1 2 2l-2 2z"/></svg></button><main><img class="bouquet" src="turtle-bouquet.svg" alt="A bouquet of pink and yellow tulips being drawn, then drawn again"></main><dialog id="letter" aria-label="Letter for Miss Nurse"><button id="close-letter" aria-label="Close letter">×</button><div class="letter-content">LETTER<p class="signature">With love ♡</p></div></dialog><script src="script.js"></script></body></html>'''.replace('LETTER',letter)
(p / 'index.html').write_text(page,encoding='utf-8')
