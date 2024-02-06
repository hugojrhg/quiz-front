document.getElementById("registrationForm").addEventListener("submit", function(event) {
    event.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const fullName = document.getElementById("fullName").value;
    const age = document.getElementById("age").value;
    const password = document.getElementById("password").value;

    const apiUrl = 'http://localhost:8080/user/save';

    fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name, fullName, age, email, password})
  })
  .then(response => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error('Registration failed');
    }
  })
  .then(data => {
    document.getElementById("registrationMessage").innerText = "Registration successful!";
    window.location.href = 'index.html';
  })
  .catch(error => {
    console.error(error);
    // Display registration failure message
    document.getElementById("registrationMessage").innerText = "Registration failed. Please try again.";
  });
});
;