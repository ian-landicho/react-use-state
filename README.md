# React State Management with `useState`

## Table of Contents

1. [Understanding State and useState](#understanding-state-and-usestate)
2. [Pitfalls and Gotchas of useState](#pitfalls-and-gotchas-of-usestate)
3. [When NOT to Use useState](#when-not-to-use-usestate)
4. [Best Practices](#best-practices)

---

## Understanding State and useState

### What is State?

**State** represents data that can change over time within a React component. It's what makes your components interactive and dynamic.

### What is useState?

`useState` is a React Hook that lets you add state to functional components. Here's the basic pattern:

```jsx
import * as React from "react";

function Counter() {
  const [count, setCount] = React.useState(0);

  const handleIncrement = () => {
    setCount(count + 1);
  };

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={handleIncrement}>+</button>
    </div>
  );
}
```

### Key Characteristics of State

**1. Mutable - State Can Change**
Unlike regular variables, state can be updated and will trigger re-renders.

```jsx
function Counter() {
  const [count, setCount] = React.useState(0);
  const title = "My Counter"; // This never changes

  const handleIncrement = () => {
    setCount(count + 1);
  };

  return (
    <div>
      <h2>{title}</h2>
      <p>Count: {count}</p>
      <button onClick={handleIncrement}>Increment</button>
    </div>
  );
}
```

**2. Local - Each Component Has Its Own State**
Every component instance maintains its own separate state.

```jsx
function Counter() {
  const [count, setCount] = React.useState(0);

  const handleIncrement = () => {
    setCount(count + 1);
  };

  const handleDecrement = () => {
    setCount(count - 1);
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: "10px", margin: "5px" }}>
      <p>Count: {count}</p>
      <button onClick={handleIncrement}>+</button>
    </div>
  );
}

function App() {
  return (
    <div>
      <Counter /> {/* Independent counter */}
      <Counter /> {/* Independent counter */}
      <Counter /> {/* Independent counter */}
    </div>
  );
}
```

**3. Reactive - State Changes Trigger Re-renders**
When state updates, React automatically re-renders the component.

```jsx
function Counter() {
  const [count, setCount] = React.useState(0);

  console.log("Counter rendered with count:", count);

  const handleIncrement = () => {
    setCount(count + 1);
  };

  const handleDecrement = () => {
    setCount(count - 1);
  };

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={handleIncrement}>+</button>
      <button onClick={handleDecrement}>-</button>
    </div>
  );
}
```

**4. Asynchronous - State Updates Are Scheduled**
State doesn't update immediately when you call the setter.

```jsx
function Counter() {
  const [count, setCount] = React.useState(0);

  const handleClick = () => {
    console.log("Before:", count); // Shows current value
    setCount(count + 1);
    console.log("After:", count); // Still shows old value!
  };

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={handleClick}>Click me (check console)</button>
    </div>
  );
}
```

### Basic useState Patterns

**Simple State Declaration**

```jsx
function Counter() {
  const [count, setCount] = React.useState(0);

  const handleIncrement = () => {
    setCount(count + 1);
  };

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={handleIncrement}>+</button>
    </div>
  );
}
```

**Functional Updates**
When the new state depends on the previous state, use a function:

```jsx
function Counter() {
  const [count, setCount] = React.useState(0);

  const increment = () => {
    setCount((prevCount) => prevCount + 1);
  };

  const addFive = () => {
    setCount((prevCount) => prevCount + 5);
  };

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>+1</button>
      <button onClick={addFive}>+5</button>
    </div>
  );
}
```

**Updating Objects**
When working with object state, always create a new object:

```jsx
function Counter() {
  const [counterState, setCounterState] = React.useState({
    count: 0,
    lastUpdated: Date.now(),
  });

  const handleIncrement = () => {
    setCounterState((prev) => ({
      ...prev, // Spread the previous object
      count: prev.count + 1,
      lastUpdated: Date.now(),
    }));
  };

  const handleReset = () => {
    setCounterState((prev) => ({
      ...prev,
      count: 0,
      lastUpdated: Date.now(),
    }));
  };

  return (
    <div>
      <p>Count: {counterState.count}</p>
      <p>
        Last Updated: {new Date(counterState.lastUpdated).toLocaleTimeString()}
      </p>
      <button onClick={handleIncrement}>+</button>
      <button onClick={handleReset}>Reset</button>
    </div>
  );
}
```

**Updating Arrays**
When working with array state, always create a new array:

```jsx
function Counter() {
  const [count, setCount] = React.useState(0);
  const [history, setHistory] = React.useState([]);

  const handleIncrement = () => {
    const newCount = count + 1;
    setCount(newCount);

    // Add to array - create new array with spread operator
    setHistory((prev) => [...prev, `Incremented to ${newCount}`]);
  };

  const handleDecrement = () => {
    const newCount = count - 1;
    setCount(newCount);

    // Add to array
    setHistory((prev) => [...prev, `Decremented to ${newCount}`]);
  };

  const handleClearHistory = () => {
    // Replace entire array
    setHistory([]);
  };

  const handleRemoveLastAction = () => {
    // Remove last item - create new array without last element
    setHistory((prev) => prev.slice(0, -1));
  };

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={handleIncrement}>+</button>
      <button onClick={handleDecrement}>-</button>
      <button onClick={handleClearHistory}>Clear History</button>
      <button onClick={handleRemoveLastAction}>Remove Last</button>

      <div>
        <h4>History:</h4>
        <ul>
          {history.map((action, index) => (
            <li key={index}>{action}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
```

---

## Pitfalls and Gotchas of useState

### 1. 🚨 Multiple Updates Batching

**Problem**: Multiple state updates in the same event handler get batched together.

```jsx
function Counter() {
  const [count, setCount] = React.useState(0);

  const handleTripleClick = () => {
    setCount(count + 1); // count = 0, so this sets count to 1
    setCount(count + 1); // count is still 0, so this also sets count to 1
    setCount(count + 1); // count is still 0, so this also sets count to 1
    // Final result: count = 1 (not 3!)
  };

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={handleTripleClick}>Try +3 (but only adds 1!)</button>
    </div>
  );
}
```

**Solution**: Use functional updates

```jsx
function Counter() {
  const [count, setCount] = React.useState(0);

  const handleTripleClick = () => {
    setCount((prev) => prev + 1); // 0 + 1 = 1
    setCount((prev) => prev + 1); // 1 + 1 = 2
    setCount((prev) => prev + 1); // 2 + 1 = 3
    // Final result: count = 3 ✅
  };

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={handleTripleClick}>+3 (works correctly!)</button>
    </div>
  );
}
```

### 2. 🚨 Direct Mutation

**Problem**: Directly changing state objects or arrays won't trigger re-renders.

React uses **Object.is()** comparison (similar to `===`) to determine if state has changed. When you mutate an object or array directly, you're modifying the same reference in memory, so React thinks nothing has changed even though the contents are different. This is why React requires **immutable updates** - you must create new objects/arrays for React to detect the change and trigger a re-render.

```jsx
function Counter() {
  const [stats, setStats] = useState({ count: 0, clicks: 0 });

  const badIncrement = () => {
    // ❌ Direct mutation - React won't detect the change
    stats.count = stats.count + 1;
    stats.clicks = stats.clicks + 1;
    setStats(stats); // No re-render! Same object reference

    // React's internal check:
    // Object.is(oldStats, newStats) === true
    // Because stats === stats (same reference)
  };

  return (
    <div>
      <p>
        Count: {stats.count}, Clicks: {stats.clicks}
      </p>
      <button onClick={badIncrement}>Broken Increment</button>
    </div>
  );
}
```

**Solution**: Always create new objects/arrays

```jsx
function Counter() {
  const [stats, setStats] = useState({ count: 0, clicks: 0 });

  const goodIncrement = () => {
    // ✅ Create new object - React detects the change
    setStats((prev) => ({
      count: prev.count + 1,
      clicks: prev.clicks + 1,
    }));

    // React's internal check:
    // Object.is(oldStats, newStats) === false
    // Because we created a new object reference
  };

  return (
    <div>
      <p>
        Count: {stats.count}, Clicks: {stats.clicks}
      </p>
      <button onClick={goodIncrement}>Working Increment</button>
    </div>
  );
}
```

### 3. 🚨 Expensive Initialization

**Problem**: Running expensive calculations on every render.

Sometimes you need to perform a costly operation to determine the initial state value. If you pass the result directly to `useState`, this expensive operation will run on every single render, even though you only need it once for initialization. This can severely impact performance.

```jsx
// Helper function to simulate expensive calculation
function calculateInitialCount() {
  console.log("Expensive calculation running...");
  // Simulate slow computation (like processing large data, API calls, etc.)
  let result = 0;
  for (let i = 0; i < 10000000; i++) {
    result += Math.random();
  }
  return Math.floor(result / 10000000);
}

function Counter() {
  // ❌ WRONG: Expensive calculation runs on every render!
  const [count, setCount] = useState(calculateInitialCount());

  const handleIncrement = () => {
    setCount(count + 1);
  };

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={handleIncrement}>+</button>
    </div>
  );
}
```

**Solution**: Use lazy initialization with a function

```jsx
// Helper function to simulate expensive calculation
function calculateInitialCount() {
  console.log("Expensive calculation running...");
  // Simulate slow computation (like processing large data, API calls, etc.)
  let result = 0;
  for (let i = 0; i < 10000000; i++) {
    result += Math.random();
  }
  return Math.floor(result / 10000000);
}

function Counter() {
  // ✅ CORRECT: Expensive calculation only runs once during initialization
  const [count, setCount] = useState(() => calculateInitialCount());

  const handleIncrement = () => {
    setCount(count + 1);
  };

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={handleIncrement}>+</button>
    </div>
  );
}
```

### 4. 🚨 Infinite Re-render Loops

**Problem**: Setting state directly in the component body.

```jsx
function Counter() {
  const [count, setCount] = React.useState(0);

  // ❌ This causes infinite re-renders!
  setCount(count + 1);

  return <div>Count: {count}</div>;
}
```

**Solution**: Only update state in event handlers or effects

```jsx
function Counter() {
  const [count, setCount] = React.useState(0);

  // ✅ Update state in event handler
  const handleClick = () => {
    setCount(count + 1);
  };

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={handleClick}>Increment</button>
    </div>
  );
}
```

---

## When NOT to Use useState

### 1. **Derived State** - Use computed values instead

```jsx
// ❌ Don't store derived state
function Counter() {
  const [count, setCount] = React.useState(0);
  const [doubledCount, setDoubledCount] = React.useState(0);

  const increment = () => {
    const newCount = count + 1;
    setCount(newCount);
    setDoubledCount(newCount * 2); // Extra unnecessary state!
  };

  return (
    <div>
      <p>Count: {count}</p>
      <p>Doubled: {doubledCount}</p>
      <button onClick={increment}>+</button>
    </div>
  );
}

// ✅ Compute derived values directly
function Counter() {
  const [count, setCount] = React.useState(0);
  const doubledCount = count * 2; // Computed on each render

  return (
    <div>
      <p>Count: {count}</p>
      <p>Doubled: {doubledCount}</p>
      <button onClick={() => setCount(count + 1)}>+</button>
    </div>
  );
}
```

### 2. **Complex State Logic** - Consider useReducer instead

```jsx
// ❌ useState becomes unwieldy with complex interactions
function Counter() {
  const [count, setCount] = React.useState(0);
  const [step, setStep] = useState(1);
  const [isRunning, setIsRunning] = useState(false);
  const [history, setHistory] = useState([]);

  // Many complex interactions between these states...
  const increment = () => {
    setCount(count + step);
    setHistory([...history, count + step]);
  };
}

// ✅ Better with useReducer for complex state logic
function Counter() {
  const [state, dispatch] = useReducer(counterReducer, initialState);

  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: "increment" })}>+</button>
    </div>
  );
}
```

---

## Best Practices

### 1. **Use Clear Naming Conventions**

```jsx
// ✅ Use descriptive names with 'set' prefix
function Counter() {
  const [count, setCount] = React.useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleIncrement = () => {
    setCount(count + 1);
  };

  const handleToggleRunning = () => {
    setIsRunning(!isRunning);
  };

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={handleIncrement}>+</button>
      <button onClick={handleToggleRunning}>
        {isRunning ? "Stop" : "Start"}
      </button>
    </div>
  );
}
```

### 2. **Separate Independent State**

```jsx
// ❌ Large state object
function Counter() {
  const [state, setState] = useState({
    count: 0,
    step: 1,
    isRunning: false,
    error: null,
  });

  // Hard to update individual pieces - you need the spread operator every time
  const handleIncrement = () => {
    setState((prev) => ({ ...prev, count: prev.count + prev.step }));
  };

  const handleToggleRunning = () => {
    setState((prev) => ({ ...prev, isRunning: !prev.isRunning }));
  };

  const handleStepChange = (newStep) => {
    setState((prev) => ({ ...prev, step: newStep }));
  };
}

// ✅ Separate independent state
function Counter() {
  const [count, setCount] = React.useState(0);
  const [step, setStep] = useState(1);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState(null);

  // Easy to update each piece independently - direct updates
  const handleIncrement = () => {
    setCount(count + step);
  };

  const handleToggleRunning = () => {
    setIsRunning(!isRunning);
  };

  const handleStepChange = (newStep) => {
    setStep(newStep);
  };
}
```

### 3. **Use Functional Updates**

```jsx
function Counter() {
  const [count, setCount] = React.useState(0);

  // ✅ When new state depends on previous state
  const increment = () => {
    setCount((prevCount) => prevCount + 1);
  };

  const incrementByStep = (step) => {
    setCount((prevCount) => prevCount + step);
  };

  const handleAddFive = () => {
    incrementByStep(5);
  };

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>+1</button>
      <button onClick={handleAddFive}>+5</button>
    </div>
  );
}
```
