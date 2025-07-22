const fs = require("fs").promises;

async function writeAndReadFile() {
  try {
    await fs.writeFile("tamim.txt", "My name is tamim islam");
    const data = await fs.readFile("tamim.txt");
    console.log(data.toString());
  } catch (err) {
    console.log(err);
  }
}

writeAndReadFile();

// Folder creation if not exist
const myFolder = "upload";

const createFolder = async (myFolder) => {
  try {
    await fs.access(myFolder);
    console.log(`✅ Folder "${myFolder}" already exists.`);
  } catch (error) {
    await fs.mkdir(myFolder, { recursive: true });
    console.log(`📁 Folder "${myFolder}" created.`);
  }
};

createFolder(myFolder);

// content append in file

async function appendToFile(filename, data) {
  try {
    await fs.appendFile(filename, "\n" + data); // Adds newline before data
    console.log(`Data appended to ${filename}`);
  } catch (error) {
    console.log("Error appending to file:", error);
  }
}

appendToFile("tamim.txt", "sammu i love you");


// Folder delete if not exist
const deleteFolder = async (myFolder) => {
  try {
    await fs.access(myFolder);
    await fs.rm(myFolder,{recursive:true,force:true});
  } catch (error) {
    console.log(error);
  }
};

deleteFolder(myFolder);
