document.addEventListener("DOMContentLoaded", function() {
  const addQuestionButton = document.getElementById("addQuestion");
  const questionsContainer = document.getElementById("questionsContainer");
  const quizData = {
    name: "",
    questions: [],
    theme: "",
    players: []
  };

  addQuestionButton.addEventListener("click", function() {
    const questionIndex = quizData.questions.length + 1;
    const questionData = {
      theme: "",
      question: "",
      alternativeList: []
    };
    quizData.questions.push(questionData);

    const questionDiv = document.createElement("div");
    questionDiv.classList.add("question");

    questionDiv.innerHTML = `
      <h3>Question ${questionIndex}</h3>
      <div class="form-group">
        <label for="theme${questionIndex}">Theme:</label>
        <input type="text" id="theme${questionIndex}" name="theme${questionIndex}" required>
      </div>
      <div class="form-group">
        <label for="question${questionIndex}">Question:</label>
        <input type="text" id="question${questionIndex}" name="question${questionIndex}" required>
      </div>
      <div class="alternatives" id="alternatives${questionIndex}">
        <!-- Alternatives will be dynamically added here -->
      </div>
      <button type="button" class="addAlternative">Add Alternative</button>
    `;

    questionsContainer.appendChild(questionDiv);

    const addAlternativeButton = questionDiv.querySelector(".addAlternative");
    const alternativesContainer = questionDiv.querySelector(".alternatives");
    let alternativeIndex = 1;

    addAlternativeButton.addEventListener("click", function() {
      const alternativeDiv = document.createElement("div");
      alternativeDiv.classList.add("form-group", "alternative");

      alternativeDiv.innerHTML = `
        <label for="alternative${questionIndex}_${alternativeIndex}">Alternative ${alternativeIndex}:</label>
        <input type="text" id="alternative${questionIndex}_${alternativeIndex}" name="alternative${questionIndex}_${alternativeIndex}" required>
        <label for="itsCorrect${questionIndex}_${alternativeIndex}">Is Correct?</label>
        <input type="checkbox" id="itsCorrect${questionIndex}_${alternativeIndex}" name="itsCorrect${questionIndex}_${alternativeIndex}">
      `;

      alternativesContainer.appendChild(alternativeDiv);
      alternativeIndex++;
    });
  });

  const quizForm = document.getElementById("quizForm");
  quizForm.addEventListener("submit", function(event) {
    event.preventDefault();

    quizData.name = document.getElementById("quizname").value;
    quizData.theme = document.getElementById("quiztheme").value;

    const questionDivs = document.querySelectorAll(".question");
    questionDivs.forEach((questionDiv, index) => {
      const questionIndex = index + 1;
      quizData.questions[index].theme = document.getElementById(`theme${questionIndex}`).value;
      quizData.questions[index].question = document.getElementById(`question${questionIndex}`).value;

      const alternativeDivs = questionDiv.querySelectorAll(".alternative");
      alternativeDivs.forEach((alternativeDiv, altIndex) => {
        const alternativeIndex = altIndex + 1;
        const alternative = document.getElementById(`alternative${questionIndex}_${alternativeIndex}`).value;
        const itsCorrect = document.getElementById(`itsCorrect${questionIndex}_${alternativeIndex}`).checked;
        quizData.questions[index].alternativeList.push({ alternative, itsCorrect });
      });
    });

    // Make API call to submit quiz data
    const apiUrl = 'http://localhost:8080/quiz/save'; // Replace with your actual API endpoint
    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(quizData)
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Failed to submit quiz data');
      }
    })
    .then(data => {
      console.log(data); // Log API response
      // Handle successful submission (e.g., display success message)
    })
    .catch(error => {
      console.error(error);
      // Handle error (e.g., display error message)
    });
  });
});


document.addEventListener("DOMContentLoaded", function() {
  const quizContainer = document.getElementById("quizContainer");

  // Make API call to fetch quiz data
  fetch("http://localhost:8080/quiz")
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Failed to fetch quiz data");
      }
    })
    .then(quizzes => {
      // Render quiz cards
      quizzes.forEach(quiz => {
        const quizCard = document.createElement("div");
        quizCard.classList.add("quiz-card");
        quizCard.innerHTML = `
          <h3>${quiz.name}</h3>
          <p><strong>Theme:</strong> ${quiz.theme}</p>
          <p><strong>Players Number:</strong> ${quiz.players.length}</p>
        `;
        const playersContainer = document.getElementById("playersContainer");
          const playerCard = document.createElement("table");
          playerCard.innerHTML = `<thead>
          <tr>
              <th>Nick</th>
              <th>Score</th>
          </tr>
          </thead>`
          quiz.players.forEach(player => {
            playerCard.innerHTML = playerCard.innerHTML + `
            <tbody>
                <tr>
                  <td>${player.nickname}</td>
                  <td>${player.score}</td>
                </tr>
            </tbody>`
            playersContainer.appendChild(playerCard);
          });
        quizCard.addEventListener("click", function() {
          const nicknameModal = document.getElementById("modal");
          nicknameModal.style.display = "block";
          const nicknameSubmitButton = document.getElementById("nicknameSubmit");
          nicknameSubmitButton.addEventListener("click", function() {
            const nicknameInput = document.getElementById("nicknameInput").value;

            window.location.href = `game.html?id=${quiz.id}&nickname=${nicknameInput}`;
          });
          nicknameCancelButton = document.getElementById("nicknameCancel");
          nicknameCancelButton.addEventListener("click", function() {
            nicknameModal.style.display = "none";
          })
        });
    
        quizContainer.appendChild(quizCard);
      });
    })
    .catch(error => {
      console.error(error);
      // Handle error (e.g., display error message)
    });
});