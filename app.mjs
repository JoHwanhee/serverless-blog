import express from 'express'
import path from 'path'
const __dirname = path.resolve();
const app = express()

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/post/:id', (req, res) => {
    const post = { title: '제목' + req.params.id, content: '내용' + req.params.id };
    res.render('post', { post: post });
});

app.get('/', (req, res) => {
    const posts = [
        { title: '제목1', content: '내용1' },
        { title: '제목2', content: '내용2' },
    ];
    res.render('index', { posts: posts });
});

export default app;