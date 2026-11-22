"""Draw the garden with Python turtle and export its canvas as a static SVG.
Run on a computer with Python and Tkinter installed: python draw_garden.py
"""
import turtle
import random
from pathlib import Path
from xml.sax.saxutils import escape

random.seed(13)
screen = turtle.Screen()
screen.setup(900, 800)
screen.setworldcoordinates(-450, -400, 450, 400)
screen.tracer(0, 0)
t = turtle.Turtle(visible=False)
t.speed(0)
t.pensize(3)

def move(x, y):
    t.penup(); t.goto(x, y); t.pendown()

def flower(x, y, scale, color):
    # Each flower is drawn with turtle's own lines, fills and circular arcs.
    t.pencolor('#648563'); t.pensize(4 * scale)
    move(x, -390); t.setheading(90); t.goto(x, y-8)
    t.fillcolor('#8ba678'); t.begin_fill(); t.setheading(145)
    t.circle(100*scale, 48); t.setheading(305); t.circle(-100*scale, 48); t.end_fill()
    move(x, y); t.pencolor('#bd7781'); t.pensize(1.5); t.fillcolor(color)
    t.begin_fill(); t.setheading(145); t.circle(60*scale, 70)
    t.setheading(280); t.circle(65*scale, 44)
    t.setheading(80); t.circle(-65*scale, 44)
    t.setheading(215); t.circle(60*scale, 70); t.goto(x,y); t.end_fill()
    t.pencolor('#fff1cf'); t.pensize(2); move(x,y+5*scale); t.setheading(85); t.circle(115*scale, 24)
    move(x,y+5*scale); t.setheading(95); t.circle(-115*scale,24)

# Overlapping flowers, arranged like a little hand-drawn meadow.
for row in range(3):
    for i in range(11):
        x=-470+i*93+random.randint(-18,18)+(row%2)*40
        y=-130-row*105+random.randint(-20,25)
        flower(x,y,random.uniform(.65,1.05),random.choice(['#f3a0b3','#f5bdc8','#f2cd65','#f7dc85','#e991a8']))
screen.update()
canvas=screen.getcanvas()
# Turtle's canvas uses screen coordinates; export the vector shapes for the web.
parts=['<svg xmlns="http://www.w3.org/2000/svg" viewBox="-450 -400 900 800" role="img" aria-label="A hand-drawn garden of pink and yellow tulips">']
parts.append('<style>polyline{stroke-dasharray:1;stroke-dashoffset:1;animation:draw 5s ease forwards}polygon{opacity:0;animation:bloom 1.4s ease 2s forwards}@keyframes draw{to{stroke-dashoffset:0}}@keyframes bloom{to{opacity:1}}@media (prefers-reduced-motion:reduce){polyline{animation:none;stroke-dashoffset:0}polygon{animation:none;opacity:1}}</style>')
for item in canvas.find_all():
    kind=canvas.type(item); coords=canvas.coords(item)
    if kind not in ('line','polygon') or not coords: continue
    points=' '.join(f'{coords[i]:.2f},{coords[i+1]:.2f}' for i in range(0,len(coords),2))
    fill=canvas.itemcget(item,'fill') or 'none'
    if kind=='line':
        width=canvas.itemcget(item,'width') or '1'
        parts.append(f'<polyline pathLength="1" points="{points}" fill="none" stroke="{escape(fill)}" stroke-width="{width}" stroke-linecap="round" stroke-linejoin="round"/>')
    else:
        outline=canvas.itemcget(item,'outline') or 'none'
        width=canvas.itemcget(item,'width') or '1'
        parts.append(f'<polygon points="{points}" fill="{escape(fill)}" stroke="{escape(outline)}" stroke-width="{width}" stroke-linejoin="round"/>')
parts.append('</svg>')
Path(__file__).with_name('turtle-garden.svg').write_text('\n'.join(parts),encoding='utf-8')
screen.bye()
