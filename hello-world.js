const fs = require("fs");

const textData =
  "Lorem Ipsum is simply dummy text of the printing and typesetting industry.";

fs.writeFile("text.txt", textData, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Write file success");
  }
});

// TODO: read text.txt content

fs.readFile("text.txt", "utf8", (err, data) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Read file success:", data);
  }
});

fs.watchFile("text.txt", (current, previous) => {
  console.log("File change");
});
