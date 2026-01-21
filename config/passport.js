import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import { getUserByEmail, getUserById } from "../models/userModel.js";

//login authentication
passport.use(
  new LocalStrategy({ usernameField: "email" }, async (email, password, done) => {
    try {
      const user = await getUserByEmail(email);
      if (!user) return done(null, false, { message: "Email ou senha inválidos" });

      const match = await bcrypt.compare(password, user.password);
      if (!match) return done(null, false, { message: "Email ou senha inválidos" });

      delete user.password;
      done(null, user);
    } catch (err) {
      done(err);
    }
  })
);

passport.serializeUser((user, done) => {
    done(null, user); 
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// passport.serializeUser((user, done) => done(null, user.id));
// passport.deserializeUser(async (id, done) => {
//   try {
//     // const user = await getUserById(id);
//     done(null, user);
//   } catch (err) {
//     done(err);
//   }
// });

export default passport;