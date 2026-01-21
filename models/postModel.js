import db from "../config/db.js";

/**
 * Lista posts com paginação (load more)
 */
export async function getPosts(limit = 3, page = 1, search = '') {
  const offset = (page - 1) * limit;
  let params = [];
  let argPosition = 1; 

  let sql = `
    SELECT p.*, u.name AS author, TO_CHAR(p.created_at, 'DD/MM/YYYY') AS formatted_date
    FROM posts p
    JOIN users u ON p.user_id = u.id
  `;

  if (search) {
    sql += ` WHERE p.title ILIKE $${argPosition}`;
    params.push(`%${search}%`);
    argPosition++;
  }


  sql += ` ORDER BY p.created_at DESC LIMIT $${argPosition} OFFSET $${argPosition + 1}`;
  params.push(limit + 1, offset);

  const result = await db.query(sql, params);

  return {
    posts: result.rows.slice(0, limit),
    hasMore: result.rows.length > limit,
  };
}

/**
 * Busca posts de um usuário específico com paginação se houver mais de 10 posts
 */
export async function getPostsByUserId(userId, limit = 10, page = 1) {
  const offset = (page - 1) * limit;

  const result = await db.query(
    `SELECT p.*, u.name AS author, TO_CHAR(p.created_at, 'DD/MM/YYYY') AS formatted_date
     FROM posts p
     JOIN users u ON p.user_id = u.id
     WHERE p.user_id = $1
     ORDER BY p.created_at DESC
     LIMIT $2 OFFSET $3`,
    [userId, limit + 1, offset]
  );

  return {
    posts: result.rows.slice(0, limit),
    hasMore: result.rows.length > limit,
  };
}

/**
 * Busca um post pelo ID
 */
export async function getPostForEditPage(postId, userId) {
  const result = await db.query(
    `SELECT p.*, u.name AS author
     FROM posts p
     JOIN users u ON p.user_id = u.id
     WHERE p.id = $1 AND p.user_id = $2`,
    [postId, userId]
  );

  return result.rows[0];
}

export async function getPublicPostById(postId) {
  const result = await db.query(
    `SELECT p.*, u.name AS author
     FROM posts p
     JOIN users u ON p.user_id = u.id
     WHERE p.id = $1`, 
    [postId]
  );

  return result.rows[0];
}

/**
 * Cria novo post
 */
export async function createPost(userId, title, content, imgUrl = null) {

  imgUrl = null;

  const result = await db.query(
    `INSERT INTO posts (user_id, title, content, img_url)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [userId, title, content, imgUrl]
  );

  return result.rows[0];
}

/**
 * Atualiza post (somente dono)
 */
export async function updatePost(postId, userId, title, content, imgUrl = null) {
  const result = await db.query(
    `UPDATE posts
     SET title = $1,
         content = $2,
         img_url = $3,
         updated_at = NOW()
     WHERE id = $4 AND user_id = $5
     RETURNING *`,
    [title, content, imgUrl, postId, userId]
  );

  return result.rows[0]; // undefined se não for dono
}

/**
 * Deleta post (somente dono)
 */
export async function deletePost(postId, userId) {
  const result = await db.query(
    `DELETE FROM posts
     WHERE id = $1 AND user_id = $2`,
    [postId, userId]
  );

  return result.rowCount > 0; //retorna true ou false 
}



export async function countPostsByUserId(userId) {
    try {
        const result = await db.query(
            "SELECT COUNT(*) AS total FROM posts WHERE user_id = $1",
            [userId]
        );
        
        return parseInt(result.rows[0].total);
    } catch (error) {
        console.error("Erro ao contar posts do usuário:", error);
        throw error;
    }
}