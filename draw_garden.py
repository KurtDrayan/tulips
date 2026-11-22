"""Draw the bouquet using Python Turtle and export its actual canvas strokes.
Requires Python with Tkinter and a graphical desktop. Run: python draw_garden.py
"""
import turtle
from pathlib import Path
from xml.sax.saxutils import escape

screen = turtle.Screen()
screen.setup(720, 850)
screen.setworldcoordinates(-360,-425,360,425)
screen.tracer(0, 0)
t = turtle.Turtle(visible=False)
t.speed(0)

def move(x,y):
    t.penup(); t.goto(x,y); t.pendown()

def bezier(start, c1, c2, end, steps=18):
    for i in range(1,steps+1):
        u=i/steps; v=1-u
        t.goto(v**3*start[0]+3*v*v*u*c1[0]+3*v*u*u*c2[0]+u**3*end[0],v**3*start[1]+3*v*v*u*c1[1]+3*v*u*u*c2[1]+u**3*end[1])

def shape(start, curves, fill, outline='#8a6670', width=2):
    t.pensize(width); t.pencolor(outline); t.fillcolor(fill); move(*start); t.begin_fill()
    point=start
    for c1,c2,end in curves:
        bezier(point,c1,c2,end); point=end
    t.goto(*start); t.end_fill()

def bloom(x,y,s,color):
    def pt(a,b): return (x+a*s,y+b*s)
    def sh(start, curves, fill, outline='#b46f7e'):
        shape(pt(*start),[(pt(*a),pt(*b),pt(*c)) for a,b,c in curves],fill,outline,1.7)
    light,mid,dark = color
    # Back petals, then two cupped overlapping petals with visible pen outlines.
    sh((0,-45),[((-48,-37),(-58,16),(-38,58)),((-20,47),(-8,36),(0,15)),((8,36),(20,47),(38,58)),((58,16),(48,-37),(0,-45))],dark)
    sh((0,-45),[((-46,-39),(-53,10),(-36,53)),((-15,42),(-4,15),(0,-45))],light)
    sh((0,-45),[((46,-39),(53,10),(36,53)),((15,42),(4,15),(0,-45))],mid)
    sh((0,-45),[((-22,-35),(-22,7),(-10,30)),((-6,23),(-2,12),(0,2)),((2,12),(6,23),(10,30)),((22,7),(22,-35),(0,-45))],light)
    t.pencolor('#fce8d6'); t.pensize(1.5)
    move(x-19*s,y-20*s); bezier((x-19*s,y-20*s),(x-29*s,y-2*s),(x-29*s,y+19*s),(x-28*s,y+26*s))

pink=('#ffd0d9','#f1a3b8','#d77b99')
yellow=('#fff0aa','#f5ce70','#dfa84c')
flowers=[(-217,120,.88,pink),(-152,205,1.0,yellow),(-75,250,1.05,pink),(0,275,1.15,yellow),(75,250,1.05,pink),(152,205,1.0,yellow),(217,120,.88,pink),(-185,45,.95,yellow),(-112,105,1.02,pink),(-55,70,.95,yellow),(0,145,1.08,pink),(55,70,.95,pink),(112,105,1.02,yellow),(185,45,.95,pink)]
# Draw each stem and foliage before drawing the flower heads.
for x,y,s,c in flowers:
    t.pencolor('#678660'); t.pensize(4); move(0,-335)
    bezier((0,-335),(x*.2,-190),(x*.85,-35),(x,y-42*s))
for side in (-1,1):
    for offset in (0,65,130):
        x=side*(60+offset*.7); y=-235+offset
        shape((0,-330),[((side*32,-210),(x,y),(x+side*54,y+88)),((x+side*10,y+50),(side*15,-140),(0,-330))], '#9fb98e', '#78966f', 1.5)
for x,y,s,c in flowers:
    bloom(x,y,s,c)
# A simple bow, still drawn by turtle.
shape((-7,-265),[((-48,-220),(-80,-237),(-65,-263)),((-50,-282),(-22,-275),(-7,-265))], '#e7a5b5','#bb7c8b')
shape((7,-265),[((48,-220),(80,-237),(65,-263)),((50,-282),(22,-275),(7,-265))], '#e7a5b5','#bb7c8b')
shape((-10,-258),[((-16,-275),(-5,-282),(8,-275)),((18,-270),(14,-256),(-10,-258))], '#cc8398','#bb7c8b')
screen.update()
canvas=screen.getcanvas()
items=[]
for item in canvas.find_all():
    kind=canvas.type(item); coords=canvas.coords(item)
    if kind not in ('line','polygon') or len(coords)<4: continue
    fill=canvas.itemcget(item,'fill') or 'none'
    if fill=='none': continue
    points=' '.join(f'{coords[i]:.1f},{coords[i+1]:.1f}' for i in range(0,len(coords),2))
    if kind=='line':
        width=canvas.itemcget(item,'width') or '1'
        items.append(f'<polyline points="{points}" pathLength="1" fill="none" stroke="{escape(fill)}" stroke-width="{width}" stroke-linecap="round" stroke-linejoin="round"/>')
    else:
        items.append(f'<polygon points="{points}" fill="{escape(fill)}"/>')
# A single looping timeline reproduces the actual Turtle canvas order.
svg=['<svg xmlns="http://www.w3.org/2000/svg" viewBox="-360 -425 720 850" role="img" aria-label="A bouquet of pink and yellow tulips being drawn">']
svg.append('<style>polyline{stroke-dasharray:1;stroke-dashoffset:1}polygon{opacity:0}@media(prefers-reduced-motion:reduce){polyline{stroke-dashoffset:0!important;animation:none!important}polygon{opacity:1!important;animation:none!important}}</style>')
count=len(items)
for i,item in enumerate(items):
    start=round(1+i/count*40,3); end=round(min(start+3,44),3)
    name=f'p{i}'
    if item.startswith('<polyline'):
        svg.append(f'<style>@keyframes {name}{{0%,{start}%{{stroke-dashoffset:1;opacity:0}}{end}%,92%{{stroke-dashoffset:0;opacity:1}}100%{{stroke-dashoffset:0;opacity:1}}}}</style>')
    else:
        svg.append(f'<style>@keyframes {name}{{0%,{start}%{{opacity:0}}{end}%,92%,100%{{opacity:1}}}}</style>')
    svg.append(item.replace(' points=',f' style="animation:{name} 14s linear infinite" points=',1))
svg.append('</svg>')
Path(__file__).with_name('turtle-bouquet.svg').write_text('\n'.join(svg),encoding='utf-8')
screen.bye()
