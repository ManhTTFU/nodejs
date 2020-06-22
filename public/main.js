window.onload = () => {
  const voteQuestion = (questionId, selectedVote) => {
    fetch(`/vote-question`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        questionId: questionId,
        selectedVote: selectedVote,
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        window.location.href = `/questions/${questionId}`;
      })
      .catch((error) => {
        console.log(error);
        window.alert(error.message);
      });
  };
  fetch("/get-random-question")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      document.querySelector(".question-content").innerHTML = data.data.content;

      // listen button click

      document.querySelector(".like-button").addEventListener("click", () => {
        voteQuestion(data.data.id, "like");
      });

      document
        .querySelector(".dislike-button")
        .addEventListener("click", () => {
          voteQuestion(data.data.id, "dislike");
        });
      document.querySelector(".result-button").addEventListener("click", () => {
        window.location.href = `/questions/${data.data.id}`;
      });
      document
        .querySelector(".other-question")
        .addEventListener("click", () => {
          window.location.reload();
        });
    })
    .catch((error) => {
      console.log(error);
      window.alert(error.message);
    });
};
