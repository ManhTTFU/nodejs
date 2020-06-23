const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const fs = require("fs");
const mongoose = require("mongoose");
const { json } = require("body-parser");
const QuestionModel = require("./model");

mongoose.connect(
  "mongodb://localhost:27017/test",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) {
      console.log(err);
      process.exit();
    } else {
      console.log("Connect to mongodb success ...!");
      // start app;
      const app = express();

      app.use(express.static("public"));
      app.use(bodyParser.json());

      //method + address
      app.get("/", (req, res) => {
        res.sendFile(path.resolve(__dirname, "/public/index.html"));
      });
      app.get("/ask", (req, res) => {
        res.sendFile(path.resolve(__dirname, "./public/ask.html"));
      });

      app.post("/create-question", (req, res) => {
        //id - content - like - dislike - createdAt
        // console.log(req.body);

        const newQuestion = {
          content: req.body.questionContent,
          // like: 0,
          // dislike: 0,
          // id: new Date().getTime(),
        };

        QuestionModel.create(newQuestion, (error, data) => {
          if (err) {
            res.status(500).json({
              success: false,
              message: err.message,
            });
          } else {
            console.log(data);
            res.status(201).json({
              success: true,
              data: {
                ...data._doc,
                id: data._doc._id,
              },
            });
          }
        });

        // fs.readFile("data.json", { encoding: "utf-8" }, (err, data) => {
        //   if (err) {
        //     res.status(500).json({
        //       success: false,
        //       message: err.message,
        //     });
        //   } else {
        //     //json
        //     // push questions
        //     const questions = JSON.parse(data);
        //     questions.push(newQuestion);

        //     // writefile

        //     fs.writeFile("data.json", JSON.stringify(questions), (error) => {
        //       if (error) {
        //         res.status(500).json({
        //           success: false,
        //           message: err.message,
        //         });
        //       } else {
        //         res.status(201).json({
        //           success: true,
        //           data: newQuestion,
        //         });
        //       }
        //     });
        //   }
        // });
      });

      app.get("/questions/:questionID", (req, res) => {
        // console.log(req.params);
        res.sendFile(path.resolve(__dirname, "./public/question-detail.html"));
      });

      app.get("/get-question-by-id/:id", (req, res) => {
        const id = req.params.id;
        // console.log("baaaaa", id);
        QuestionModel.findById(id, (err, data) => {
          if (err) {
            res.status(500).json({
              success: false,
              message: error.message,
            });
          } else {
            if (!data) {
              res.status(404).json({
                success: false,
                message: `Question not found !`,
              });
            } else {
              res.status(200).json({
                success: true,
                data: {
                  ...data._doc,
                  id: data._id,
                },
              });
            }
          }
        });
        // fs.readFile("data.json", { encoding: "utf-8" }, (error, data) => {
        //   if (error) {
        //     res.status(500).json({
        //       success: false,
        //       message: error.message,
        //     });
        //   } else {
        //     // console.log("dxcxczxc", data);
        //     const questions = JSON.parse(data);
        //     // console.log("questions", questions);
        //     let selectedQuestion;
        //     for (const item of questions) {
        //       // console.log(questions);
        //       if (item.id === Number(id)) {
        //         selectedQuestion = item;
        //         // console.log("selectedQuestion", selectedQuestion);
        //         break;
        //       }
        //     }
        //     res.status(200).json({
        //       success: true,
        //       data: selectedQuestion,
        //     });
        //   }
        // });
      });

      app.get("/get-random-question", (req, res) => {
        QuestionModel.aggregate([{ $sample: { size: 1 } }], (err, data) => {
          if (err) {
            res.status(500).json({
              success: false,
              message: err.message,
            });
          } else {
            const selectedQuestion = data[0];
            res.status(200).json({
              data: {
                ...selectedQuestion._doc,
                id: selectedQuestion._id,
              },
            });
          }
        });
      });

      app.put("/vote-question", (req, res) => {
        //read file

        const questionId = req.body.questionId;
        const selectedVote = req.body.selectedVote;

        // check exist
        QuestionModel.findByIdAndUpdate(questionId, {
          $inc: {
            [selectedVote]: 1,
          },
        });

        //updae
        // fs.readFile("data.json", { encoding: "utf-8" }, (error, data) => {
        //   if (error) {
        //     res.status(500).json({
        //       success: false,
        //       message: error.message,
        //     });
        //   } else {
        //     const questions = JSON.parse(data);
        //     for (const item of questions) {
        //       if (item.id === Number(req.body.questionId)) {
        //         if (req.body.selectedVote === "like") {
        //           item.like += 1;
        //         } else {
        //           item.dislike += 1;
        //         }
        //         break;
        //       }
        //     }

        //     fs.writeFile("data.json", JSON.stringify(questions), (err) => {
        //       if (err) {
        //         res.status(500).json({
        //           success: false,
        //           message: err.message,
        //         });
        //       } else {
        //         res.status(500).json({
        //           success: true,
        //         });
        //       }
        //     });
        //   }
        // });
      });

      app.listen(3001, (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log("Server listen on port 3001 ...");
        }
      });
    }
  }
);
