document.addEventListener("DOMContentLoaded", () => {
    const getYear = el => el?.lastElementChild?.textContent.trim().slice(-4)
    const wait = f => {
        let i = setInterval(() => {
            const ex = [...document.querySelectorAll('.text_container')]
            if (ex.length) clearInterval(i), f(ex)
        }, 100)
    }
    wait(exhibitions => {
        const years = [...new Set(exhibitions.map(getYear).filter(y => /^\d{4}$/.test(y))), "2022"].sort((a, b) => b - a)
        const rightSpace = document.querySelector('.right_space')
        const container = document.createElement('div')
        container.className = 'year_container'
        const yearElements = years.map(y => {
            const p = document.createElement('p')
            p.className = 'year'
            p.textContent = y
            container.appendChild(p)
            return p
        })
        rightSpace?.appendChild(container)
        let cur, highlight = y => yearElements.forEach(p => p.classList.toggle('hovered', p.textContent === y))
        document.addEventListener("scroll", () => {
            if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 1) return cur !== "2022" && (highlight("2022"), cur = "2022")
            const t = window.innerHeight * 0.6
            for (const el of exhibitions) {
                const r = el.getBoundingClientRect(), y = getYear(el)
                if (r.top <= t && r.bottom >= t && y && y !== cur) return highlight(y), cur = y
            }
        })
        highlight(cur = getYear(exhibitions[0]))
        yearElements.forEach((p, i) => p.onclick = () =>
            i === 0
                ? window.scrollTo({ top: 0, behavior: "smooth" })
                : i === yearElements.length - 1
                    ? window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })
                    : exhibitions.find(e => getYear(e) === p.textContent)?.scrollIntoView({ behavior: "smooth", block: "start" })
        )
    })
})