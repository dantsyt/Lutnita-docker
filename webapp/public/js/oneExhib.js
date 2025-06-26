const title = document.querySelector('#title')
const exhPath = window.location.pathname
const exhId = exhPath.substring(exhPath.indexOf('/', 1) + 1, exhPath.length)
const imgContainer = document.querySelector('.image_container')
const assetUrl = "https://d23fd8t3cgh0wq.cloudfront.net"

function sendLog(message) {
    fetch('/log', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message })
    }).catch(error => console.error('Error logging message:', error))
}

async function getOneExhib(exh) {
    try {
        const response = await fetch(`/getOneExhib/${exh}`)
        const oneExhib = await response.json()
        imgArr = oneExhib.imgpath
        captionsArr = oneExhib.captions
        const countTotal = imgArr.length
        imgDir = `${assetUrl}/img/exhibitions/${oneExhib.exhibname}`
        imgDirMob = `${assetUrl}/img/exhibitions/${oneExhib.exhibname}/mob`
        // Append TEXT to desktop
        title.insertAdjacentHTML('afterend', `
        <div id="${oneExhib.exhibname}" class="text_container_nohover">
        <div class="names_wrapper"></div>
        <h4 class="exhibition_date">${oneExhib.date}</h4>
        <h6 class="pdf_mob"><a href="pdf/${oneExhib.exhibname}.pdf" target="_blank">info</a></h6>
        </div>
        <div class="img_counter">
        <p id="counter_text" class="counters">Exhibition views</p>
        <p class="counters"><span id="counter_num"> 1</span>/<span id="counter_total">${countTotal}</span></p>
        </div>
        <h6 class="pdf"><a href="pdf/${oneExhib.exhibname}.pdf" target="_blank">info</a></h6>
        `)
        namesPlace = document.querySelector(`.names_wrapper`)
        for (let name of oneExhib.namepath) {
            if (name == "vbmmrdngmr.svg") {
                continue
            }
            namesPlace.insertAdjacentHTML('beforeend', `
            <div class="names_container">
            <img class="artist_name" src="${assetUrl}/img/exhibitions/namepaths/${name}">
            </div>
            `)
        }
        // Append images MOB
        imgContainer.insertAdjacentHTML('beforeend', `
        <div class="image_container_mob_one">
        <img class="center_image_mob mob_one_exhib inverted" src="${imgDirMob}/${imgArr[0]}_450px.webp" alt="center_image">
        </div>
        `)
        // Append images DESK
        imgContainer.insertAdjacentHTML('afterbegin', `
        <div id="space_image" class="space_image"></div>
        <img id="main_image" class="center_image_exhib center_image_one_exhib inverted" src="${imgDir}/${imgArr[0]}.webp" alt="center_image">
        `)
        imgContainer.insertAdjacentHTML('beforeend', `
        <p id="captions_desk" class="captions">${captionsArr[0].replace(/\\n/g, '<br>')}</p>
        `)
    } catch (e) {
        console.log(e)
    }
}

getOneExhib(exhId).then(() => {
    document.querySelector('footer').style.backgroundColor = 'unset'
    if (mediaQueryList.matches) {
        mob = true
        image = document.querySelector('.mob_one_exhib')
    } else {
        mob = false
        image = document.querySelector('#main_image')
    }
    // vbmmrdngmr special
    if (document.querySelector('.text_container_nohover').id == 'vbmmrdngmr') {
        vbmmrdngmr()
    }
    if (document.querySelector('.text_container_nohover').id == 'svitlosalome') {
        svitlosalome()
    }
    if (document.querySelector('.text_container_nohover').id == 'doinamardari') {
        doinamardari()
    }
    if (document.querySelector('.text_container_nohover').id == 'winter') {
        winter()
    }
    if (document.querySelector('.text_container_nohover').id == 'annagodzina') {
        annagodzina()
    }
    captions = document.querySelector('#captions_desk')
    const viewsCount = document.querySelector('#counter_num')
    // loadImage = document.querySelector('.load_image')
    setTimeout(() => {
        image.classList.add('fade')
    }, 50)
    setTimeout(() => {
        captions.classList.add('fade_captions')
    }, 500)
    let counter = 0
    window.addEventListener('keydown', function (event) {
        const key = event.key // "ArrowRight", "ArrowLeft"
        switch (event.key) {
            case "ArrowLeft":
                prevImage()
                break
            case "ArrowRight":
                nextImage()
                break
        }
        sendLog("keydown")
    })
    image.onclick = (e) => {
        let center = image.width / 2
        if (e.offsetX > center) {
            nextImage()
        } else {
            prevImage()
        }
        mob ? sendLog("tap") : sendLog("click")
    }

    // Swipe detection code
    function detectSwipe(el, func) {
        let swipe_det = {}
        swipe_det.sX = 0
        swipe_det.sY = 0
        swipe_det.eX = 0
        swipe_det.eY = 0
        const min_x = 20
        const max_y = 40
        const max_time = 700
        let startTime = 0
        let isHorizontalSwipe = false

        el.addEventListener('touchstart', function (e) {
            const t = e.touches[0]
            swipe_det.sX = t.screenX
            swipe_det.sY = t.screenY
            startTime = new Date().getTime()
            isHorizontalSwipe = false
        }, false)

        el.addEventListener('touchmove', function (e) {
            const t = e.touches[0]
            swipe_det.eX = t.screenX
            swipe_det.eY = t.screenY
            const dX = swipe_det.eX - swipe_det.sX
            if (Math.abs(dX) > min_x) {
                isHorizontalSwipe = true
            }
            if (isHorizontalSwipe) {
                e.preventDefault()
            }
        }, false)

        el.addEventListener('touchend', function (e) {
            const dX = swipe_det.eX - swipe_det.sX
            const dY = swipe_det.eY - swipe_det.sY
            const elapsedTime = new Date().getTime() - startTime

            if (Math.abs(dX) > min_x && Math.abs(dY) < max_y && elapsedTime <= max_time && isHorizontalSwipe) {
                if (dX > 0) {
                    func('right')
                } else {
                    func('left')
                }
            }
        }, false)
    }

    detectSwipe(image, function (direction) {
        if (direction === 'left') {
            nextImage()
        } else if (direction === 'right') {
            prevImage()
        }
        sendLog("swipe")
    })

    // Image preloading
    let nextImageElement = new Image()
    let prevImageElement = new Image()

    const preloadNextImage = (src) => {
        nextImageElement.src = src
    }

    const preloadPrevImage = (src) => {
        prevImageElement.src = src
    }

    const initPrevCounter = (imgArr.length - 1)
    const initPrevImageUrl = mob ? `${imgDirMob}/${imgArr[initPrevCounter]}_450px.webp` : `${imgDir}/${imgArr[initPrevCounter]}.webp`
    preloadPrevImage(initPrevImageUrl)

    const initNextCounter = 1
    const initNextNextImageUrl = mob ? `${imgDirMob}/${imgArr[initNextCounter]}_450px.webp` : `${imgDir}/${imgArr[initNextCounter]}.webp`
    preloadNextImage(initNextNextImageUrl)

    const nextImage = () => {
        counter++
        if (counter == imgArr.length) {
            counter = 0
        }
        const nextImageUrl = mob ? `${imgDirMob}/${imgArr[counter]}_450px.webp` : `${imgDir}/${imgArr[counter]}.webp`

        preloadNextImage(nextImageUrl)  // Preload the next image

        image.classList.remove('fade')
        image.onload = null  // Remove the previous onload event
        image.src = nextImageUrl  // Update the image source with the preloaded image

        captions.classList.remove('fade_captions')
        image.onload = () => {
            setTimeout(() => {
                image.classList.add('fade')
            }, 50)
            setTimeout(() => {
                captions.classList.add('fade_captions')
            }, 700)
            captions.innerText = captionsArr[counter].replace(/\\n/g, '\n')
            viewsCount.innerText = ` ${counter + 1}`

            // Preload the next image again after the current image is loaded
            const nextCounter = (counter + 1) % imgArr.length
            const nextNextImageUrl = mob ? `${imgDirMob}/${imgArr[nextCounter]}_450px.webp` : `${imgDir}/${imgArr[nextCounter]}.webp`
            preloadNextImage(nextNextImageUrl)
        }
        sendLog(`nextImage function called on exhibition: ${exhId}, counter: ${counter + 1}`)
    }

    const prevImage = () => {
        counter--
        if (counter == -1) {
            counter = imgArr.length - 1
        }
        const prevImageUrl = mob ? `${imgDirMob}/${imgArr[counter]}_450px.webp` : `${imgDir}/${imgArr[counter]}.webp`

        preloadNextImage(prevImageUrl)  // Preload the previous image

        image.classList.remove('fade')
        image.onload = null  // Remove the previous onload event
        image.src = prevImageUrl  // Update the image source with the preloaded image

        captions.classList.remove('fade_captions')
        image.onload = () => {
            setTimeout(() => {
                image.classList.add('fade')
            }, 50)
            setTimeout(() => {
                captions.classList.add('fade_captions')
            }, 700)
            captions.innerText = captionsArr[counter].replace(/\\n/g, '\n')
            viewsCount.innerText = ` ${counter + 1}`

            // Preload the next image again after the current image is loaded
            const prevCounter = (counter - 1) % imgArr.length
            const prevPrevImageUrl = mob ? `${imgDirMob}/${imgArr[prevCounter]}_450px.webp` : `${imgDir}/${imgArr[prevCounter]}.webp`
            preloadNextImage(prevPrevImageUrl)
        }
        sendLog(`prevImage function called on exhibition: ${exhId}, counter: ${counter + 1}`)
    }
}).catch((e) => { console.log(e.message) })

const winter = () => {
    const namesWrapper = document.querySelector('.names_wrapper')
    const namesContainer = document.querySelectorAll('.names_container')
    namesContainer[7].id = 'empty_w'
    document.querySelector('footer').style.backgroundColor = 'white'
    if (!mob) {
        document.querySelector('.title_menu').style.display = 'none'
    }
}

const vbmmrdngmr = () => {
    const namesWrapper = document.querySelector('.names_wrapper')
    const namesContainer = document.querySelectorAll('.names_container')
    if (mob) {
        document.querySelector('.pdf_mob').insertAdjacentHTML('afterend', `
        <h6 class="videoBtn">video</h6>
        `)
        namesWrapper.style.maxHeight = '9.5em'
        namesWrapper.style.marginBottom = '-2em'
        namesWrapper.style.marginTop = '5rem'
    } else {
        document.querySelector('.title_menu').style.display = 'none'
        document.querySelector('.pdf').insertAdjacentHTML('afterend', `
        <h6 class="videoBtn">video</h6>
        `)
        namesContainer[5].style.display = 'none'
    }
    videoBtn = document.querySelector('.videoBtn')
    videoBtn.addEventListener('click', videoAdd)
}

const svitlosalome = () => {
    if (mob) {
        document.querySelector('.pdf_mob').insertAdjacentHTML('afterend', `
        <h6 id="videoBtn1" class="videoBtn vidBtnSvitlo">video I</h6>
        <h6 id="videoBtn2" class="videoBtn vidBtnSvitlo">video II</h6>
        `)
    } else {
        document.querySelector('.pdf').insertAdjacentHTML('afterend', `
        <h6 id="videoBtn1" class="videoBtn vidBtnSvitlo">video I</h6>
        <h6 id="videoBtn2" class="videoBtn vidBtnSvitlo">video II</h6>
        `)
    }
    videoBtn1 = document.querySelector('#videoBtn1')
    videoBtn2 = document.querySelector('#videoBtn2')
    videoBtn1.addEventListener('click', videoAdd1)
    videoBtn2.addEventListener('click', videoAdd2)
}

const doinamardari = () => {
    if (mob) {
        document.querySelector('.pdf_mob').insertAdjacentHTML('afterend', `
        <h6 class="videoBtn">video</h6>
        `)
    } else {
        document.querySelector('.pdf').insertAdjacentHTML('afterend', `
        <h6 class="videoBtn">video</h6>
        `)
    }
    videoBtn = document.querySelector('.videoBtn')
    videoBtn.addEventListener('click', videoAddDoina)
}

const annagodzina = () => {
    if (mob) {
        document.querySelector('.pdf_mob').insertAdjacentHTML('afterend', `
        <h6 class="videoBtn">video</h6>
        `)
    } else {
        document.querySelector('.pdf').insertAdjacentHTML('afterend', `
        <h6 class="videoBtn">video</h6>
        `)
    }
    videoBtn = document.querySelector('.videoBtn')
    videoBtn.addEventListener('click', videoAddAnna)
}

const videoAdd = () => {
    sendLog(`videoAdd function called on exhibition: ${exhId}`)
    document.documentElement.classList.toggle('dark_mode')
    document.documentElement.style.cursor = "url('cursors/cursor_white.svg'), pointer;"
    // loadImage.style.top = '15vh'
    document.querySelector('#space_image').classList.remove('space_image')
    image.style.display = 'none'
    image.classList.remove('fade')
    captions.style.display = 'none'
    captions.classList.remove('fade_captions')
    document.querySelector('.image_container_mob_one').insertAdjacentHTML('beforebegin', `
    <div id="videowrapper" class="videowrapper">
    <video id="video" playsinline autoplay loop class="inverted">
    <source src="${assetUrl}/img/exhibitions/vbmmrdngmr/vbmmrdngmr.mp4" type="video/mp4" />
    </video>
    </div>
    `)
    document.querySelector('.right_space').insertAdjacentHTML('afterbegin', `
    <p id="close_video" class="close_video">close video  <span id="close_vid_symb"><sup>&#10005;</sup></span></p>
    `)
    if (mob) {
        videoBtn.style.display = 'none'
        document.querySelector('#vbmmrdngmr').insertAdjacentHTML('beforeend', `
    <p id="close_video_mob" class="close_video">close video</p>
    `)
        document.querySelector('#close_video_mob').addEventListener('click', videoRemove)
    }
    const video = document.querySelector('video')
    videoWrapper = document.querySelector('#videowrapper')
    document.querySelectorAll('.inverted').forEach((res) => {
        res.classList.toggle('invert')
    })
    video.onloadedmetadata = () => {
        // loadImage.classList.add('load_image_hidden')
        videoWrapper.classList.add('video_visible')
    }
    document.querySelector('.img_counter').style.opacity = '0'
    document.querySelector('#close_video').addEventListener('click', videoRemove)
    videoBtn.removeEventListener('click', videoAdd)
}

const videoAdd1 = () => {
    sendLog(`videoAdd function called on exhibition: ${exhId} video 1`)
    document.documentElement.classList.toggle('dark_mode')
    document.documentElement.style.cursor = "url('cursors/cursor_white.svg'), pointer;"
    // loadImage.style.top = '15vh'
    document.querySelector('#space_image').classList.remove('space_image')
    image.style.display = 'none'
    image.classList.remove('fade')
    captions.style.display = 'none'
    captions.classList.remove('fade_captions')
    document.querySelector('.image_container_mob_one').insertAdjacentHTML('beforebegin', `
    <div id="videowrapper" class="videowrapper">
    <div id="video" class="inverted" style="padding:56.25% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/1003391273?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" frameborder="0" allow="autoplay; picture-in-picture; clipboard-write" style="position:absolute;top:0;left:0;width:100%;height:100%;" title="Salt Salome: The Room of the Destiny (Fate)"></iframe></div><script src="https://player.vimeo.com/api/player.js"></script>
    <p id="captions_svitlosalome" class="captions">Max Svitlo - The Room of the Fugitive (Runner)</p>
    </div>
    `)
    document.querySelector('.right_space').insertAdjacentHTML('afterbegin', `
    <p id="close_video" class="close_video">close video  <span id="close_vid_symb"><sup>&#10005;</sup></span></p>
    `)
    setTimeout(() => {
        document.querySelector('#captions_svitlosalome').style.display = 'unset'
    }, 100)
    setTimeout(() => {
        document.querySelector('#captions_svitlosalome').classList.add('fade_captions')
    }, 1100)
    if (mob) {
        videoBtn1.style.display = 'none'
        videoBtn2.style.display = 'none'
        document.querySelector('#svitlosalome').insertAdjacentHTML('beforeend', `
    <p id="close_video_mob" class="close_video">close video</p>
    `)
        document.querySelector('#close_video_mob').addEventListener('click', videoRemove)
    }
    const video = document.querySelector('#video')
    videoWrapper = document.querySelector('#videowrapper')
    document.querySelectorAll('.inverted').forEach((res) => {
        res.classList.toggle('invert')
    })
    // video.onloadedmetadata = () => {
    //     // loadImage.classList.add('load_image_hidden')
    //     videoWrapper.classList.add('video_visible')
    // }
    videoWrapper.classList.add('video_visible')
    document.querySelector('#close_video').addEventListener('click', videoRemove)
    document.querySelector('.img_counter').style.opacity = '0'
    videoBtn1.removeEventListener('click', videoAdd1)
    videoBtn2.removeEventListener('click', videoAdd2)
}
const videoAdd2 = () => {
    sendLog(`videoAdd function called on exhibition: ${exhId} video 2`)
    document.documentElement.classList.toggle('dark_mode')
    document.documentElement.style.cursor = "url('cursors/cursor_white.svg'), pointer;"
    // loadImage.style.top = '15vh'
    document.querySelector('#space_image').classList.remove('space_image')
    image.style.display = 'none'
    image.classList.remove('fade')
    captions.style.display = 'none'
    captions.classList.remove('fade_captions')
    document.querySelector('.image_container_mob_one').insertAdjacentHTML('beforebegin', `
    <div id="videowrapper" class="videowrapper">
    <div id="video" class="inverted" style="padding:56.25% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/1003391330?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" frameborder="0" allow="autoplay; picture-in-picture; clipboard-write" style="position:absolute;top:0;left:0;width:100%;height:100%;" title="Salt Salome: The Room of the Destiny (Fate)"></iframe></div><script src="https://player.vimeo.com/api/player.js"></script>
    <p id="captions_svitlosalome" class="captions">Salt Salome - The Room of the Destiny (Fate)</p>
    </div>
    `)
    document.querySelector('.right_space').insertAdjacentHTML('afterbegin', `
    <p id="close_video" class="close_video">close video  <span id="close_vid_symb"><sup>&#10005;</sup></span></p>
    `)
    setTimeout(() => {
        document.querySelector('#captions_svitlosalome').style.display = 'unset'
    }, 100)
    setTimeout(() => {
        document.querySelector('#captions_svitlosalome').classList.add('fade_captions')
    }, 1100)
    if (mob) {
        videoBtn1.style.display = 'none'
        videoBtn2.style.display = 'none'
        document.querySelector('#svitlosalome').insertAdjacentHTML('beforeend', `
    <p id="close_video_mob" class="close_video">close video</p>
    `)
        document.querySelector('#close_video_mob').addEventListener('click', videoRemove)
    }
    const video = document.querySelector('#video')
    videoWrapper = document.querySelector('#videowrapper')
    document.querySelectorAll('.inverted').forEach((res) => {
        res.classList.toggle('invert')
    })
    // video.onloadedmetadata = () => {
    //     // loadImage.classList.add('load_image_hidden')
    //     videoWrapper.classList.add('video_visible')
    // }
    videoWrapper.classList.add('video_visible')
    document.querySelector('#close_video').addEventListener('click', videoRemove)
    document.querySelector('.img_counter').style.opacity = '0'
    videoBtn1.removeEventListener('click', videoAdd1)
    videoBtn2.removeEventListener('click', videoAdd2)
}
const videoAddDoina = () => {
    sendLog(`videoAdd function called on exhibition: ${exhId}`)
    document.documentElement.classList.toggle('dark_mode')
    document.documentElement.style.cursor = "url('cursors/cursor_white.svg'), pointer;"
    // loadImage.style.top = '15vh'
    document.querySelector('#space_image').classList.remove('space_image')
    image.style.display = 'none'
    image.classList.remove('fade')
    captions.style.display = 'none'
    captions.classList.remove('fade_captions')
    document.querySelector('.image_container_mob_one').insertAdjacentHTML('beforebegin', `
    <div id="videowrapper" class="videowrapper video_doina">
    <div id="video" class="inverted" style="padding:56.25% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/1016962293?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" frameborder="0" allow="autoplay; picture-in-picture; clipboard-write" style="position:absolute;top:0;left:0;width:100%;height:100%;" title="Doina Mardari - Untitled"></iframe></div><script src="https://player.vimeo.com/api/player.js"></script>
    <p id="captions_doina" class="captions captions_doina">Doina Mardari - Untitled<br>site-specific installation, silicon tubes and water, 2024</p>
    </div>
    `)
    document.querySelector('.right_space').insertAdjacentHTML('afterbegin', `
    <p id="close_video" class="close_video">close video  <span id="close_vid_symb"><sup>&#10005;</sup></span></p>
    `)
    setTimeout(() => {
        document.querySelector('#captions_doina').style.display = 'unset'
    }, 100)
    setTimeout(() => {
        document.querySelector('#captions_doina').classList.add('fade_captions')
    }, 1100)
    if (mob) {
        videoBtn.style.display = 'none'
        document.querySelector('#doinamardari').insertAdjacentHTML('beforeend', `
    <p id="close_video_mob" class="close_video">close video</p>
    `)
        document.querySelector('#close_video_mob').addEventListener('click', videoRemove)
    }
    const video = document.querySelector('#video')
    videoWrapper = document.querySelector('#videowrapper')
    document.querySelectorAll('.inverted').forEach((res) => {
        res.classList.toggle('invert')
    })
    // video.onloadedmetadata = () => {
    //     // loadImage.classList.add('load_image_hidden')
    //     videoWrapper.classList.add('video_visible')
    // }
    videoWrapper.classList.add('video_visible')
    document.querySelector('#close_video').addEventListener('click', videoRemove)
    document.querySelector('.img_counter').style.opacity = '0'
    videoBtn.removeEventListener('click', videoAddDoina)
}

const videoAddAnna = () => {
    sendLog(`videoAdd function called on exhibition: ${exhId}`)
    document.documentElement.classList.toggle('dark_mode')
    document.documentElement.style.cursor = "url('cursors/cursor_white.svg'), pointer;"
    document.querySelector('#space_image').classList.remove('space_image')
    image.style.display = 'none'
    image.classList.remove('fade')
    captions.style.display = 'none'
    captions.classList.remove('fade_captions')
    document.querySelector('.image_container_mob_one').insertAdjacentHTML('beforebegin', `
    <div id="videowrapper" class="videowrapper video_doina">
    <div id="video" class="inverted" style="padding:56.25% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/1076501776?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" frameborder="0" allow="autoplay; picture-in-picture; clipboard-write" style="position:absolute;top:0;left:0;width:100%;height:100%;" title="Anna Godzina EARTHSCAPES/ 47°44′17.8326′′N, 28°26′59.3196′′E"></iframe></div><script src="https://player.vimeo.com/api/player.js"></script>
    <p id="captions_doina" class="captions captions_doina">EARTHSCAPES/ 47°44′17.8326′′N, 28°26′59.3196′′E<br>Talanca bells, engines, arduino, 8mm film, 2024</p>
    </div>
    `)
    document.querySelector('.right_space').insertAdjacentHTML('afterbegin', `
    <p id="close_video" class="close_video">close video  <span id="close_vid_symb"><sup>&#10005;</sup></span></p>
    `)
    setTimeout(() => {
        document.querySelector('#captions_doina').style.display = 'unset'
    }, 100)
    setTimeout(() => {
        document.querySelector('#captions_doina').classList.add('fade_captions')
    }, 1100)
    if (mob) {
        videoBtn.style.display = 'none'
        document.querySelector('#annagodzina').insertAdjacentHTML('beforeend', `
    <p id="close_video_mob" class="close_video">close video</p>
    `)
        document.querySelector('#close_video_mob').addEventListener('click', videoRemove)
    }
    const video = document.querySelector('#video')
    videoWrapper = document.querySelector('#videowrapper')
    document.querySelectorAll('.inverted').forEach((res) => {
        res.classList.toggle('invert')
    })
    videoWrapper.classList.add('video_visible')
    document.querySelector('#close_video').addEventListener('click', videoRemove)
    document.querySelector('.img_counter').style.opacity = '0'
    videoBtn.removeEventListener('click', videoAddAnna)
}

const videoRemove = () => {
    sendLog(`videoRemove function called on exhibition: ${exhId}`)
    if (mob) {
        if (document.querySelector('.text_container_nohover').id == 'svitlosalome') {
            videoBtn1.style.display = 'unset'
            videoBtn2.style.display = 'unset'
        } else {
            videoBtn.style.display = 'unset'
        }
        document.querySelector('#close_video_mob').remove()
    }
    document.querySelector('.img_counter').style.opacity = 'unset'
    document.querySelector('#space_image').classList.add('space_image')
    document.documentElement.classList.toggle('dark_mode')
    document.querySelectorAll('.inverted').forEach((res) => {
        res.classList.toggle('invert')
    })
    videoWrapper.remove()
    // loadImage.style.top = 'unset'
    setTimeout(() => {
        image.style.display = 'unset'
        captions.style.display = 'unset'
    }, 900)
    setTimeout(() => {
        image.classList.add('fade')
        captions.classList.add('fade_captions')
    }, 1100)
    document.querySelector('#close_video').remove()
    if (document.querySelector('.text_container_nohover').id == 'svitlosalome') {
        videoBtn1.addEventListener('click', videoAdd1)
        videoBtn2.addEventListener('click', videoAdd2)
    } else if (document.querySelector('.text_container_nohover').id == 'doinamardari') {
        videoBtn.addEventListener('click', videoAddDoina)
    } else if (document.querySelector('.text_container_nohover').id == 'annagodzina') {
        videoBtn.addEventListener('click', videoAddAnna)
    } else {
        videoBtn.addEventListener('click', videoAdd)
    }
}