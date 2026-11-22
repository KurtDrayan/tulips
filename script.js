const dialog = document.querySelector('#letter');
document.querySelector('#open-letter').addEventListener('click', () => dialog.showModal());
document.querySelector('#close-letter').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });

// Draw small fireworks at the edges so the bouquet remains the focus.
const canvas = document.querySelector('.fireworks');
const ctx = canvas.getContext('2d');
const motion = matchMedia('(prefers-reduced-motion: reduce)');
let width, height, rockets = [], sparks = [], animationId = 0, lastTime = 0, launchAt = 0, side = 0;
const palettes = [[255,190,95], [255,140,175], [255,221,153], [225,158,222]];
function resize() {
  width = innerWidth; height = innerHeight;
  const ratio = Math.min(devicePixelRatio || 1, 2);
  canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
}
function launch() {
  const margin = width < 600 ? .13 : .2;
  const x = width * (side++ % 2 ? 1 - margin : margin);
  const targetY = height * (.15 + Math.random() * .25);
  rockets.push({x, y: height * .82, targetY, vx:(Math.random()-.5)*.2, vy:-6.7 - Math.random()*.6, trail:[]});
}
function explode(x,y) {
  const color = palettes[Math.floor(Math.random()*palettes.length)];
  const count = width < 600 ? 45 : 65;
  for (let i=0; i<count; i++) {
    const angle = Math.PI * 2 * i / count + (Math.random()-.5)*.12;
    const speed = 1.2 + Math.random()*2.5;
    sparks.push({x,y,px:x,py:y,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed,life:1,decay:.009+Math.random()*.009,color, twinkle:Math.random()});
  }
}
function frame(time) {
  if (motion.matches || document.hidden) { animationId=0; lastTime=0; return; }
  const dt = Math.min((time - (lastTime || time))/16.67, 2); lastTime=time;
  ctx.clearRect(0,0,width,height);
  if (!launchAt) launchAt=time+2000;
  if (time >= launchAt) { launch(); launchAt=time+1400+Math.random()*900; }
  for (let i=rockets.length-1;i>=0;i--) {
    const r=rockets[i]; r.trail.push({x:r.x,y:r.y}); if(r.trail.length>8)r.trail.shift();
    r.x+=r.vx*dt; r.y+=r.vy*dt;
    for(let j=1;j<r.trail.length;j++) { ctx.beginPath(); ctx.moveTo(r.trail[j-1].x,r.trail[j-1].y); ctx.lineTo(r.trail[j].x,r.trail[j].y); ctx.strokeStyle=`rgba(244,175,105,${j/r.trail.length*.55})`; ctx.lineWidth=1.5; ctx.stroke(); }
    if(r.y<=r.targetY){explode(r.x,r.y);rockets.splice(i,1);}
  }
  for (let i=sparks.length-1;i>=0;i--) {
    const s=sparks[i]; s.px=s.x; s.py=s.y; s.x+=s.vx*dt; s.y+=s.vy*dt; s.vx*=Math.pow(.985,dt); s.vy=s.vy*Math.pow(.985,dt)+.033*dt; s.life-=s.decay*dt;
    if(s.life<=0){sparks.splice(i,1);continue;}
    const alpha=Math.min(1,s.life*1.4)*(s.twinkle>.75 && Math.random()>.65 ? .5 : 1);
    ctx.beginPath(); ctx.moveTo(s.px-s.vx*2,s.py-s.vy*2); ctx.lineTo(s.x,s.y); ctx.strokeStyle=`rgba(${s.color.join(',')},${alpha})`; ctx.lineWidth=1.2+1.1*s.life; ctx.lineCap='round'; ctx.stroke();
    ctx.beginPath();ctx.arc(s.x,s.y,1.2*s.life,0,Math.PI*2);ctx.fillStyle=`rgba(255,250,233,${alpha})`;ctx.fill();
  }
  animationId=requestAnimationFrame(frame);
}
function syncAnimation() {
  if(motion.matches || document.hidden) { if(animationId) cancelAnimationFrame(animationId); animationId=0; lastTime=0; rockets=[]; sparks=[]; ctx.clearRect(0,0,width,height); }
  else if(!animationId) { launchAt=0; animationId=requestAnimationFrame(frame); }
}
resize(); addEventListener('resize',resize); motion.addEventListener('change',syncAnimation); document.addEventListener('visibilitychange',syncAnimation); syncAnimation();
