const dialog = document.querySelector('#letter');
document.querySelector('#open-letter').addEventListener('click', () => dialog.showModal());
document.querySelector('#close-letter').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
