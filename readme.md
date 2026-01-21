# ✍️ Scriba App - Express & PostgreSQL 🚀

<div align="center">
  <p>
    <a href="#portuguese">Leia em Português</a> • 
    <a href="#english">Read in English</a> • 
    <a href="#"><strong>VER DEMO AO VIVO</strong></a>
  </p>

  ## 📺 Demo
  <img src="./public/images/demo.gif" alt="Scriba App Demo" width="100%">
</div>

---
<div id="portuguese"></div>

## 🇧🇷 Português 

Este é um projeto de Blog completo desenvolvido para colocar em prática conceitos de autenticação, banco de dados relacional e deploy em nuvem. O projeto utiliza Node.js com Express no backend e PostgreSQL para persistência de dados.

### 🛠 Tecnologias
- **Backend:** Node.js & Express
- **Banco de Dados:** PostgreSQL (Supabase)
- **Autenticação:** Passport.js (Local Strategy) & Bcrypt
- **View Engine:** EJS
- **Deploy:** Vercel

### 🔑 Funcionalidades
- **Autenticação:** Cadastro e login de usuários com sistema de sessões seguras via cookies.
- **Gestão de Conteúdo:** Criação de posts com título e conteúdo armazenados em PostgreSQL.
- **Proteção de Rotas:** Restrição de acesso a áreas sensíveis apenas para usuários autenticados.
- **Segurança:** Implementação de *Rate Limiting* em endpoints críticos para proteção contra ataques automatizados e força bruta.
- **Busca em Tempo Real:** Filtragem dinâmica de posts instantaneamente conforme o usuário digita.

### 🚀 Como rodar o projeto
1. Clone o repositório.
2. Rode `npm install` para instalar as dependências.
3. Configure o banco de dados PostgreSQL e execute o arquivo `schema.sql` localizado no diretório `/config` para criar as tabelas.
4. Configure o arquivo `.env` com as suas credenciais do PostgreSQL e o `SESSION_SECRET`.
5. Rode `npm start` ou `node app.js`.

---
## 📄 Licença
Este projeto está sob a licença **MIT**. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

Desenvolvido por **Henrique** 🚀

<br>
<br>
<br>
---

<div id="english"></div>

## 🇺🇸 English 

This is a full-stack Blog project developed to practice concepts of authentication, relational databases, and cloud deployment. The project uses Node.js with Express for the backend and Supabase (PostgreSQL) for data persistence.

### 🛠 Tech Stack
- **Backend:** Node.js & Express
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Passport.js (Local Strategy) & Bcrypt
- **View Engine:** EJS
- **Deployment:** Vercel

### 🔑 Features
- **Authentication:** User registration and login with secure cookie-based session management.
- **Content Management:** Post creation with title and content stored in PostgreSQL.
- **Route Protection:** Private routes restricted to authenticated users only.
- **Security:** *Rate Limiting* on critical endpoints to protect against automated and brute-force attacks.
- **Live Search:** Dynamic post filtering in real-time as the user types.

### 🚀 How to run
1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Set up your PostgreSQL database and run the `schema.sql` file located in the `/config` directory to create the tables.
4. Setup your `.env` file with PostgreSQL credentials and `SESSION_SECRET`.
5. Run `npm start` or `node app.js`.

---

## 📄 License
This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

Developed by **Henrique** 🚀