import * as PostModel from "../models/postModel.js"; //importa as funções pra posts.

//public pages
export async function renderHome(req, res) {
  try {
    const { posts, hasMore } = await PostModel.getPosts(3, 1);
    res.render("index", { posts, hasMore });
  } catch (error) {
    console.error("Erro ao carregar a home:", error);
    res.render("index", { posts: [], hasMore: false });
  }
}


export async function showPost(req, res) {
  const postId = req.params.id;
  const post = await PostModel.getPublicPostById(postId);
  try {
    if (!post) {
    return res.status(404).render('404', { title: 'Post não encontrado' });
  }
    res.render('post', { post });
  } catch (err) {
    console.error("Erro ao abrir o post:", err);
    res.status(500).send("Erro interno do servidor");
  }
}

//carregar posts pra pagina home
export async function getPostsApi(req, res) {
  const page = parseInt(req.query.page) || 1;
  const search = req.query.search || '';

  
  const limit = search ? 6 : 3;

  try {
    const { posts, hasMore } = await PostModel.getPosts(limit, page, search);
    res.json({ posts, hasMore });
  } catch (error) {
    console.error("Erro na API de posts:", error);
    res.status(500).json({ error: "Erro ao carregar posts" });
  }
}
