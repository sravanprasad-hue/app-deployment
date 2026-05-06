const axios = require("axios");
const fs = require("fs");
const path = require("path");
 
const iconsFolder = path.resolve(__dirname, "../assets/graphics/icons");
const illustrationsFolder = path.resolve(__dirname, "../assets/graphics/illustrations");
const designFolder = path.resolve(__dirname, "../assets/graphics/design-elements");
 
[iconsFolder, illustrationsFolder, designFolder].forEach(folder => {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
  }
});
 
const downloadGraphics = async () => {
  try {
 
    // ---------------- ICONS (200)
    console.log("Downloading Icons...");
 
    const iconResponse = await axios.get(
      "https://api.github.com/repos/tailwindlabs/heroicons/contents/optimized/24/solid",
      { headers: { "User-Agent": "node.js" } }
    );
 
    const iconFiles = iconResponse.data.slice(0, 200);
 
    for (let file of iconFiles) {
 
      if (file.name.endsWith(".svg")) {
 
        const rawUrl =
          "https://raw.githubusercontent.com/tailwindlabs/heroicons/master/optimized/24/solid/" +
          file.name;
 
        const filePath = path.join(iconsFolder, file.name);
 
        const svg = await axios.get(rawUrl, {
          responseType: "arraybuffer"
        });
 
        fs.writeFileSync(filePath, svg.data);
        console.log(file.name + " icon downloaded");
      }
    }
 
    console.log("Icons Done ✅");
 
 
    // ---------------- DESIGN ELEMENTS (150)
    console.log("Downloading Design Elements...");
 
    const designResponse = await axios.get(
      "https://api.github.com/repos/tailwindlabs/heroicons/contents/optimized/24/outline",
      { headers: { "User-Agent": "node.js" } }
    );
 
    const designFiles = designResponse.data.slice(0, 150);
 
    for (let file of designFiles) {
 
      if (file.name.endsWith(".svg")) {
 
        const rawUrl =
          "https://raw.githubusercontent.com/tailwindlabs/heroicons/master/optimized/24/outline/" +
          file.name;
 
        const filePath = path.join(designFolder, file.name);
 
        const svg = await axios.get(rawUrl, {
          responseType: "arraybuffer"
        });
 
        fs.writeFileSync(filePath, svg.data);
        console.log(file.name + " design downloaded");
      }
    }
 
    console.log("Design Elements Done ✅");
 
 
    // ---------------- ILLUSTRATIONS (150).
    console.log("Downloading Illustrations...");
 
    const illustrationResponse = await axios.get(
      "https://api.github.com/repos/feathericons/feather/contents/icons",
      { headers: { "User-Agent": "node.js" } }
    );
 
    const illustrationFiles = illustrationResponse.data.slice(0, 150);
 
    for (let file of illustrationFiles) {
 
      if (file.name.endsWith(".svg")) {
 
        const rawUrl = file.download_url;
        const filePath = path.join(illustrationsFolder, file.name);
 
        const svg = await axios.get(rawUrl, {
          responseType: "arraybuffer"
        });
 
        fs.writeFileSync(filePath, svg.data);
        console.log(file.name + " illustration downloaded");
      }
    }
 
    console.log("Total 500 Graphics Downloaded ✅");
 
  } catch (error) {
    console.log(error.message);
  }
};
 
downloadGraphics();
 