const list = document.getElementById('artist_list')
const imgWrapper = document.querySelector('.img_wrapper')
const assetUrl = "https://d23fd8t3cgh0wq.cloudfront.net"

getArtists().then(() => {
    const names = document.querySelectorAll('.text_container')
    const image = document.querySelector('.center_image_exhib')
}).catch((e) => { console.log(e) })

async function getArtists() {
    try {
        const response = await fetch('/getArtists')
        const artistsData = await response.json()
        const image = document.querySelector('.center_image_exhib')
        for (let one of artistsData) {
            list.insertAdjacentHTML('afterbegin', `
            <div id="${one.fullname.toLowerCase()}" class="text_container text_container_artists" onclick=location.assign('/artists/${one.fullname.toLowerCase()}')>
            <p id="${one.fullname.toLowerCase()}" class="exhnamehidden"></p>
            <div class="names_wrapper">
            <div class="names_container">
            <img class="artist_name" src="${assetUrl}/img/artists/namepaths/${one.namepath}"></div></div></div>
            `)
        }
    } catch (e) {
        console.log(e)
    }
}