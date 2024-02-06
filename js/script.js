document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    
    const apiUrl = 'http://localhost:8080/user/'+email+'/'+password;
    
    // Example of how to make an API call using fetch
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
      // Handle successful login response here
      console.log(data);
      window.location.href = 'quiz.html';
    })
    .catch(error => {
      // Handle login failure here
      console.error(error);
      document.getElementById("message").innerText = "Login failed. Please try again.";
    });
  });
  