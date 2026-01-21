import * as PostModel from "../models/postModel.js";


//controller to render pages
export async function renderDashboardPage(req, res) {
  try {
    const userId = req.user.id;
    const { posts, hasMore } = await PostModel.getPostsByUserId(userId, 10, 1);
    res.render("posts/dashboard", { posts, hasMore });
  } catch (error) {
    console.error("Erro ao carregar posts na pagina dashBoard:", error);
    res.render("posts/dashboard", { posts: [], hasMore: false});
  }
}

export async function renderCreatePostPage(req, res) {
  res.render("posts/create");
}

export async function renderEditPage(req, res) {
  try {
    const postId = req.params.id;
    const userId = req.user.id;
    const post = await PostModel.getPostForEditPage(postId, userId);
    
    if (!post) {
      req.flash("error", "Você não tem permissão para editar este post ou ele não existe!");
      return res.redirect("/dashboard");
    }
    
    res.render("posts/edit", { post });
  } catch (error) {
    console.error("Erro ao carregar post para edição:", error);
    req.flash("error", "Ocorreu um erro interno no servidor.");
    res.redirect("/dashboard");
  }
}




export async function editPost(req, res) {
  const postId = req.params.id;
  const { title, content } = req.body;
  const userId = req.user.id;

  if (!title || !content) {
    req.flash("error", "Titulo e conteúdo são obrigatórios");
    return res.redirect(`/edit/${postId}`);
  }

  try {
    await PostModel.updatePost(postId, userId, title, content, null);
    req.flash("success", "Post atualizado com sucesso!");
    res.redirect(`/edit/${postId}`);
  } catch (err) {
    console.error("Erro ao editar post:", err);
    req.flash("error", "Erro ao editar post");
    res.redirect(`/edit/${postId}`);
  }
}

export async function createPost(req, res) {
  try {
    const { title, content, imgUrl } = req.body;
    const userId = req.user.id;
    
    if (!title || !content) {
      req.flash("error", "Título e conteúdo são obrigatórios");
      return res.redirect("/create");
    }

    //limitar a quantidade de posts que um usuário pode criar
    const totalPosts = await PostModel.countPostsByUserId(userId);
    if (totalPosts >= 5) {
      req.flash("error", "Você já atingiu o limite máximo de 5 posts.");
      return res.redirect("/dashboard");
    }

    await PostModel.createPost(userId, title, content, imgUrl || null);
    req.flash("success", "Post criado com sucesso!");
    res.redirect("/dashboard");
  } catch (error) {
    console.error("Erro ao criar post:", error);
    req.flash("error", "Erro ao criar post");
    res.redirect("/create");
  }
}

//PARA AJAX/API
export async function getDashboardPostsApi(req, res) {
  const userId = req.user.id;
  const page = parseInt(req.query.page) || 1;
  const limit = 10;

  try {
    const { posts, hasMore } = await PostModel.getPostsByUserId(userId, limit, page);
    res.json({ posts, hasMore });
  } catch (error) {
    console.error("Erro na API do dashboard:", error);
    res.status(500).json({ error: "Erro ao carregar posts" });
  }
}


// Para AJAX/API
export async function deletePostApi(req, res) {
  const userId = req.user.id;
  const postId = req.params.id;

  try {
    const deleted = await PostModel.deletePost(postId, userId);

    if (!deleted) {
      return res.status(403).json({ success: false, message: "Erro ao tentar deletar post" });
    }

    res.json({ success: true });
  } catch (err) {
    console.error("Erro ao deletar post: ", err.message);
    res.status(500).json({ success: false, message: "Erro interno do servidor" });
  }
}
