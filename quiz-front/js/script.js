document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    
    const apiUrl = 'https://quiz-back-kihe.onrender.com/user/'+email+'/'+password;
    
    fetch(apiUrl, {
      method: 'GET'
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Login failed');
      }
    })
    .then(data => {
      console.log(data);
      window.location.href = 'quiz.html';
    })
    .catch(error => {
      console.error(error);
      document.getElementById("message").innerText = "Login failed. Please try again.";
    });
  });
  