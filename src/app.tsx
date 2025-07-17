import * as React from "react";
import "./app.css";

function Counter() {
  const [count, setCount] = React.useState(0);

  function handleIncrement() {
    setCount(count + 1);
  }

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={handleIncrement}>+</button>
    </div>
  );
}

export default Counter;
