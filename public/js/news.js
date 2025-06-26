const title = document.getElementById('title')
const assetUrl = "https://d23fd8t3cgh0wq.cloudfront.net"

getNews().then(() => {
    const names = document.querySelectorAll('.text_container')
    const image = document.querySelector('.center_image_exhib')
    for (let name of names) {
        name.addEventListener('mouseenter', () => {
            image.src = `${assetUrl}/img/news/${name.firstElementChild.id}.webp`
        })
    }
})

async function getNews() {
    try {
        const response = await fetch('/getNews')
        const newsData = await response.json()
        const image = document.querySelector('.center_image_exhib')
        image.src = `${assetUrl}/img/news/${newsData[newsData.length - 1].newsname}.webp` // Image Path
        for (let one of newsData) {
            title.insertAdjacentHTML('afterend', `
        <div id="${one.newsname}" class="text_container">
        <p id="${one.newsname}" class="exhnamehidden"></p>
        <div class="names_wrapper"></div>
        <div class="news_text">
        <p class="news_description">${one.description}</p>
        <p class="news_eventname">${one.eventname}</p>
        <p class="news_location">${one.location}</p>
        <p class="news_date">${one.date}</p>
        <p class="news_website"><a href="https://${one.website}">${one.website}</a></p>
        </div></div>
        <div class="image_container_mob icm_news">
        <img class="center_image_mob" src="${assetUrl}/img/news/${one.newsname}.webp" alt="center_image">
        </div>
        `)
            namesPlace = document.querySelector(`.names_wrapper`)
            for (let name of one.namepath) {
                namesPlace.insertAdjacentHTML('beforeend', `
                <div class="names_container">
                <img class="news_name" src="${assetUrl}/img/news/namepaths/${name}">
                </div>
                `)

            }
        }
    } catch (e) {
        console.log(e)
    }
}