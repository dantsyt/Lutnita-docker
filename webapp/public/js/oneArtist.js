const title = document.querySelector('#title')
const artistPath = window.location.pathname
const artistId = artistPath.substring(artistPath.indexOf('/', 1) + 1, artistPath.length)
const imgContainer = document.querySelector('.image_container')
videoWrapper = document.querySelector('#videowrapper')
const textSection = document.querySelector('.text_section')
linked = false
const assetUrl = "https://d23fd8t3cgh0wq.cloudfront.net"

getOneArtist(artistId).then(() => {
    if (mediaQueryList.matches) {
        mob = true
        image = document.querySelector('.mob_one_exhib')
    } else {
        mob = false
        image = document.querySelector('#main_image')
    }
    captions = document.querySelector('#captions_desk')
    const viewsCount = document.querySelector('#counter_num')
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
    // ExhibLink Mob
    if (linked && mob) {
        document.querySelector('.text_container_nohover').insertAdjacentHTML('afterend', `
        <div id="exhib_link_mob" class="exhib_link exhib_link_mob">
        <h6 class="exhib_link_text">Exhibition</h6>
        <h4 id="artist_exhib_date" class="exhibition_date">${oneExhib.date}</h4>
        </div>
        `)
    }
    // ExhibLink click
    if (linked) {
        const exhibLink = document.querySelector('.exhib_link')
        exhibLink.onclick = () => {
            location.assign(`/exhibitions/${oneExhib.exhibname}`)
        }
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

    // Image and video preloading
    let nextImageElement = new Image()
    let prevImageElement = new Image()
    let nextVideoElement = document.createElement('video')
    let prevVideoElement = document.createElement('video')

    const preloadNextMedia = (src) => {
        if (src.endsWith('.mp4')) {
            nextVideoElement.src = src
        } else {
            nextImageElement.src = src
        }
    }

    const preloadPrevMedia = (src) => {
        if (src.endsWith('.mp4')) {
            prevVideoElement.src = src
        } else {
            prevImageElement.src = src
        }
    }

    const initPrevCounter = (imgArr.length - 1)
    const initPrevMediaUrl = mob ? `${imgDirMob}/${imgArrMob[initPrevCounter]}` : `${imgDir}/${imgArr[initPrevCounter]}`
    preloadPrevMedia(initPrevMediaUrl)

    const initNextCounter = 1
    const initNextMediaUrl = mob ? `${imgDirMob}/${imgArrMob[initNextCounter]}` : `${imgDir}/${imgArr[initNextCounter]}`
    preloadNextMedia(initNextMediaUrl)

    function sendLog(message) {
        fetch('/log', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message })
        }).catch(error => console.error('Error logging message:', error))
    }

    const nextImage = () => {
        counter++
        if (videoWrapper) {
            videoWrapper.remove()
            image.style.display = 'unset'
        }
        if (counter == imgArr.length) {
            counter = 0
        }
        image.classList.remove('fade')
        const nextMediaUrl = mob ? `${imgDirMob}/${imgArrMob[counter]}` : `${imgDir}/${imgArr[counter]}`
        captions.classList.remove('fade_captions')
        preloadNextMedia(nextMediaUrl)  // Preload the next media

        if (nextMediaUrl.endsWith('.mp4')) {
            if (document.querySelector('.content-wrapper')) {
                document.querySelector('.content-wrapper').remove()
            }
            image.style.display = 'none'
            document.querySelector('.image_container_mob_one').insertAdjacentHTML('beforebegin', `
                <div class="content-wrapper">
                <div class="placeholder">
                <div class="animated-background"></div>
                </div>
                </div>
                <div id="videowrapper" class="videowrapper artist_video">
                <video id="video" autoplay loop playsinline class="inverted">
                <source src=${nextMediaUrl} type="video/mp4" />
                </video>
                </div>
                `)
            const video = document.querySelector('video')
            video.onloadedmetadata = () => {
                document.querySelector('.content-wrapper').classList.add('load_image_hidden')
                videoWrapper = document.querySelector('#videowrapper')
                setTimeout(() => {
                    videoWrapper.classList.add('video_visible')
                }, 50)
                setTimeout(() => {
                    captions.classList.add('fade_captions')
                    document.querySelector('.content-wrapper').remove()
                }, 700)
                captions.innerText = captionsArr[counter].replace(/\\n/g, '\n')
                viewsCount.innerText = ` ${counter + 1}`
                const nextCounter = (counter + 1) % imgArr.length
                const nextNextMediaUrl = mob ? `${imgDirMob}/${imgArrMob[nextCounter]}` : `${imgDir}/${imgArr[nextCounter]}`
                preloadNextMedia(nextNextMediaUrl)
            }
            video.onclick = (e) => {
                let center = video.clientWidth / 2
                if (e.offsetX > center) {
                    nextImage()
                } else {
                    prevImage()
                }
            }
            detectSwipe(video, function (direction) {
                if (direction === 'left') {
                    nextImage()
                } else if (direction === 'right') {
                    prevImage()
                }
            })
        } else {
            image.src = nextMediaUrl
            image.onload = () => {
                setTimeout(() => {
                    image.classList.add('fade')
                }, 50)
                setTimeout(() => {
                    captions.classList.add('fade_captions')
                }, 700)
                captions.innerText = captionsArr[counter].replace(/\\n/g, '\n')
                viewsCount.innerText = ` ${counter + 1}`
                const nextCounter = (counter + 1) % imgArr.length
                const nextNextMediaUrl = mob ? `${imgDirMob}/${imgArrMob[nextCounter]}` : `${imgDir}/${imgArr[nextCounter]}`
                preloadNextMedia(nextNextMediaUrl)
            }
        }
        sendLog(`nextImage function called on artist: ${artistId}, counter: ${counter + 1}`)
    }

    const prevImage = () => {
        counter--
        if (videoWrapper) {
            videoWrapper.remove()
            image.style.display = 'unset'
        }
        image.classList.remove('fade')
        if (counter == -1) {
            counter = imgArr.length - 1
        }
        captions.classList.remove('fade_captions')
        const prevMediaUrl = mob ? `${imgDirMob}/${imgArrMob[counter]}` : `${imgDir}/${imgArr[counter]}`
        preloadPrevMedia(prevMediaUrl)  // Preload the previous media

        if (prevMediaUrl.endsWith('.mp4')) {
            if (document.querySelector('.content-wrapper')) {
                document.querySelector('.content-wrapper').remove()
            }
            image.style.display = 'none'
            document.querySelector('.image_container_mob_one').insertAdjacentHTML('beforebegin', `
                <div class="content-wrapper">
                <div class="placeholder">
                <div class="animated-background"></div>
                </div>
                </div>
                <div id="videowrapper" class="videowrapper artist_video">
                <video id="video" playsinline autoplay loop class="inverted">
                <source src=${prevMediaUrl} type="video/mp4" />
                </video>
                </div>
                `)
            const video = document.querySelector('video')
            video.onloadedmetadata = () => {
                document.querySelector('.content-wrapper').classList.add('load_image_hidden')
                videoWrapper = document.querySelector('#videowrapper')
                setTimeout(() => {
                    videoWrapper.classList.add('video_visible')
                }, 50)
                setTimeout(() => {
                    captions.classList.add('fade_captions')
                    document.querySelector('.content-wrapper').remove()
                }, 700)
                captions.innerText = captionsArr[counter].replace(/\\n/g, '\n')
                viewsCount.innerText = ` ${counter + 1}`
                const prevCounter = (counter - 1) % imgArr.length
                const prevPrevMediaUrl = mob ? `${imgDirMob}/${imgArrMob[prevCounter]}` : `${imgDir}/${imgArr[prevCounter]}`
                preloadPrevMedia(prevPrevMediaUrl)
            }
            video.onclick = (e) => {
                let center = video.clientWidth / 2
                if (e.offsetX > center) {
                    nextImage()
                } else {
                    prevImage()
                }
            }
            detectSwipe(video, function (direction) {
                if (direction === 'left') {
                    nextImage()
                } else if (direction === 'right') {
                    prevImage()
                }
            })
        } else {
            image.src = prevMediaUrl
            image.onload = () => {
                setTimeout(() => {
                    image.classList.add('fade')
                }, 50)
                setTimeout(() => {
                    captions.classList.add('fade_captions')
                }, 700)
                captions.innerText = captionsArr[counter].replace(/\\n/g, '\n')
                viewsCount.innerText = ` ${counter + 1}`
                const prevCounter = (counter - 1) % imgArr.length
                const prevPrevMediaUrl = mob ? `${imgDirMob}/${imgArrMob[prevCounter]}` : `${imgDir}/${imgArr[prevCounter]}`
                preloadPrevMedia(prevPrevMediaUrl)
            }
        }
        sendLog(`prevImage function called on artist: ${artistId}, counter: ${counter + 1}`)
    }
}).catch((e) => { console.log(e.message) })

async function getOneArtist(artist) {
    try {
        const response = await fetch(`/getOneArtist/${artist}`)
        const oneArtist = await response.json()
        try {
            const respone_exhib = await fetch(`/getOneExhib/${artist}`)
            oneExhib = await respone_exhib.json()
            if (oneArtist.fullname == oneExhib.exhibname) {
                linked = true
            } else { linked = false }
        } catch (e) {
            console.log(e)
        }
        imgArr = oneArtist.imgpath
        imgArrMob = oneArtist.imgpathmob
        captionsArr = oneArtist.captions
        const countTotal = imgArr.length
        imgDir = `${assetUrl}/img/artists/${oneArtist.fullname}`
        imgDirMob = `${assetUrl}/img/artists/${oneArtist.fullname}/mob`
        // Append TEXT to desktop
        title.insertAdjacentHTML('afterend', `
        <div id="${oneArtist.fullname}" class="text_container_nohover">
        <div class="names_wrapper"><div class="names_container">
        <img class="artist_name" src="${assetUrl}/img/artists/namepaths/${oneArtist.namepath}"></div></div>
        <h6 class="pdf_mob"><a href="pdf/bio/${oneArtist.fullname}.pdf" target="_blank">bio</a></h6>
        </div>
        <div class="img_counter">
        <p id="counter_text" class="counters">Works</p>
        <p class="counters"><span id="counter_num"> 1</span>/<span id="counter_total">${countTotal}</span></p>
        </div>
        <h6 class="pdf"><a href="pdf/bio/${oneArtist.fullname}.pdf" target="_blank">bio</a></h6>
        `)
        // Append images MOB
        imgContainer.insertAdjacentHTML('beforeend', `
        <div class="image_container_mob_one">
        <img class="center_image_mob mob_one_exhib" src="${imgDirMob}/${imgArrMob[0]}" alt="center_image">
        </div>
        `)
        // Append images DESK
        imgContainer.insertAdjacentHTML('afterbegin', `
        <img id="main_image" class="center_image_exhib center_image_one_exhib" src="${imgDir}/${imgArr[0]}" alt="center_image">
        `)
        imgContainer.insertAdjacentHTML('beforeend', `
        <p id="captions_desk" class="captions">${captionsArr[0].replace(/\n/g, '<br>')}</p>
            `)
        // Append Exhib link
        if (linked) {
            textSection.insertAdjacentHTML('beforeend', `
        <div id="exhib_link" class="exhib_link">
        <h6 class="exhib_link_text">Exhibition</h6>
        <h4 id="artist_exhib_date" class="exhibition_date">${oneExhib.date}</h4>
        </div>
        `)
        }
    } catch (e) {
        console.log(e)
    }
}