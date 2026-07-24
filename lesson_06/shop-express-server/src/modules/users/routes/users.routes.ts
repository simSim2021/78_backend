import { Router } from "express";

import { v7 } from "uuid";

import { User } from "../users.types";

// С помощью router в дальнейшем мы сможем прописывать
// логику ответов на запросы (router.get())
const router = Router();

// Пока мы будем хранить данные локально (без БД).
// Мы сможем использовать любые методы и они будут работать, но
// при перезагрузке сервера данные (новые) будут потеряны
const users: User[] = [
  { id: v7(), name: "Alex", email: "alex.b@mail.com", password: "123548#", role: "user", createdAt: new Date() },
    { id: v7(), name: "Nick", email: "nick.spb@mail.com", password: "258974*", role: "admin", createdAt: new Date() },
];

// GET /posts
// Так как в index.ts мы используем url /posts, то в данном
// файле мы можем не указывать каждый раз /posts, а указывать просто /
router.get("/", (_req, res)=>{
    res.status(200).json(users)
})


// GET /posts/:id (получение одного поста)
router.get("/:id", (req, res) => {
  // path param
  // params - объект с параметрами запроса
  // {id} - диструктурирующее присваивание
  const { id } = req.params;//или const id = req.params.id
  const user = users.find((user) => user.id === id);

  if (!user) {
    res.status(404).json({ error: `User with id ${id} not found` });
  }

  res.status(200).json(user);
});

// POST /users (создание user)
// {name: "", email: ""}
router.post("/", (req, res) => {
  const { name, email, password, role, createdAt } = req.body;//получаем данные из тела запроса от пользователя

  if (!name || !email || !password || !role || !createdAt) {
    res.status(400).json({ error: "Bad request" });
  }

  const user = { id: v7(), name, email, password, role, createdAt: new Date() };
  users.push(user);

  res.status(201).json(user);
});

// PATCH /users/:id (редактирование имеющегося user)
router.patch("/:id", (req, res) => {
  const { id } = req.params;
  const { name, email, password, role } = req.body;

  const user = users.find((user) => user.id === id);

  if (!user) {
    res.status(404).json({ error: `User with id ${id} not found` });
    throw new Error("Not found");
  }

  if (!name && !email && !password && !role ) {
    res.status(400).json({ error: "Bad request. No name, email, password, role" });
  }

  if (name) {
    user.name = name;
  }

  if (email) {
    user.email = email;
  }

  if (password) {
    user.password = password;
  }
  if (role) {
    user.role = role;
  }
  
  res.status(200).json(user);
});

// DELETE /posts/:id
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const user = users.find((user) => user.id === id);

  if (!user) {
    res.status(404).json({ error: `User with id ${id} not found` });
    throw new Error("Not found");
  }

  const indexOfUser = users.findIndex((user)=> user.id === id);
  users.splice(indexOfUser, 1);

  res.status(200).json(user);//возвращаем удаленный элемент
});


export default router;

