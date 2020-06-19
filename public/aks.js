window.onload = () => {
  const submitButton = document.querySelector(".submit-button");
  if (submitButton) {
    submitButton.addEventListener("click", (event) => {
      event.preventDefault();
      const textAreaValue = document.querySelector(".input-question").value;
      // send request to server
      // create new question
      // send question content
      fetch("/create-question", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          questionContent: textAreaValue,
        }),
      })
        .then((response) => {
          // response.json() => only when server response with json
          // response.text() => only when server response with string

          return response.json();
        })
        .then((data) => {
          // handle response data
          window.location.href = `/questions/${data.data.id}`;
          // console.log("data: ", data);
        })
        .catch((err) => {
          console.log(err);
          window.alert(err.message);
        });
    });
  }
};
