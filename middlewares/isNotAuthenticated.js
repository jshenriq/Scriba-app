export default function isNotAuthenticated(req, res, next) {
    if (req.user) {
        return res.redirect("/dashboard");
    }
    next();
}