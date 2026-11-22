# For Miss Nurse

A looping tulip bouquet and a letter for GitHub Pages. The artwork is drawn with Python's `turtle` library; the drawing's canvas strokes are exported to SVG and replayed in the browser. Visitors do not need Python. Reduced-motion settings display the finished bouquet.

To change the letter, edit the `letter` value in `messages.json`, run `python generate.py`, then commit and push `messages.json` and `index.html`. Use `\n\n` between paragraphs.

To redraw the bouquet, run `python draw_garden.py` on a computer with Python, Tkinter, and a graphical desktop, then commit and push `turtle-bouquet.svg`. GitHub Pages deploys the files from `main` and `/(root)`.
