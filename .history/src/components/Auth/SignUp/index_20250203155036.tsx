<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Company Signup Form</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f7ff;
      margin: 0;
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
    }
    .form-container {
      background-color: #fff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 500px;
    }
    .form-container h2 {
      margin-bottom: 20px;
      font-size: 24px;
      color: #333;
    }
    .form-group {
      margin-bottom: 15px;
    }
    .form-group label {
      display: block;
      margin-bottom: 5px;
      font-weight: bold;
      color: #555;
    }
    .form-group input,
    .form-group select {
      width: 100%;
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 4px;
      font-size: 16px;
    }
    .form-group input:focus,
    .form-group select:focus {
      border-color: #3056D3;
      outline: none;
    }
    .form-group button {
      width: 100%;
      padding: 10px;
      background-color: #3056D3;
      color: #fff;
      border: none;
      border-radius: 4px;
      font-size: 16px;
      cursor: pointer;
    }
    .form-group button:hover {
      background-color: #1e3a8a;
    }
    .form-group .link {
      color: #3056D3;
      text-decoration: none;
    }
    .form-group .link:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="form-container">
    <h2>Company Signup Form</h2>
    <form id="companySignupForm">
      <div class="form-group">
        <label for="companyName">Company Name</label>
        <input type="text" id="companyName" name="companyName" required>
      </div>
      <div class="form-group">
        <label for="adminName">Name of Company Admin</label>
        <input type="text" id="adminName" name="adminName" required>
      </div>
      <div class="form-group">
        <label for="adminEmail">Email of Company Admin</label>
        <input type="email" id="adminEmail" name="adminEmail" required>
      </div>
      <div class="form-group">
        <label for="country">Country</label>
        <select id="country" name="country" required>
          <option value="">Select Country</option>
          <option value="USA">United States</option>
          <option value="UK">United Kingdom</option>
          <option value="Canada">Canada</option>
          <!-- Add more countries as needed -->
        </select>
      </div>
      <div class="form-group">
        <label for="city">City</label>
        <input type="text" id="city" name="city" required>
      </div>
      <div class="form-group">
        <label for="industry">Company Industry</label>
        <select id="industry" name="industry" required>
          <option value="">Select Industry</option>
          <option value="Technology">Technology</option>
          <option value="Finance">Finance</option>
          <option value="Healthcare">Healthcare</option>
          <!-- Add more industries as needed -->
        </select>
      </div>
      <div class="form-group">
        <label for="pensionCode">Company Pension Code</label>
        <input type="text" id="pensionCode" name="pensionCode" required>
      </div>
      <div class="form-group">
        <label for="dateJoined">Date Joined</label>
        <input type="date" id="dateJoined" name="dateJoined" required>
      </div>
      <div class="form-group">
        <button type="submit">Sign Up</button>
      </div>
      <div class="form-group">
        <p>Already have an account? <a href="/signin" class="link">Sign In</a></p>
      </div>
    </form>
  </div>

  <script>
    document.getElementById('companySignupForm').addEventListener('submit', function(event) {
      event.preventDefault();
      const formData = new FormData(event.target);
      const data = Object.fromEntries(formData.entries());
      console.log(data); // You can replace this with your fetch call to submit the data
      alert('Form submitted successfully!');
    });
  </script>
</body>
</html>