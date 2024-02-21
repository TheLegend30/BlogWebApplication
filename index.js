import express from "express";
import fileUpload from "express-fileupload";
const app = express();
const port = 3000;

class Post {
  constructor(title, description, image) {
    this.title = title;
    this.description = description;
    this.image = image;
    this.date = new Date().toLocaleDateString("en-US");
  }
}

let posts = [];

app.use(fileUpload());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.listen(port, () => {
  console.log(`Server's running on port ${port}`);
});

app.get("/", (req, res) => {
  res.render("index.ejs", { content: posts });
});

app.get("/read/:id", (req, res) => {
  res.render("read.ejs", {
    page: req.url,
    content: posts,
  });
});

app.get("/create", (req, res) => {
  res.render("create.ejs");
});

app.get("/delete/:id", (req, res) => {
  posts.splice(req.params.id, 1);
  res.redirect("/");
});

app.get("/edit/:id", (req, res) => {
  res.render("edit.ejs", { content: posts, pageNum: req.params.id });
});

app.post("/submit", (req, res) => {
  const file = req.files.image;
  file.mv("./public/images/" + posts.length + ".png");

  posts.push(
    new Post(
      req.body.title,
      req.body.description,
      "/images/" + posts.length + ".png"
    )
  );
  res.redirect("/");
});

app.post("/change/:id", (req, res) => {
  let pageNum = req.params.id;
  const file = req.files.image;
  file.mv("./public/images/" + posts.length + ".png");

  posts[pageNum] = new Post(
    req.body.title,
    req.body.description,
    "/images/" + posts.length + ".png"
  );
  res.redirect("/");
});
