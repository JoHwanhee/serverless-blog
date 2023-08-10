import express from 'express'
import path from 'path'

const app = express()
const __dirname = path.resolve()

// App configuration
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')))

// Route Handlers
const renderHomepage = (req, res) => {
    const posts = [
        { title: '제목1', content: '내용1' },
        { title: '제목2', content: '내용2' },
    ]
    res.render('index', { posts })
}

const renderPost = (req, res) => {
    const post = { title: '제목' + req.params.id, content: '내용' + req.params.id }
    res.render('post', { post })
}

// Routes
app.get(['/','/index.html'], renderHomepage) // Combine routes that render the same content
app.get('/post/:id', renderPost)

export default app
