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


function onToggleMenu() {
    document.body.classList.toggle('menu-open');
}
