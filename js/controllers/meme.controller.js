'use strict'

let gElCanvas
let gCtx


function onInIt() {
    gElCanvas = document.querySelector('canvas')
    gCtx = gElCanvas.getContext('2d')
    addEventListenrs()
    renderGallery()
    renderMeme()
}

function addEventListenrs() {
    addMouseEvents()
    addTouchEvents()
}

function addMouseEvents() {
    gElCanvas.addEventListener('mousedown', onDown)
    gElCanvas.addEventListener('mousemove', onMove)
    gElCanvas.addEventListener('mouseup', onUp)
}

function addTouchEvents() {
    gElCanvas.addEventListener('touchstart', onDown)
    gElCanvas.addEventListener('touchmove', onMove)
    gElCanvas.addEventListener('touchend', onUp)
}

function onDown(ev) {
    checkIfIsDrug(ev.offsetX, ev.offsetY)
    renderMeme()
}

function onMove(ev) {
    let meme = getMeme()
    let lineIsDrag = meme.lines.find(line => line.isDrag === true)
    if (lineIsDrag === undefined) return
    if (lineIsDrag) {
        let lineWidth = gCtx.measureText(lineIsDrag.txt).width
        lineIsDrag.x = ev.offsetX - lineWidth/2
        lineIsDrag.y = ev.offsetY
        renderMeme()
    }
    console.log('hi');
}

function onUp() {
    let meme = getMeme()
    meme.lines.forEach(line => line.isDrag = false)
}

function renderMeme() {
    let meme = getMeme()
    let memeImg = getImgUrlById(meme.selectedImgId)
    renderMemeImg(memeImg)
}

function renderMemeImg(img) {
    let bgcImg = new Image()
    bgcImg.src = img

    bgcImg.onload = () => {
        gElCanvas.height = (bgcImg.naturalHeight / bgcImg.naturalWidth) * gElCanvas.width
        gCtx.drawImage(bgcImg, 0, 0, gElCanvas.width, gElCanvas.height)

        // let memeTxtProp = getMemeTextProp()
        let meme = getMeme()
        meme.lines.map(line => renderMemeTxt(line))
    }

}

function onChangeFontSize(fontChange) {
    setFontSize(fontChange)
    renderMeme()
}

function onSetLineText(txt) {
    setLineTxt(txt)
    renderMeme()
}

function onDownloadImg(elLink) {
    const imgContent = gElCanvas.toDataURL('image/jpeg') // image/jpeg the default format
    elLink.href = imgContent
}

function onSetColor(color) {
    setMemeTxtColor(color)
    renderMeme()
}

function onSwitchLines() {
    switchLines()
    checkIfIsEdited()
    const elTxtInput = document.querySelector('.txt-input')
    let currLine = getMemeLine()
    let memeTxt = getMemeTextProp(currLine).txt
    elTxtInput.value = memeTxt
    renderMeme()
}

function onSaveToMemes() {
    const imgContent = gElCanvas.toDataURL('image/jpeg')
    saveToMemes(imgContent)

    onRenderMemes ()
}

function onDeleteMeme() {
    gCtx.fillStyle = 'white'
    gCtx.fillRect(0, 0, gElCanvas.width, gElCanvas.height);
}

function onAddLine() {
    addLine()
    renderMeme()
}

function onSaveMemeText() {
    cancelIsEdited()
    renderMeme()
}

function onRenderMemes () {
let elMeme = document.querySelector ('.meme')
let elGallery = document.querySelector ('.gallery-container')
let elMemes = document.querySelector ('.saved-memes')

elMeme.classList.add ('hide')
elGallery.classList.add ('hide')
elMemes.classList.remove ('hide')

let memesStrs = loadFromStorage ('savedImagesDB')

elMemes.innerHTML = memesStrs.join('')

}

///////////////////////////
// function onEditImg(meme)
/////////////////////////////

function renderMemeTxt(textProp) {

    gCtx.lineWidth = 2
    gCtx.strokeStyle = "#000000"

    gCtx.fillStyle = `${textProp.color}`
    gCtx.font = `${textProp.size}px rubik`
    gCtx.textBaseline = 'middle'
    gCtx.fillText(`${textProp.txt}`, textProp.x, textProp.y)
    gCtx.strokeText(`${textProp.txt}`, textProp.x, textProp.y)
    let textLength = gCtx.measureText(textProp.txt)

    if (textProp.isEdited === true) {
        gCtx.strokeStyle = 'red'
        gCtx.strokeRect(textProp.x - 10, textProp.y - (textProp.size / 2) - 10,
            textLength.width + 20, textProp.size + 20)
    }

}


