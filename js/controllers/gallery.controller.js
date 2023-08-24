'use strict'

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

