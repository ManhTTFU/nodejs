window.onload = () => {
  // fetch API get question
  const pathname = window.location.pathname;
  const pathNameParts = pathname.split("/");
  const id = pathNameParts[pathNameParts.length - 1];
  fetch(`/get-question-by-id/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      console.log("res", response);
      return response.json();
    })
    .then((data) => {
      // calculate like/dislike
      console.log("fixed-data", data);
      let likePercent = 0;
      let dislikePercent = 0;
      if (data.data.like === 0 && data.data.dislike === 0) {
        likePercent = dislikePercent = 50;
      } else {
        likePercent = (
          (data.data.like / (data.data.like + data.data.dislike)) *
          100
        ).toFixed(2);
        dislikePercent = 100.0 - likePercent;
      }
      //display
      document.querySelector(".question-content").innerHTML = data.data.content;
      document.querySelector(".total-vote").innerHTML = `${
        data.data.like + data.data.dislike
      } votes`;
      document.querySelector(".like-percent").innerHTML = `${likePercent}%`;
      document.querySelector(
        ".dislike-percent"
      ).innerHTML = `${dislikePercent}%`;
    })
    .catch((error) => {
      console.log(error);
      window.alert(error.message);
    });
  //innerHTML
};
