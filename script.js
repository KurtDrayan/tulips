const dialog = document.querySelector('#letter');
document.querySelector('#open-letter').addEventListener('click', () => dialog.showModal());
document.querySelector('#close-letter').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });

// Draw small fireworks at the edges so the bouquet remains the focus.
const canvas = document.querySelector('.fireworks');
const ctx = canvas.getContext('2d');
const motion = matchMedia('(prefers-reduced-motion: reduce)');
let width, height, rockets = [], sparks = [], flashes = [], animationId = 0, lastTime = 0, launchAt = 0, side = 0;
const palettes = [[202,74,104], [180,76,154], [187,112,15], [141,83,177], [211,88,54]];
function resize() {
  width = innerWidth; height = innerHeight;
  const ratio = Math.min(devicePixelRatio || 1, 2);
  canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
}
function launch() {
  const margin = width < 600 ? .26 : .23;
  const x = width * (side++ % 2 ? 1 - margin : margin);
  const targetY = height * (.14 + Math.random() * .23);
  rockets.push({x, y: height * .72, targetY, vx:(Math.random()-.5)*.2, vy:-6.7 - Math.random()*.6, trail:[]});
}
function explode(x,y) {
  const color = palettes[Math.floor(Math.random()*palettes.length)];
  const size = [0.5, 0.8, 1.15, 1.5][Math.floor(Math.random()*4)];
  const count = Math.round((width < 600 ? 75 : 105) * (.7 + size*.4));
  flashes.push({x, y, life: 1});
  for (let i=0; i<count; i++) {
    const angle = Math.PI * 2 * i / count + (Math.random()-.5)*.12;
    const speed = ((Math.random() < .2 ? .8 : 2.0) + Math.random()*3.2) * size;
    sparks.push({x,y,px:x,py:y,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed,life:1,decay:.005+Math.random()*.006,color, twinkle:Math.random(), trail:[]});
  }
}
function frame(time) {
  if (motion.matches || document.hidden) { animationId=0; lastTime=0; return; }
  const dt = Math.min((time - (lastTime || time))/16.67, 2); lastTime=time;
  ctx.clearRect(0,0,width,height);
  if (!launchAt) launchAt=time+700;
  if (time >= launchAt) { launch(); if(width >= 600 && Math.random()<.3) launch(); launchAt=time+(width < 600 ? 4500+Math.random()*2000 : 1000+Math.random()*650); }
  for (let i=rockets.length-1;i>=0;i--) {
    const r=rockets[i]; r.trail.push({x:r.x,y:r.y}); if(r.trail.length>18)r.trail.shift();
    r.x+=r.vx*dt; r.y+=r.vy*dt;
    for(let j=1;j<r.trail.length;j++) { ctx.beginPath(); ctx.moveTo(r.trail[j-1].x,r.trail[j-1].y); ctx.lineTo(r.trail[j].x,r.trail[j].y); ctx.strokeStyle=`rgba(184,94,77,${j/r.trail.length*.8})`; ctx.lineWidth=1.5; ctx.stroke(); }
    if(r.y<=r.targetY){explode(r.x,r.y);rockets.splice(i,1);}
  }
  for (let i=flashes.length-1;i>=0;i--) {
    const f=flashes[i]; f.life-=.055*dt; if(f.life<=0){flashes.splice(i,1);continue;}
    const glow=ctx.createRadialGradient(f.x,f.y,0,f.x,f.y,40); glow.addColorStop(0,`rgba(255,231,171,${f.life*.65})`);glow.addColorStop(1,'rgba(255,200,130,0)');ctx.fillStyle=glow;ctx.beginPath();ctx.arc(f.x,f.y,40,0,Math.PI*2);ctx.fill();
  }
  for (let i=sparks.length-1;i>=0;i--) {
    const s=sparks[i]; s.trail.push({x:s.x,y:s.y}); if(s.trail.length>12)s.trail.shift(); s.px=s.x; s.py=s.y; s.x+=s.vx*dt; s.y+=s.vy*dt; s.vx*=Math.pow(.985,dt); s.vy=s.vy*Math.pow(.985,dt)+.033*dt; s.life-=s.decay*dt;
    if(s.life<=0){sparks.splice(i,1);continue;}
    const alpha=Math.min(1,s.life*1.4)*(s.twinkle>.75 && Math.random()>.65 ? .5 : 1);
    for(let j=1;j<s.trail.length;j++){ const a=alpha*j/s.trail.length; ctx.beginPath(); ctx.moveTo(s.trail[j-1].x,s.trail[j-1].y); ctx.lineTo(s.trail[j].x,s.trail[j].y); ctx.strokeStyle=`rgba(${s.color.join(',')},${a*.65})`;ctx.lineWidth=1.7+1.5*j/s.trail.length;ctx.lineCap='round';ctx.stroke(); }
    ctx.save(); ctx.shadowColor=`rgba(${s.color.join(',')},.9)`;ctx.shadowBlur=9;ctx.beginPath();ctx.arc(s.x,s.y,2+1.3*s.life,0,Math.PI*2);ctx.fillStyle=`rgba(${s.color.join(',')},${alpha})`;ctx.fill();ctx.restore();
    ctx.beginPath();ctx.arc(s.x,s.y,.8,0,Math.PI*2);ctx.fillStyle=`rgba(255,255,245,${alpha})`;ctx.fill();
  }
  animationId=requestAnimationFrame(frame);
}
function syncAnimation() {
  if(motion.matches || document.hidden) { if(animationId) cancelAnimationFrame(animationId); animationId=0; lastTime=0; rockets=[]; sparks=[]; flashes=[]; ctx.clearRect(0,0,width,height); }
  else if(!animationId) { launchAt=0; animationId=requestAnimationFrame(frame); }
}
resize(); addEventListener('resize',resize); motion.addEventListener('change',syncAnimation); document.addEventListener('visibilitychange',syncAnimation); syncAnimation();
