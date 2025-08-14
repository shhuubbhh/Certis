// server.js
const express = require("express");
const bodyParser = require("body-parser");
const { createCanvas, loadImage } = require("canvas");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static("public"));

app.post("/generate", async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).send("Name required");

  try {
    const templatePath = path.join(__dirname, "certi-template.jpeg");
    const template = await loadImage(templatePath);

    const canvas = createCanvas(template.width, template.height);
    const ctx = canvas.getContext("2d");

    ctx.drawImage(template, 0, 0);

    // Set font style and position
    ctx.font = "40px Arial";
    ctx.fillStyle = "#000";
    ctx.textAlign = "center";
    ctx.fillText(name, canvas.width / 2, canvas.height / 2 + 100);

    // Convert to image
    const buffer = canvas.toBuffer("image/jpeg");
    res.set("Content-Type", "image/jpeg");
    res.send(buffer);

  } catch (error) {
    console.error(error);
    res.status(500).send("Error generating certificate");
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


