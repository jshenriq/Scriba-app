export default function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  req.flash("error", "Você precisa estar logado para acessar esta página");
  res.redirect("/login");
}