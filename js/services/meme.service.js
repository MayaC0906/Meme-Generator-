'use strict'

var gSavedImgs = []
var gSavedMemes = []

var gImgs = [
  { id: 1, url: './images/1.jpg', keywords: ['funny', 'politics'] },
  { id: 2, url: './images/2.jpg', keywords: ['cute', 'dogs'] },
  { id: 3, url: './images/3.jpg', keywords: ['cute', 'dogs'] },
  { id: 4, url: './images/4.jpg', keywords: ['cute', 'cat'] },
  { id: 5, url: './images/5.jpg', keywords: ['angry', 'baby'] },
  { id: 6, url: './images/6.jpg', keywords: ['funny', 'tv'] },
  { id: 7, url: './images/7.jpg', keywords: ['funny', 'baby'] },
  { id: 8, url: './images/8.jpg', keywords: ['funny', 'tv'] },
  { id: 9, url: './images/9.jpg', keywords: ['funny', 'baby'] },
  { id: 10, url: './images/10.jpg', keywords: ['funny', 'politics'] },
  { id: 11, url: './images/11.jpg', keywords: ['angry', 'cat'] },
  { id: 12, url: './images/12.jpg', keywords: ['cute', 'sport'] },
  { id: 13, url: './images/13.jpg', keywords: ['funny', 'tv'] },
  { id: 14, url: './images/14.jpg', keywords: ['angry', 'tv'] },
  { id: 15, url: './images/15.jpg', keywords: ['funny', 'tv'] },
  { id: 16, url: './images/16.jpg', keywords: ['funny', 'tv'] },
  { id: 17, url: './images/17.jpg', keywords: ['angry', 'politics'] },
  { id: 18, url: './images/18.jpg', keywords: ['funny', 'tv'] }
]

var gMeme = {
  selectedImgId: null,
  selectedLineIdx: 0,
  lines: [
    _createLine(40),
    _createLine(390)
  ]
}

function getMeme() {
  let meme = loadFromStorage('gMemeDB')
  if (!meme) gMeme = gMeme
  else gMeme = meme
  return gMeme
}

function setLineTxt(txt) {
  // let currTxt = getMemeTextProp()
  gMeme.lines[gMeme.selectedLineIdx].txt = txt
  SaveGmemeToStorage()
}

function setImg(imgId) {
  gMeme.selectedImgId = imgId
  SaveGmemeToStorage()
}

function setMemeTxtColor(color) {
  let selectedLine = getSelectedLine()
  selectedLine.color = color
  SaveGmemeToStorage()
}

function setStrokeColor(strokeColor) {
  let selectedLine = getSelectedLine()
  selectedLine.strokeColor = strokeColor
  SaveGmemeToStorage()
}

function addLine() {
  let newLine = _createLine(220)
  gMeme.lines.push(newLine)
  cancelIsEdited()
  gMeme.selectedLineIdx = gMeme.lines.length - 1
  checkIfIsEdited()
  SaveGmemeToStorage()
}

function switchLines() {
  gMeme.selectedLineIdx++
  if (gMeme.selectedLineIdx > gMeme.lines.length - 1) gMeme.selectedLineIdx = 0
  SaveGmemeToStorage()
}

function moveText(direction) {
  let selectedLine = getSelectedLine()
  if (!selectedLine) return
  if (direction === 'up') selectedLine.y -= 3
  else if (direction === 'down') selectedLine.y += 3

  SaveGmemeToStorage()
}

function changeAlign(direction) {

  let selectelLine = getSelectedLine()
  let lineWidth = gCtx.measureText(selectelLine.txt).width

  if (direction === 'left') selectelLine.x = 15
  else if (direction === 'center') selectelLine.x = (gElCanvas.width * 0.5 - lineWidth * 0.5)
  else if (direction === 'right') selectelLine.x = gElCanvas.width - lineWidth - 15

  SaveGmemeToStorage()
}

function setFontSize(fontChange) {
  let line = getSelectedLine()
  if (fontChange === 'increase') line.size += 1
  else line.size -= 1
  SaveGmemeToStorage()
}

function setFont(font) {
  let selectedLine = getSelectedLine()
  selectedLine.font = font
  SaveGmemeToStorage()
}

function deleteSelectedLine() {
  let newLines = gMeme.lines.filter(line => line.isEdited === false)
  gMeme.lines = newLines
  SaveGmemeToStorage()
}

function setEmoji(emoji) {
  let line = gMeme.lines[gMeme.lines.length - 1]
  line.txt = emoji
  line.x = 200
  SaveGmemeToStorage()
}

function getMemeTextProp(line) {
  let meme = getMeme()
  return meme.lines[line]
}

function getMemeLine() {
  return gMeme.selectedLineIdx
}

function getSelectedLine() {
  let line =  gMeme.lines[gMeme.selectedLineIdx]
  line.isEdited = true
  return line
}

function getImgUrlById(id) {
  let img = gImgs.find(img => img.id === id)
  return img.url
}

function getEvPos(ev) {
  let x
  let y
  if (ev.type === 'mousedown' || ev.type === 'mousemove') {
    x = ev.offsetX
    y = ev.offsetY
  }

  if (ev.type === 'touchstart' || ev.type === 'touchmove') {
    const rect = gElCanvas.getBoundingClientRect()
    x = ev.touches[0].clientX - rect.left;
    y = ev.touches[0].clientY - rect.top;
  }
  return { x, y }
}

function resetScreen() {
  gMeme.lines = [
    _createLine(40),
    _createLine(380)
  ]
  SaveGmemeToStorage()
  document.querySelector('.txt-input').value = 'enter text here'
  document.querySelector('.color-input').value = '#FFFFFF'
  document.querySelector('.stroke-color-input').value = '#000000'
}

function checkIfIsEdited() {
  gMeme.lines.forEach((line, idx) => {
    if (idx === gMeme.selectedLineIdx) line.isEdited = true
    else line.isEdited = false
  })
  SaveGmemeToStorage()
}

function cancelIsEdited() {
  gMeme.lines.forEach(line => line.isEdited = false)
  SaveGmemeToStorage()
}

function saveToMemes(imgSrc) {
  let meme = gMeme
  console.log(meme);
  let id = makeId()
  meme['id'] = id

  let savedMemes = loadFromStorage('savedMemesDB')
  if (!savedMemes) gSavedMemes = []
  else gSavedMemes = savedMemes
  gSavedMemes.push (meme)
  saveToStorage('savedMemesDB', gSavedMemes)

  let ImgStr = `<img onclick="onEditImg('${meme.id}')" src="${imgSrc}" alt=""></img>`

  let savedImgs = loadFromStorage('savedImagesDB')
  if (!savedImgs) gSavedImgs = []
  else gSavedImgs = savedImgs

  gSavedImgs.push(ImgStr)

  saveToStorage('savedImagesDB', gSavedImgs)
}

function checkIfIsDrug(x, y) {
  gMeme.lines.forEach((line, idx) => {
    let lineWidth = gCtx.measureText(line.txt).width
    if (x > line.x && x < lineWidth + line.x && y > (line.y - 0.5 * line.size) && y < (line.y + 0.5 * line.size)) {
      line.isDrag = true
      line.isEdited = true
      gMeme.selectedLineIdx = idx
      document.querySelector('.txt-input').value = line.txt
    } else {
      line.isDrag = false
      line.isEdited = false
    }
  })

  SaveGmemeToStorage()

}

function _createLine(y) {
  return {
    isEdited: false,
    isDrag: false,
    x: 40,
    y,
    txt: 'enter text here',
    font: 'impact',
    size: 40,
    color: '#FFFFFF',
    strokeColor: '#000000'
  }
}

function getSavedImg (id) {
  let savedMemes = loadFromStorage('savedMemesDB')
  if (!savedMemes) return
  return savedMemes.find((img)=> (img.id === id))
}
