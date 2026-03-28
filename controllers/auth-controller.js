import bcrypt from "bcryptjs";
import { getUserByEmail, createUser } from "../models/user.js";

const SALT_ROUNDS = 10;

// --- Funções exportadas (alto nível) ---

export async function renderLoginPage(req, res) {
  res.render("auth/login");
}

export async function renderRegisterPage(req, res) {
  res.render("auth/register");
}

export async function registerUser(req, res) {
  const registerFields = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  };

  if (isMissingRegisterFields(registerFields)) {
    req.flash("error", "Campos obrigatórios");
    return res.redirect("/register");
  }

  try {
    if (await checkIfUserExists(registerFields.email)) {
      req.flash("error", "Este email já está em uso");
      return res.redirect("/register");
    }

    const user = await createNewUser(registerFields);
    await loginAfterRegister(req, res, user);
  } catch (err) {
    console.error("Erro no registro de usuário:", err);
    req.flash("error", "Erro ao criar conta. Tente novamente.");
    return res.redirect("/register");
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


// --- Funções auxiliares (baixo nível) ---

function isMissingRegisterFields({ name, email, password }) {
  return !name || !email || !password;
}

async function checkIfUserExists(email) {
  const user = await getUserByEmail(email);
  return Boolean(user);
}

async function createNewUser({ name, email, password }) {
  const hashedPassword = await hashPassword(password);
  return createUser({ name, email, password: hashedPassword });
}

async function hashPassword(password) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

async function loginAfterRegister(req, res, user) {
  try {
    await new Promise((resolve, reject) => {
      req.login(user, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
    res.redirect("/dashboard");
  } catch (err) {
    console.error("Erro ao autenticar após registro:", err);
    req.flash("error", "Erro ao autenticar. Tente fazer login manualmente.");
    res.redirect("/login");
  }
}

