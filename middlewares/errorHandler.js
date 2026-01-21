export default function errorHandler(err, req, res, next) {
  console.error("Erro não tratado:", err);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || "Erro interno do servidor";
  
  // Se for uma requisição AJAX/API, retorna JSON
  if (req.xhr || req.headers.accept?.includes('application/json')) {
    return res.status(statusCode).json({
      error: message,
      statusCode: statusCode
    });
  }
  
  // Caso contrário, renderiza uma página de erro
  res.status(statusCode).render("error", {
    statusCode: statusCode,
    message: message
  });
}
