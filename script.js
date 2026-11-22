const button = document.querySelector('#open');
const letter = document.querySelector('#letter');
function setLetter(open) { letter.hidden = !open; button.setAttribute('aria-expanded', String(open)); button.firstChild.textContent = open ? 'Close the letter ' : 'A letter for you '; }
button.addEventListener('click', () => setLetter(letter.hidden));
document.querySelector('#letter-shortcut').addEventListener('click', () => { setLetter(true); document.querySelector('#note').scrollIntoView({behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'}); });
const note = document.querySelector('.reveal');
if ('IntersectionObserver' in window) { const observer = new IntersectionObserver(entries => { if (entries[0].isIntersecting) { note.classList.add('visible'); observer.disconnect(); } }, { threshold: 0.15 }); observer.observe(note); } else note.classList.add('visible');
if (!matchMedia('(prefers-reduced-motion: reduce)').matches) setTimeout(() => document.querySelector('.fireworks').classList.add('celebrate'), 2500);
