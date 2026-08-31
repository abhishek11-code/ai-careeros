import { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState("Connecting to backend...");

  useEffect(() => {
    fetch("http://localhost:8080/api/health")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Backend request failed");
        }
        return response.text();
      })
      .then((data) => {
        setMessage(data);
      })
      .catch(() => {
        setMessage("Backend connection failed ❌");
      });
  }, []);

  return (
    <div>
      <h1>AI CareerOS</h1>
      <p>{message}</p>
    </div>
  );
}

export default App;