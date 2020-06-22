const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const fs = require("fs");
const { json } = require("body-parser");
const { FORMERR } = require("dns");
const app = express();

app.use(express.static("public"));
app.use(bodyParser.json());

//method + address
app.get("/", (req, res) => {
  res.send(path.resolve(__dirname, "/public/index.html"));
});
app.get("/ask", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./public/ask.html"));
});

app.post("/create-question", (req, res) => {
  //id - content - like - dislike - createdAt
  // console.log(req.body);

  const newQuestion = {
    content: req.body.questionContent,
    like: 0,
    dislike: 0,
    id: new Date().getTime(),
  };

  fs.readFile("data.json", { encoding: "utf-8" }, (err, data) => {
    if (err) {
      res.status(500).json({
        success: false,
        message: err.message,
      });
    } else {
      //json
      // push questions
      const questions = JSON.parse(data);
      questions.push(newQuestion);

      // writefile

      fs.writeFile("data.json", JSON.stringify(questions), (error) => {
        if (error) {
          res.status(500).json({
            success: false,
            message: err.message,
          });
        } else {
          res.status(201).json({
            success: true,
            data: newQuestion,
          });
        }
      });
    }
  });
  // res.json({
  //   success: true,
  // });
});

app.get("/questions/:questionID", (req, res) => {
  // console.log(req.params);
  res.sendFile(path.resolve(__dirname, "./public/question-detail.html"));
});

app.get("/get-question-by-id/:id", (req, res) => {
  const id = req.params.id;
  // console.log("baaaaa", id);

  fs.readFile("data.json", { encoding: "utf-8" }, (error, data) => {
    if (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    } else {
      // console.log("dxcxczxc", data);
      const questions = JSON.parse(data);
      // console.log("questions", questions);
      let selectedQuestion;
      for (const item of questions) {
        // console.log(questions);
        if (item.id === Number(id)) {
          selectedQuestion = item;
          // console.log("selectedQuestion", selectedQuestion);
          break;
        }
      }
      res.status(200).json({
        success: true,
        data: selectedQuestion,
      });
    }
  });
});

app.get("/get-random-question", (req, res) => {
  fs.readFile("data.json", { encoding: "utf-8" }, (error, data) => {
    if (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    } else {
      const questions = JSON.parse(data);
      const randomIndex = Math.floor(Math.random() * questions.length);
      const selectedQuestion = questions[randomIndex];

      res.status(200).json({
        success: true,
        data: selectedQuestion,
      });
    }
  });
});

app.put("/vote-question", (req, res) => {
  //read file
  fs.readFile("data.json", { encoding: "utf-8" }, (error, data) => {
    if (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    } else {
      const questions = JSON.parse(data);
      for (const item of questions) {
        if (item.id === Number(req.body.questionId)) {
          if (req.body.selectedVote === "like") {
            item.like += 1;
          } else {
            item.dislike += 1;
          }
          break;
        }
      }

      fs.writeFile("data.json", JSON.stringify(questions), (err) => {
        if (err) {
          res.status(500).json({
            success: false,
            message: err.message,
          });
        } else {
          res.status(500).json({
            success: true,
          });
        }
      });
    }
  });
});

app.listen(3001, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Server listen on port 3001 ...");
  }
});
