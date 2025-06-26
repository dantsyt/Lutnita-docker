const logo = document.querySelector('#logo_img')
const footer = document.querySelector('.footer')
const navbar = document.querySelector('#navbar')
const navBtns = document.querySelectorAll('.nav-btns')
const header = document.querySelector('.header')
const indexTitle = document.querySelector('.title')

const mediaQueryList = window.matchMedia('only screen and (max-width: 1024px)')

if (mediaQueryList.matches) {
    const pageTitle = document.querySelector('h2')
    pageTitle.addEventListener('click', () => {
        navbar.className = 'navbar'
        for (let one of navBtns) {
            one.style.visibility = 'visible'
        }
    })
    navbar.addEventListener('click', (e) => {
        if (e.target == navbar) {
            navbar.className = 'navbar_hidden'
            for (let one of navBtns) {
                one.style.visibility = 'hidden'
            }
        }
    })
} else {
    displayNavBar = () => {
        navbar.className = 'navbar'
        for (let one of navBtns) {
            one.style.visibility = 'visible'
        }
    }
    hideNavBar = () => {
        navbar.className = 'navbar_hidden'
        navBtns.className = 'nav-btns_hidden'
    }
    if (indexTitle.innerText != 'CURRENT') {
        footer.addEventListener('mouseenter', displayNavBar)
        footer.addEventListener('mouseleave', hideNavBar)
        indexTitle.addEventListener('mouseenter', displayNavBar)
        indexTitle.addEventListener('mouseleave', () => {
            setTimeout(() => {
                hideNavBar()
            }, 3000)
        })
        header.addEventListener('mouseenter', displayNavBar)
        header.addEventListener('mouseleave', () => {
            setTimeout(() => {
                hideNavBar()
            }, 3000)
        })
    }
}

document.oncontextmenu = () => { return false }