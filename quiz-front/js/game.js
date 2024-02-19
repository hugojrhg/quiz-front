document.addEventListener("DOMContentLoaded", function() {
  // Function to get URL parameters
  function getUrlParameter(name) {
    name = name.replace(/[[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
    var results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
  }

  // Get quiz ID from URL parameter
  var quizId = getUrlParameter("id");
  var nickname = getUrlParameter("nickname");

  fetch(`https://quiz-back-kihe.onrender.com/quiz/${quizId}`)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Failed to fetch quiz details");
      }
    })
    .then(quiz => {
      var quizDetailsDiv = document.getElementById("quizDetails");
      quizDetailsDiv.innerHTML = `
        <h2>${quiz.name}</h2>
        <form id="quizForm">
          ${quiz.questions.map((question, index) => `
            <div class="question">
              <h3>${question.question}</h3>
              <div class="alternatives">
                ${question.alternativeList.map((alternative, altIndex) => `
                  <button type="button" class="alternative" data-question="${index}" data-alternative-index="${altIndex}">
                    ${alternative.alternative}
                  </button>
                `).join('')}
              </div>
            </div>
          `).join('')}
          <button type="submit">Submit</button>
        </form>
      `;

      var alternativeButtons = document.querySelectorAll(".alternative");
      alternativeButtons.forEach(button => {
        button.addEventListener("click", function(event) {
          var questionIndex = this.getAttribute("data-question");
          var alternativeIndex = this.getAttribute("data-alternative-index");
          var currentSelected = document.querySelector(".selected[data-question='" + questionIndex + "']");
          if (currentSelected) {
            currentSelected.classList.remove("selected");
          }
          this.classList.add("selected");
        });
      });

      var form = document.getElementById("quizForm");
      form.addEventListener("submit", function(event) {
        event.preventDefault();
        var selectedAlternatives = document.querySelectorAll(".selected");
        var score = 0;
        selectedAlternatives.forEach(selected => {
          var questionIndex = selected.getAttribute("data-question");
          var alternativeIndex = selected.getAttribute("data-alternative-index");
          if (quiz.questions[questionIndex].alternativeList[alternativeIndex].itsCorrect) {
            score++;
          }
        });
        var player = {
          nickname: nickname,
          score: score
        };
        console.log(player);
        quiz.players.push(player);
        console.log()
        const apiUrl = `https://quiz-back-kihe.onrender.com/quiz/update/${quiz.id}`; // Replace with your actual API endpoint
    fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(quiz)
    })
        window.location.href = 'quiz.html';
        console.log("Player added:", player);
      });
    })
    .catch(error => {
      console.error(error);
      // Handle error (e.g., display error message)
    });
});