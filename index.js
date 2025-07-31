import express from "express";
import bodyParser  from "body-parser";
import path from 'path';
import { fileURLToPath } from 'url';


const app = express();
const port = 3000;
let posts = [];

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.static('public'));


app.get('/', (req, res) => {
    res.render('index.ejs', { posts: posts});
});

app.get('/about', (req, res) => {
    res.render('about.ejs', { posts: posts });
  });


app.get('/createpost', (req, res) => {
  res.render('createpost.ejs', { posts: posts });
})  

app.post('/submit', (req, res) => {
  const { Post_Header, Post_Body } = req.body;

  if (!Post_Header || !Post_Body){
    return res.status(400).send('Missing required fields');

  }
  const newPost = {Post_Header, Post_Body};
  posts.push(newPost);
  const newPostIndex = posts.length -1;

  res.redirect('/posts/' + newPostIndex);

});

app.get('/posts/edit/:id', (req, res) => {
  const postIndex = parseInt(req.params.id);
  if (postIndex >= 0 && postIndex < posts.length) {
      const post = posts[postIndex];
      res.render('editpost', { post: post, postIndex: postIndex, posts: posts});
  } else {
      res.status(404).send('Post not found');
  }
});

app.post('/posts/update/:id', (req, res) => { 
  const postIndex = parseInt(req.params.id);
  if (postIndex >= 0 && postIndex < posts.length) {
      const { Post_Header, Post_Body } = req.body;
      posts[postIndex].Post_Header = Post_Header; 
      posts[postIndex].Post_Body = Post_Body;
      res.redirect(`/posts/${postIndex}`); 
  } else {
      res.status(404).send('Post not found');
  }
});

app.post('/posts/delete/:id', (req, res) => {
  const postIndex = parseInt(req.params.id);
  if (postIndex >= 0 && postIndex < posts.length) {
      posts.splice(postIndex, 1);
      res.redirect('/');
  } else {
      res.status(404).send('Post not found');
  }
});

app.get('/posts/:id', (req, res) => {

  const postId = parseInt(req.params.id); 
  if (postId >= 0 && postId < posts.length) {
      const post = posts[postId];
      res.render('post.ejs', { post: post, postIndex: postId, posts: posts });
  } else {
      res.status(404).send('Post not found');
  }
} )


app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });


  module.exports = app