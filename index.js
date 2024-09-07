const express = require("express");
const path = require("path");
const userRoute = require("./routes/user.route");
const blogRoute = require("./routes/blog.route");
const connectDB = require("./config/dbconnect");
const cookieParser = require("cookie-parser");
const checkForCookieAuthentication = require("./middlewares/auth");
const Blog = require("./models/blog.model");

const app = express();
const PORT = 8000;

// database connection
connectDB("mongodb://127.0.0.1:27017/blogpost");

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForCookieAuthentication("token"));
app.use(express.static(path.resolve("./public")));

app.get("/", async (req, res) => {
  const allBlogs = await Blog.find({});
  res.render("home", {
    user: req.user,
    blogs: allBlogs,
  });
});

app.use("/user", userRoute);
app.use("/blog", blogRoute);

app.listen(PORT, () => {
  console.log(`Server Started at PORT: ${PORT}`);
});
