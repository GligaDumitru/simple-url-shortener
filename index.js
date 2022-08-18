require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = process.env.PORT || 5000;
const ShortUrl = require("./models/short");

mongoose
  .connect(process.env.MONGOOSE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log(`ERROR: Not enable to connect to DB`);
  });

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

app.get("/", async (_, res) => {
  res.render("index");
});

app.get("/count/:url", async (req, res) => {
  const url = req.params.url;
  if (!url) {
    return res.redirect("/");
  }

  const currentItem = await ShortUrl.findOne({ shortName: url });
  res.render("count", { currentItem });
});

app.get("/count", async (req, res) => {
  res.render("search-count");
});

app.get("/settings", async (req, res) => {
  const shortUrls = await ShortUrl.find();
  res.render("settings", { shortUrls });
});

app.get("/:shortUrl", async (req, res) => {
  const url = req.params.shortUrl;
  const item = await ShortUrl.findOne({ shortName: url });

  if (!item) {
    return res.sendStatus(404);
  }

  item.counts++;
  item.save();

  res.redirect(item.fullName);
});

app.post("/short", async (req, res) => {
  const newShortUrl = await ShortUrl.create({
    fullName: req.body.fullUrl,
  });

  res.render("shortener", { newShortUrl, origin: process.env.ORIGIN });
});

app.post("/count", async (req, res) => {
  let shortUrl = req.body.shortURl;

  if (!shortUrl) {
    return res.redirect("/");
  }

  shortUrl = new URL(shortUrl).pathname.replace("/", "");

  const currentItem = await ShortUrl.findOne({ shortName: shortUrl });
  res.render("count", { currentItem });
});

app.listen(port, () => console.log(`Server is running at port: ${port}`));
