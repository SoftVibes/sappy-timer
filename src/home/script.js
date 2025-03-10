const electron = require('electron');
const ipc = electron.ipcRenderer;

const closeBtn = document.getElementById('win-close');
closeBtn.addEventListener('click', () => {
    ipc.send('exit');
});
closeBtn.addEventListener('mouseover', () => {
    document.getElementById('win-close-img').setAttribute('src', '../win_close_btn_highlighted.png');
});
closeBtn.addEventListener('mouseout', () => {
    document.getElementById('win-close-img').setAttribute('src', '../win_close_btn.png');
});

const minBtn = document.getElementById('win-minimise');
minBtn.addEventListener('click', () => {
    ipc.send('min');
});
minBtn.addEventListener('mouseover', () => {
    document.getElementById('win-minimise-img').setAttribute('src', '../win_minimise_btn_highlighted.png');
});
minBtn.addEventListener('mouseout', () => {
    document.getElementById('win-minimise-img').setAttribute('src', '../win_minimise_btn.png');
});

const startBtn = document.getElementById('start-btn');
startBtn.addEventListener('mouseover', () => {
    document.getElementById('start-box').setAttribute('src', '../modal_box_highlighted.png');
    document.getElementById('cat-img').setAttribute('src', '../cat2_open_mouth.png');
});
startBtn.addEventListener('mouseout', () => {
    document.getElementById('start-box').setAttribute('src', '../modal_box.png');
    document.getElementById('cat-img').setAttribute('src', '../cat2_idle.png');
});
startBtn.addEventListener('click', () => {
    window.open("../main/index.html", "_self");
});