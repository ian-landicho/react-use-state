import * as React from "react";
import "./app.css";

function App() {
  const [count, setCount] = React.useState(0);

  return (
    <div className="card">
      <h2>Current count: {count}</h2>
      <button onClick={() => setCount((count) => count + 1)}>Increment</button>
    </div>
  );
}

export default App;
