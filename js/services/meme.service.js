'use strict'

var gSavedImgs 

var gImgs = [
  { id: 1, url: '/images/1.jpg', keywords: ['funny', 'politics'] },
  { id: 2, url: '/images/2.jpg', keywords: ['cute', 'dogs'] },
  { id: 3, url: '/images/3.jpg', keywords: ['cute', 'dogs'] },
  { id: 4, url: '/images/4.jpg', keywords: ['cute', 'cat'] },
  { id: 5, url: '/images/5.jpg', keywords: ['angry', 'baby'] },
  { id: 6, url: '/images/6.jpg', keywords: ['funny', 'tv'] },
  { id: 7, url: '/images/7.jpg', keywords: ['funny', 'baby'] },
  { id: 8, url: '/images/8.jpg', keywords: ['funny', 'tv'] },
  { id: 9, url: '/images/9.jpg', keywords: ['funny', 'baby'] },
  { id: 10, url: '/images/10.jpg', keywords: ['funny', 'politics'] },
  { id: 11, url: '/images/11.jpg', keywords: ['angry', 'cat'] },
  { id: 12, url: '/images/12.jpg', keywords: ['cute', 'sport'] },
  { id: 13, url: '/images/13.jpg', keywords: ['funny', 'tv'] },
  { id: 14, url: '/images/14.jpg', keywords: ['angry', 'tv'] },
  { id: 15, url: '/images/15.jpg', keywords: ['funny', 'tv'] },
  { id: 16, url: '/images/16.jpg', keywords: ['funny', 'tv'] },
  { id: 17, url: '/images/17.jpg', keywords: ['angry', 'politics'] },
  { id: 18, url: '/images/18.jpg', keywords: ['funny', 'tv'] }
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
  let meme = loadFromStorage ('gMemeDB')
  if (!meme) gMeme=gMeme
  else gMeme = meme
  return gMeme
}

function setLineTxt(txt) {
  // let currTxt = getMemeTextProp()
  gMeme.lines[gMeme.selectedLineIdx].txt = txt
  SaveGmemeToStorage ()
}

function setImg(imgId) {
  gMeme.selectedImgId = imgId
  SaveGmemeToStorage ()
}

function setMemeTxtColor(color) {
  gMeme.lines[gMeme.selectedLineIdx].color = color
  SaveGmemeToStorage ()
}

function addLine() {
  let newLine = _createLine(220)

  gMeme.lines.push(newLine)
  SaveGmemeToStorage ()
}

function switchLines() {
  gMeme.selectedLineIdx++
  if (gMeme.selectedLineIdx>gMeme.lines.length-1) gMeme.selectedLineIdx=0
  SaveGmemeToStorage ()
}

function setFontSize (fontChange) {
  if (fontChange === 'increase') gMeme.lines[gMeme.selectedLineIdx].size+=1
  else gMeme.lines[gMeme.selectedLineIdx].size-=1
  SaveGmemeToStorage ()
}

function getMemeTextProp(line) {
  let meme = getMeme()
  return meme.lines[line]
}

function getMemeLine() {
  return gMeme.selectedLineIdx
}

function getImgUrlById(id) {
  let img = gImgs.find(img => img.id === id)
  return img.url
}

function resetScreen() {
gMeme.lines = [
_createLine(40),
_createLine(380)
]
SaveGmemeToStorage ()
  document.querySelector('.txt-input').value = 'enter text here'
  document.querySelector('.color-input').value = '#FFFFFF'
}

function checkIfIsEdited() {
gMeme.lines.forEach ((line,idx) => {
if (idx===gMeme.selectedLineIdx) line.isEdited = true
else line.isEdited = false
})
SaveGmemeToStorage ()
}

function cancelIsEdited() {
  gMeme.lines.forEach (line => line.isEdited=false)
  SaveGmemeToStorage ()
}

function saveToMemes (imgSrc) {
  let ImgStr = `<img onclick="onEditImg(${gMeme})" src="${imgSrc}" alt=""></img>`

  let savedImgs = loadFromStorage ('savedImagesDB')
  if (!savedImgs) gSavedImgs =[]
  else gSavedImgs=savedImgs

  gSavedImgs.push(ImgStr)

 saveToStorage ('savedImagesDB',gSavedImgs)
}

function checkIfIsDrug(x,y) {
  gMeme.lines.forEach ((line,idx) => {
    let lineWidth = gCtx.measureText(line.txt).width
    console.log('linewidth' , lineWidth);
    if (x>line.x && x<lineWidth+line.x && y>(line.y-0.5*line.size) && y<(line.y+0.5*line.size) ) {
      line.isDrag=true
      line.isEdited=true
      gMeme.selectedLineIdx = idx
    }else{
      line.isDrag =false
      line.isEdited=false
    } 
  })

  SaveGmemeToStorage ()

}

function _createLine(y) {
  return {
    isEdited: false,
    isDrag: false,
    x:40,
    y,
    txt: 'enter text here',
    size: 40,
    color: '#FFFFFF'
  }
  }

