const isProduction = process.env.NODE_ENV === 'production'
const bodyParser = require('koa-bodyparser')
const controller = require('./controller')
const templating = require('./templating')
const Koa = require('Koa')
const app = new Koa()
app.use(async (ctx, next) => {
    console.log('Process ${ctx.request.method} ${ctx.request.url}...')
    var start = new Date().getTime(),
        execTime
    await next()
    execTime = new Date().getTime() - start
    ctx.response.set('X-response-Time', '${execTime}ms')
})

if (! isProduction) {
    let staticFiles = require('./static-files')
    app.use(staticFiles('/static', __dirname + '/static'))
}

app.use(bodyParser())

app.use(templating('views', {
    noCache: !isProduction,
    watch: !isProduction
}))
app.use(controller())
app.listen(3002)
console.log('app started at port 3000')
