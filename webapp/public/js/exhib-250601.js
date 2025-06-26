const title = document.getElementById('title')
const assetUrl = "https://d23fd8t3cgh0wq.cloudfront.net"

getExhibs().then(() => {
    const names = document.querySelectorAll('.text_container')
    const image = document.querySelector('.center_image_exhib')
    for (let name of names) {
        name.addEventListener('mouseenter', () => {
            image.src = `${assetUrl}/img/exhibitions/${name.firstElementChild.id}.webp`
            image.onclick = () => {
                location.assign(`/exhibitions/${name.id}`)
            }
        })
    }
    const winter = () => {
        const emptyContainer = document.querySelector('#winter').childNodes[3].children
        emptyContainer[7].id = 'empty_w'
        // document.querySelector('footer').style.backgroundColor = 'white'
    }
    if (document.querySelector('#winter')) {
        winter()
    }
})

async function getExhibs() {
    try {
        const response = await fetch('/getExhibs')
        const exhibData = await response.json()
        const image = document.querySelector('.center_image_exhib')
        image.src = `${assetUrl}/img/exhibitions/${exhibData[exhibData.length - 1].exhibname}.webp` // Image Path
        image.onclick = () => {
            location.assign(`/exhibitions/${exhibData[exhibData.length - 1].exhibname}`) // URL Path
        }
        for (let one of exhibData) {
            title.insertAdjacentHTML('afterend', `
        <div id="${one.exhibname}" class="text_container" onclick=location.assign('/exhibitions/${one.exhibname}')>
        <p id="${one.exhibname}" class="exhnamehidden"></p>
        <div class="names_wrapper"></div>
        <h4 class="exhibition_date">${one.date}</h4>
        </div>
        <div class="image_container_mob">
        <img class="center_image_mob" src="${assetUrl}/img/exhibitions/${one.exhibname}.webp" alt="center_image" onclick=location.assign('/exhibitions/${one.exhibname}')>
        </div>
        `)
            namesPlace = document.querySelector(`.names_wrapper`)
            for (let name of one.namepath) {
                if (one.namepath[0] == "vbmmrdngmr.svg") {
                    namesPlace.insertAdjacentHTML('beforeend', `
                        <div class="names_container">
                        <img class="artist_name" src="${assetUrl}/img/exhibitions/namepaths/${one.namepath[0]}">
                        </div>
                        `)
                    break
                }
                namesPlace.insertAdjacentHTML('beforeend', `
                <div class="names_container">
                <img class="artist_name" src="${assetUrl}/img/exhibitions/namepaths/${name}">
                </div>
                `)

            }
        }
    } catch (e) {
        console.log(e)
    }
}