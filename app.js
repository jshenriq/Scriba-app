import express from "express";
import session from "express-session";
import flash from "connect-flash";
import passport from "passport";


import "./config/db.js";
import "./config/passport.js";


import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import pageRoutes from "./routes/pageRoutes.js";

import errorHandler from "./middlewares/errorHandler.js";

const app = express();


app.set('trust proxy', 1);
app.set("view engine", "ejs");


//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 24 // 1 dia
    }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
app.use((req, res, next) => {
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    res.locals.user = req.user || false;
    next();
})



app.use("/", pageRoutes);
app.use("/", authRoutes);
app.use("/", postRoutes);

app.use(errorHandler);

if (process.env.NODE_ENV !== 'production') {
    app.listen(3000, () => {
        console.log("Server running on http://localhost:3000");
    });
}

export default app; // ESSENCIAL para a Vercel