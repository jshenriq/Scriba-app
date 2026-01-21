import rateLimit from "express-rate-limit";

// Limitador Geral (300 reqs / 15 min)
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  
  handler: (req, res, next, options) => {
    const retryAfter = Math.ceil(options.windowMs / 1000 / 60); 
    req.flash("error", `Muitas requisições. Tente novamente em ${retryAfter} minutos.`);
    if (req.headers.accept && req.headers.accept.includes("application/json")) {
      return res.status(429).json({ 
        message: "Muitas requisições.", 
        retryAfter: options.windowMs / 1000 
      });
    }
    const backURL = req.header('Referer') || '/';
    res.redirect(backURL) 
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Limitador Rígido (15 reqs / 1 hora)
export const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 15,
  handler: (req, res, next, options) => {
    req.flash("error", "Muitas tentativas. Tente novamente em 1 hora.");
    const backURL = req.header('Referer') || '/login'; 
    res.redirect(backURL)
  },
  standardHeaders: true,
  legacyHeaders: false,
});