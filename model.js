const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  like: {
    type: Number,
    default: 0,
  },
  dislike: {
    type: Number,
    default: 0,
  },
});

const QuestionModel = mongoose.model("Question", QuestionSchema);

module.exports = QuestionModel;
