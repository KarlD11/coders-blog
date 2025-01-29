import express from "express";
import bodyParser  from "body-parser";
import path from 'path';
import { fileURLToPath } from 'url'; // Import fileURLToPath


const app = express();
const port = 3000;
let posts = [];

const __filename = fileURLToPath(import.meta.url); // Get the current filename
const __dirname = path.dirname(__filename); // Get the current directory



app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.static('public'));

app.post('/posts/delete/:id', (req, res) => {
  const postIndex = parseInt(req.params.id);
  if (postIndex >= 0 && postIndex < posts.length) {
      posts.splice(postIndex, 1); // Remove the post from the array
      res.redirect('/'); // Redirect back to the main page
  } else {
      res.status(404).send('Post not found');
  }
});

app.get('/posts/edit/:id', (req, res) => { // Route for editing a post
  const postIndex = parseInt(req.params.id);
  if (postIndex >= 0 && postIndex < posts.length) {
      const post = posts[postIndex];
      res.render('editpost', { post: post, postIndex: postIndex, posts: posts}); // Render the edit form
  } else {
      res.status(404).send('Post not found');
  }
});

app.post('/posts/update/:id', (req, res) => { // Route for updating a post
  const postIndex = parseInt(req.params.id);
  if (postIndex >= 0 && postIndex < posts.length) {
      const { Post_Header, Post_Body } = req.body;
      posts[postIndex].Post_Header = Post_Header; // Update the post data
      posts[postIndex].Post_Body = Post_Body;
      res.redirect(`/posts/${postIndex}`); // Redirect back to the post view
  } else {
      res.status(404).send('Post not found');
  }
});


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

app.get('/posts/:id', (req, res) => {

  const postId = parseInt(req.params.id); // Get the post ID from the URL
  if (postId >= 0 && postId < posts.length) {
      const post = posts[postId];
      res.render('post.ejs', { post: post, postIndex: postId, posts: posts }); // Render post.ejs with the post data
  } else {
      res.status(404).send('Post not found'); // Handle invalid post IDs
  }
} )


app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
