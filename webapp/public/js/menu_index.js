(function (mouseStopDelay) {
    let timeout
    document.addEventListener('mousemove', function (e) {
        clearTimeout(timeout)
        timeout = setTimeout(function () {
            let event = new CustomEvent("mousestop", {
                detail: {
                    clientX: e.clientX,
                    clientY: e.clientY
                },
                bubbles: true,
                cancelable: true
            })
            e.target.dispatchEvent(event)
        }, mouseStopDelay)
    })
}(3000));

(function (mouseStartDelay) {
    let timeout
    document.addEventListener('mousemove', function (e) {
        clearTimeout(timeout)
        timeout = setTimeout(function () {
            let event = new CustomEvent("mousestart", {
                detail: {
                    clientX: e.clientX,
                    clientY: e.clientY
                },
                bubbles: true,
                cancelable: true
            })
            e.target.dispatchEvent(event)
        }, mouseStartDelay)
    })
}(1))

const body = document.querySelector('body')

if (!mediaQueryList.matches) { body.addEventListener('mousestart', displayNavBar, { once: true }) }

body.addEventListener('mousestop', function (e) {
    navbar.className = 'navbar_hidden'
    navBtns.className = 'nav-btns_hidden'
    body.addEventListener('mousestart', displayNavBar, { once: true })
})