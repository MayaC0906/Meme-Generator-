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
    let pos = getEvPos(ev)
    checkIfIsDrug(pos.x, pos.y)
    renderMeme()
}

function onMove(ev) {
    ev.preventDefault()
    let pos = getEvPos(ev)
    let meme = getMeme()
    let lineIsDrag = meme.lines.find(line => line.isDrag === true)
    if (lineIsDrag === undefined) return
    else {
        document.body.style.cursor = 'grabbing'
        let lineWidth = gCtx.measureText(lineIsDrag.txt).width
        lineIsDrag.x = pos.x - lineWidth / 2
        lineIsDrag.y = pos.y
        SaveGmemeToStorage()
        renderMeme()
    }
}

function onUp() {
    document.body.style.cursor = 'auto'
    let meme = getMeme()
    meme.lines.forEach(line => line.isDrag = false)
    SaveGmemeToStorage()
}

function cleanTxtInput(txtInput) {
    if (txtInput.value === 'Enter text here') txtInput.value =''
}

function onOpenGallery() {
    showGallery()
    hideMeme()
    hideSavedMemes()
}

function renderMeme() {
    let meme = getMeme()
    if (meme.selectedImgId === null) return
    let memeImg = getImgUrlById(meme.selectedImgId)
    renderMemeImg(memeImg)
}

function renderMemeImg(img) {
    let bgcImg = new Image()
    bgcImg.src = img

    bgcImg.onload = () => {
        gElCanvas.height = (bgcImg.naturalHeight / bgcImg.naturalWidth) * gElCanvas.width
        gCtx.drawImage(bgcImg, 0, 0, gElCanvas.width, gElCanvas.height)

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

function onSetFontColor(color) {
    setMemeTxtColor(color)
    renderMeme()
}

function onSetStrokeColor(strokeColor) {
    setStrokeColor(strokeColor)
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

function onMoveText(direction) {
    moveText(direction)
    renderMeme()
}

function onChangeAlign(direction) {
    changeAlign(direction)
    renderMeme()
}

function onSetFont(font) {
    setFont(font)
    renderMeme()
}

function onSaveToMemes() {
    const imgContent = gElCanvas.toDataURL('image/jpeg')
    saveToMemes(imgContent)

    onRenderSavedMemes()
}

function onDeleteLine() {
    deleteSelectedLine()
    renderMeme()
}

function onAddLine() {
    addLine()
    renderMeme()
}

function onAddEmoji(emoji) {
    addLine()
    setEmoji(emoji)
    renderMeme()
}

function onSaveMemeText() {
    cancelIsEdited()
    renderMeme()
}

function onRenderSavedMemes() {
    hideMeme()
    hideGallery()

    let elSavedMemes = document.querySelector('.saved-memes')
    let memesStrs = loadFromStorage('savedImagesDB')
    elSavedMemes.innerHTML = memesStrs.join('')

    showSavedMemes()

}

function onEditImg(id) {
    console.log('memeid' , id);
    let meme = getSavedImg(id)
    console.log( 'new meme', meme);
    gMeme = meme
    console.log('gMeme' ,gMeme);

    SaveGmemeToStorage ()

    showMeme()
    hideSavedMemes()
    
    renderMeme()

}

function renderMemeTxt(textProp) {
    
    gCtx.lineWidth = 2
    gCtx.strokeStyle = `${textProp.strokeColor}`
    
    gCtx.fillStyle = `${textProp.color}`
    gCtx.font = `${textProp.size}px ${textProp.font}`
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

function onOpenModal() {
    var elModal = document.querySelector('.modal-container')
    elModal.style.display = 'flex'
}

function onCloseModal() {
    var elModal = document.querySelector('.modal-container')
    elModal.style.display = 'none'
}

function resetInputs () {
    document.querySelector('.txt-input').value = 'Enter text here'
    document.querySelector('.color-input').value = '#FFFFFF'
    document.querySelector('.stroke-color-input').value = '#000000'
}

