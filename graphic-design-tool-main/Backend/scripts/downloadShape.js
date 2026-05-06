const axios = require("axios");
const fs = require("fs");
const path = require("path");
 
const folder = path.resolve(__dirname, "../assets/shape");
 
if (!fs.existsSync(folder)) {
  fs.mkdirSync(folder, { recursive: true });
}
 
const downloadShape = async () => {
  try {
 
    console.log("Fetching Shapes...");
 
    const response = await axios.get(
      "https://api.github.com/repos/feathericons/feather/contents/icons",
      {
        headers: {
          "User-Agent": "node.js",
        },
      }
    );
 
    const files = response.data;
 
    console.log("Total shapes:", files.length);
 
    for (let file of files) {
 
      if (file.name.endsWith(".svg")) {
 
        const rawUrl = file.download_url;
        const filePath = path.join(folder, file.name);
 
        const svg = await axios.get(rawUrl, {
          responseType: "arraybuffer",
        });
 
        fs.writeFileSync(filePath, svg.data);
 
        console.log(file.name + " downloaded");
      }
    }
 
    console.log("All Shapes Downloaded ");
 
  } catch (error) {
    console.log(error.message);
  }
};
 
downloadShape();