import React, { useState } from "react";
import axios from "axios";

function Registration() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/register", {
        username,
        password,
      });
      setIsRegistered(true);
      alert(response.data.message);
    } catch (error) {
      console.error(error.response.data.message);
    }
  };

  return (
    <div>
      {isRegistered ? (
        <h1>Registration Successful!</h1>
      ) : (
        <form onSubmit={handleRegister}>
          <h1>Register</h1>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Register</button>
        </form>
      )}
    </div>
  );
}

export default Registration;
