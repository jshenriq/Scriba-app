import bcrypt from "bcryptjs";
import { getUserByEmail, createUser } from "../models/userModel.js";

const saltRounds = 10;

export async function renderLoginPage(req, res) {
  res.render("auth/login");
}

export async function renderRegisterPage(req, res) {
  res.render("auth/register");
}

//(POST) do formulario de registro
export async function registerUser(req, res) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    req.flash("error", "Campos obrigatórios");
    return res.redirect("/register");
  }

   try {
    const checkUser = await getUserByEmail(email);
    if (checkUser) {
      req.flash("error", "Este email já está em uso");
      return res.redirect("/register");
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = await createUser(name, email, hashedPassword);

    // LOGIN AUTOMÁTICO APÓS REGISTRO
    req.login(user, (err) => {
      if (err) {
        console.error(err);
        req.flash("error", "Erro ao autenticar");
        return res.redirect("/login");
      }

      return res.redirect("/dashboard");
    });


  } catch (err) {
    console.error("Erro no registro de usuário: ", err);
    req.flash("error", "Erro ao criar conta. Tente novamente.");
    res.redirect("/register");
  }
}

export function logout(req, res) {
  req.logout((err) => {
    if (err) {
      console.error("Erro ao fazer logout:", err);
      return res.status(500).send("Erro ao fazer logout");
    }
    res.redirect("/login");
  });
}