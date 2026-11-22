const button = document.querySelector('#open');
const letter = document.querySelector('#letter');
button.addEventListener('click', () => { const open = letter.hidden; letter.hidden = !open; button.setAttribute('aria-expanded', String(open)); button.firstChild.textContent = open ? 'Close the letter ' : 'A letter for you '; });
const note = document.querySelector('.reveal');
if ('IntersectionObserver' in window) { const observer = new IntersectionObserver(entries => { if (entries[0].isIntersecting) { note.classList.add('visible'); observer.disconnect(); } }, { threshold: 0.15 }); observer.observe(note); } else note.classList.add('visible');
