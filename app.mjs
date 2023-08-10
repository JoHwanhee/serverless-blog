import express from 'express'
import path from 'path'
import * as controller from "./posts/controller.mjs";

const app = express()
const __dirname = path.resolve()

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')))

app.get(['/','/index.html'], controller.renderHomepage)
app.get('/post/:id', controller.renderPost)

export default app
