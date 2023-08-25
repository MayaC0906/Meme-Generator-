'use strict'

let gIsBarsOpen = false 

function renderGallery() {
    let elGallery = document.querySelector('.gallery')
    let galleryStr = gImgs.map(img => `<img onclick="onImgSelect(${img.id})" src="${img.url}" alt=""></img>`)
    elGallery.innerHTML = galleryStr.join('')
}

function onImgSelect(imgId) {
    hideGallery()
    showMeme()
    setImg(imgId)
    resetScreen()
    renderMeme()    
}


function onOpenBars() {
    console.log('hi');
    let elMainNav = document.querySelector ('.main-nav')
    if (gIsBarsOpen === false) elMainNav.style.top = '75px'
    else elMainNav.style.top = '-1000px'
    gIsBarsOpen = !gIsBarsOpen
}