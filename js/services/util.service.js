'use strict'

function saveToStorage(key, value) {
    const json = JSON.stringify(value)
    localStorage.setItem(key, json)
}

function loadFromStorage(key) {
    const json = localStorage.getItem(key)
    return JSON.parse(json)
}

function SaveGmemeToStorage () {
    saveToStorage ('gMemeDB', gMeme)
}

function hideGallery () {
   let elGallery = document.querySelector ('.gallery-container')
    elGallery.classList.add('hide')
}

function showGallery () {
    let elGallery = document.querySelector ('.gallery-container')
    elGallery.classList.remove('hide')
}

function hideMeme () {
   let elMeme = document.querySelector ('.meme')
   elMeme.classList.add('hide')
}

function showMeme () {
   let elMeme = document.querySelector ('.meme')
   elMeme.classList.remove('hide')
}

function hideSavedMemes () {
   let elSvedMemes = document.querySelector ('.saved-memes')
   elSvedMemes.classList.add('hide')
}

function showSavedMemes () {
   let elSvedMemes = document.querySelector ('.saved-memes')
   elSvedMemes.classList.remove('hide')
}

function onShareImg() {
    // Gets the image from the canvas
    const imgDataUrl = gElCanvas.toDataURL('image/jpeg') 

    function onSuccess(uploadedImgUrl) {
        // Handle some special characters
        const url = encodeURIComponent(uploadedImgUrl)
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&t=${url}`)
    }
    
    // Send the image to the server
    doUploadImg(imgDataUrl, onSuccess)
}


function doUploadImg(imgDataUrl, onSuccess) {
    
    const formData = new FormData()
    formData.append('img', imgDataUrl)

    const XHR = new XMLHttpRequest()
    XHR.onreadystatechange = () => {
        
        if (XHR.readyState !== XMLHttpRequest.DONE) return
        
        if (XHR.status !== 200) return console.error('Error uploading image')
        const { responseText: url } = XHR
        
        console.log('Got back live url:', url)
        onSuccess(url)
    }
    XHR.onerror = (req, ev) => {
        console.error('Error connecting to server with request:', req, '\nGot response data:', ev)
    }
    XHR.open('POST', '//ca-upload.com/here/upload.php')
    XHR.send(formData)
}
