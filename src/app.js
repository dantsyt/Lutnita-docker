const path = require('node:path')
const express = require('express')
const hbs = require('hbs')
const port = process.env.PORT || 3000

// DB, routers, logger
require('./db/mongoose')
const artistsDBRouter = require('./routers/artistDBRouter')
const artistsRouter = require('./routers/artistRouter')
const exhibDBRouter = require('./routers/exhibitionDBRouter')
const exhibRouter = require('./routers/exhibitionRouter')
const newsDBRouter = require('./routers/newsDBRouter')
const newsRouter = require('./routers/newsRouter')
const logger = require('./logger')
const { morganMiddleware, ipMiddleware } = require('./morganMiddleware')

const app = express()

// Paths setup
const templatesPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')
const publicPath = path.join(__dirname, '../public')
const sitemapPath = path.join(__dirname, '../sitemap.xml')

// Handlebars engine and views setup
app.set('view engine', 'hbs')
app.set('views', templatesPath)
hbs.registerPartials(partialsPath)

// HTTPs redirect

// app.use((req, res, next) => {
//     if (req.header('x-forwarded-proto') !== 'https')
//       res.redirect(`https://${req.header('host')}${req.url}`)
//     else
//       next()
//   })

// Set static directory and routers

app.use(express.static(publicPath))
app.use(ipMiddleware)
app.use(artistsDBRouter)
app.use(exhibDBRouter)
app.use(newsDBRouter)
app.use(morganMiddleware)

app.post('/log', (req, res) => {
    const { message } = req.body
    if (message) {
        logger.info(message, { originalsourceip: req.originalsourceip })
        res.status(200).send('Log received')
    } else {
        res.status(400).send('No message provided')
    }
})

app.get('/', (req, res) => {
    logger.info('Request for home page', { originalsourceip: req.originalsourceip })
    res.render('upcoming', {
        title: 'Current'
    })
})
app.use('/artists', artistsRouter)
app.use('/news', newsRouter)
app.get('/info', (req, res) => {
    res.render('info', {
        title: 'Info'
    })
})
app.use('/exhibitions', exhibRouter)
app.get('/team', (req, res) => {
    res.render('team', {
        title: 'team'
    })
})
app.get('/sitemap.xml', (req, res) => {
    res.sendFile(sitemapPath)
})
app.get('*', (req, res) => {
    res.render('404', {
        title: '404'
    })
})

app.use((err, req, res, next) => {
    logger.error(
        err.message,
        {
            error: err,
            stackTrace: err.stack
        }
    ),
        res.status(500).send('Internal server error')
})

app.listen(port, () => {
    logger.info(`LISTENING on ${port}`)
})
