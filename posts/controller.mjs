import {getAllPosts, getDetailedPost} from "./postsService.mjs";

const renderHomepage = async (req, res) => {
    const posts = await getAllPosts();
    res.render('index', { posts });
};

const renderPost = async (req, res) => {
    const post = await getDetailedPost(req.params.id);
    res.render('post', { post });
};

export { renderHomepage, renderPost };
