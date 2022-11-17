// const bodyParser = require("body-parser");
const { json } = require('body-parser');
const express = require('express');

const STATUS_USER_ERROR = 422;

// This array of posts persists in memory across requests. Feel free
// to change this to a let binding if you need to reassign it.
let posts = [];
let id = 0;

const server = express();
// to enable parsing of json bodies for post requests
server.use(express.json());

const PATH = '/posts';

// TODO: your code to handle requests
server.get(PATH, (req, res) => {
  const { term } = req.query;
  const filteredPosts = posts.filter(post => post.title.includes(term) || post.contents.includes(term));
  res.json(term ? filteredPosts : posts);
});

server.get(`${PATH}/:author`, (req, res) => {
  const { author } = req.params;
  const authorPosts = posts.filter(post => post.author === author);
  !authorPosts.length
    ? res.status(STATUS_USER_ERROR).json({ error: 'No existe ningun post del autor indicado' })
    : res.json(authorPosts);
});

server.get(`${PATH}/:author/:title`, (req, res) => {
  const { author, title } = req.params;
  const authorPosts = posts.filter(post => post.author === author && post.title === title);
  !authorPosts.length
    ? res.status(STATUS_USER_ERROR).json({ error: 'No existe ningun post con dicho titulo y autor indicado' })
    : res.json(authorPosts);
});

server.post(PATH, (req, res) => {
  const { author, title, contents } = req.body;
  if (!author || !title || !contents)
    return res
      .status(STATUS_USER_ERROR)
      .json({ error: 'No se recibieron los parámetros necesarios para crear el Post' });

  const post = { author, title, contents, id: id++ };
  posts.push(post);
  res.json(post);
});

server.post(`${PATH}/author/:author`, function (req, res) {
  const { author } = req.params;
  const { title, contents } = req.body;
  if (!title || !contents)
    return res.status(422).json({ error: 'No se recibieron los parámetros necesarios para crear el Post' });

  const post = { author, title, contents, id: id++ };
  posts.push(post);
  res.json(post);
});

server.put(PATH, function (req, res) {
  const { title, id, contents } = req.body;
  if (!title || !contents || !id) {
    res
      .status(STATUS_USER_ERROR)
      .json({ error: 'No se recibieron los parámetros necesarios para modificar el Post' });
  } else if (!posts.some(post => post.id === parseInt(id))) {
    res.status(STATUS_USER_ERROR).json({ error: 'No existe un post con el id indicado' });
  } else {
    let post = posts.find(post => parseInt(id) === post.id);
    post.title = title;
    post.contents = contents;
    res.json(post);
  }
});

server.delete(PATH, function (req, res) {
  const { id } = req.body;
  if (!id) {
    res.status(STATUS_USER_ERROR).json({ error: 'Es necesario proporcionar un id para eliminar un post' });
  } else if (!posts.some(post => post.id === parseInt(id))) {
    res.status(STATUS_USER_ERROR).json({ error: 'No existe un post con el id indicado' });
  } else {
    const idx = posts.findIndex(post => post.id === parseInt(id));
    posts.splice(idx, 1);
    res.json({ success: true });
  }
});

server.delete(`/author`, function (req, res) {
  const { author } = req.body;
  const post = posts.some(post => post.author === author);
  if (!author) {
    res.status(STATUS_USER_ERROR).json({ error: 'Es necesario proporcionar un autor valido' });
  } else if (!post) {
    res.status(STATUS_USER_ERROR).json({ error: 'No existe el autor indicado' });
  } else {
    let deleted_post = [];
    posts = posts.filter(post => {
      if (post.author !== author) {
        return true;
      } else {
        deleted_post.push(post);
      }
    });
    res.json(deleted_post);
  }
});

module.exports = { posts, server };
