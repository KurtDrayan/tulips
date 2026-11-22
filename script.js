const dialog = document.querySelector('#letter');
const opener = document.querySelector('#open-letter');
opener.addEventListener('click', () => dialog.showModal());
document.querySelector('#close-letter').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
if (!matchMedia('(prefers-reduced-motion: reduce)').matches) setTimeout(() => document.querySelector('.fireworks').classList.add('celebrate'), 2500);
