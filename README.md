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
```

### Key Characteristics of State

**1. Mutable - State Can Change**
Unlike regular variables, state can be updated and will trigger re-renders.

```jsx
function Counter() {
  const [count, setCount] = React.useState(0);
  const title = "My Counter"; // This never changes

  function handleIncrement() {
    setCount(count + 1);
  }

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

export default function App() {
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

  // This line runs on every render. Check the console.
  console.log("Counter rendered with count:", count);

  function handleIncrement() {
    setCount(count + 1);
  }

  function handleDecrement() {
    setCount(count - 1);
  }

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

  function handleClick() {
    // Check console
    console.log("Before:", count); // Shows current value
    setCount(count + 1);
    console.log("After:", count); // Still shows old value!
  }

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={handleClick}>+</button>
    </div>
  );
}
```

### Basic useState Patterns

**Simple State Declaration**

```jsx
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
```

**Functional Updates**
When the new state depends on the previous state, use a function:

```jsx
function Counter() {
  const [count, setCount] = React.useState(0);

  function increment() {
    setCount((prevCount) => prevCount + 1);
  }

  function addFive() {
    setCount((prevCount) => prevCount + 5);
  }

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

  function handleIncrement() {
    setCounterState((prev) => ({
      ...prev, // Spread the previous object
      count: prev.count + 1,
      lastUpdated: Date.now(),
    }));
  }

  function handleReset() {
    setCounterState((prev) => ({
      ...prev,
      count: 0,
      lastUpdated: Date.now(),
    }));
  }

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
  const [history, setHistory] = React.useState<string[]>([]);

  function handleIncrement() {
    const newCount = count + 1;
    setCount(newCount);

    // Add to array - create new array with spread operator
    setHistory((prev) => [...prev, `Incremented to ${newCount}`]);
  }

  function handleDecrement() {
    const newCount = count - 1;
    setCount(newCount);

    // Add to array
    setHistory((prev) => [...prev, `Decremented to ${newCount}`]);
  }

  function handleClearHistory() {
    // Replace entire array
    setHistory([]);
  }

  function handleRemoveLastAction() {
    // Remove last item - create new array without last element
    setHistory((prev) => prev.slice(0, -1));
  }

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={handleIncrement}>+</button>
      <button onClick={handleDecrement}>-</button>
      <button onClick={handleClearHistory}>Clear History</button>
      <button onClick={handleRemoveLastAction}>Remove Last</button>

      <div>
        <h1>History:</h1>
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

  function handleTripleClick() {
    setCount(count + 1); // count = 0, so this sets count to 1
    setCount(count + 1); // count is still 0, so this also sets count to 1
    setCount(count + 1); // count is still 0, so this also sets count to 1
    // Final result: count = 1 (not 3!)
  }

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

  function handleTripleClick() {
    setCount((prev) => prev + 1); // 0 + 1 = 1
    setCount((prev) => prev + 1); // 1 + 1 = 2
    setCount((prev) => prev + 1); // 2 + 1 = 3
    // Final result: count = 3 ✅
  }

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
  const [stats, setStats] = React.useState({ count: 0, clicks: 0 });

  function badIncrement() {
    // ❌ Direct mutation - React won't detect the change
    stats.count = stats.count + 1;
    stats.clicks = stats.clicks + 1;
    setStats(stats); // No re-render! Same object reference

    // React's internal check:
    // Object.is(oldStats, newStats) === true
    // Because stats === stats (same reference)
  }

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
  const [stats, setStats] = React.useState({ count: 0, clicks: 0 });

  function goodIncrement() {
    // ✅ Create new object - React detects the change
    setStats((prev) => ({
      count: prev.count + 1,
      clicks: prev.clicks + 1,
    }));

    // React's internal check:
    // Object.is(oldStats, newStats) === false
    // Because we created a new object reference
  }

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

  const now = performance.now();
  while (performance.now() - now < 500) {
    result += Math.random();
  }

  return Math.floor(result / 10000000);
}

function Counter() {
  // ❌ WRONG: Expensive calculation runs on every render!
  const [count, setCount] = React.useState(calculateInitialCount());

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
```

**Solution**: Use lazy initialization with a function

```jsx
// Helper function to simulate expensive calculation
function calculateInitialCount() {
  console.log("Expensive calculation running...");
  // Simulate slow computation (like processing large data, API calls, etc.)
  let result = 0;

  const now = performance.now();
  while (performance.now() - now < 500) {
    result += Math.random();
  }

  return Math.floor(result / 10000000);
}

function Counter() {
  // ✅ CORRECT: Expensive calculation only runs once during initialization
  const [count, setCount] = React.useState(() => calculateInitialCount());

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
  function handleClick() {
    setCount(count + 1);
  }

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

  function increment() {
    const newCount = count + 1;
    setCount(newCount);
    setDoubledCount(newCount * 2); // Extra unnecessary state!
  }

  return (
    <div>
      <p>Count: {count}</p>
      <p>Doubled: {doubledCount}</p>
      <button onClick={increment}>+</button>
    </div>
  );
}
```

```jsx
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

When you have multiple pieces of state that are interdependent, `useState` becomes difficult to manage:

```jsx
// ❌ useState becomes unwieldy with complex interactions
function Counter() {
  const [count, setCount] = React.useState(0);
  const [step, setStep] = React.useState(1);
  const [isRunning, setIsRunning] = React.useState(false);
  const [history, setHistory] = React.useState<string[]>([]);

  // Complex interactions between these states...
  function increment() {
    const newCount = count + step;
    setCount(newCount);
    setHistory((prev) => [...prev, `Incremented by ${step} to ${newCount}`]);
  }

  function decrement() {
    const newCount = count - step;
    setCount(newCount);
    setHistory((prev) => [...prev, `Decremented by ${step} to ${newCount}`]);
  }

  function reset() {
    setCount(0);
    setStep(1);
    setIsRunning(false);
    setHistory((prev) => [...prev, "Reset all values"]);
  }

  function toggleRunning() {
    const newRunning = !isRunning;
    setIsRunning(newRunning);
    setHistory((prev) => [...prev, newRunning ? "Started" : "Stopped"]);
  }

  function changeStep(newStep: React.SetStateAction<number>) {
    setStep(newStep);
    setHistory((prev) => [...prev, `Changed step to ${newStep}`]);
  }

  return (
    <div>
      <p>Count: {count}</p>
      <p>Step: {step}</p>
      <p>Status: {isRunning ? "Running" : "Stopped"}</p>
      <button onClick={increment}>+{step}</button>
      <button onClick={decrement}>-{step}</button>
      <button onClick={reset}>Reset</button>
      <button onClick={toggleRunning}>{isRunning ? "Stop" : "Start"}</button>
      <input
        type="number"
        value={step}
        onChange={(e) => changeStep(Number(e.target.value))}
      />
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

**Problems with the useState approach:**

- **Scattered Logic**: State updates are spread across multiple functions
- **State Synchronization**: Easy to forget updating related state (like history)
- **Complex Dependencies**: Multiple pieces of state depend on each other

```jsx
// ✅ Better with useReducer for complex state logic
type CounterAction =
  | { type: "INCREMENT" | "DECREMENT" | "RESET" | "TOGGLE_RUNNING" }
  | { type: "CHANGE_STEP"; payload: number }; // payload is required for CHANGE_STEP

type InitialState = {
  count: number;
  step: number;
  isRunning: boolean;
  history: string[];
};

const initialState: InitialState = {
  count: 0,
  step: 1,
  isRunning: false,
  history: [],
};

function counterReducer(state: InitialState, action: CounterAction) {
  switch (action.type) {
    case "INCREMENT": {
      const newCount = state.count + state.step;
      return {
        ...state,
        count: newCount,
        history: [
          ...state.history,
          `Incremented by ${state.step} to ${newCount}`,
        ],
      };
    }

    case "DECREMENT": {
      const newCount = state.count - state.step;
      return {
        ...state,
        count: newCount,
        history: [
          ...state.history,
          `Decremented by ${state.step} to ${newCount}`,
        ],
      };
    }

    case "RESET":
      return {
        ...initialState,
        history: [...state.history, "Reset all values"],
      };

    case "TOGGLE_RUNNING": {
      const newRunning = !state.isRunning;
      return {
        ...state,
        isRunning: newRunning,
        history: [...state.history, newRunning ? "Started" : "Stopped"],
      };
    }

    case "CHANGE_STEP":
      return {
        ...state,
        step: action.payload,
        history: [...state.history, `Changed step to ${action.payload}`],
      };

    default:
      return state;
  }
}

function Counter() {
  const [state, dispatch] = React.useReducer(counterReducer, initialState);

  function increment() {
    dispatch({ type: "INCREMENT" });
  }

  function decrement() {
    dispatch({ type: "DECREMENT" });
  }

  function reset() {
    dispatch({ type: "RESET" });
  }

  function toggleRunning() {
    dispatch({ type: "TOGGLE_RUNNING" });
  }

  function changeStep(newStep: number) {
    dispatch({ type: "CHANGE_STEP", payload: newStep });
  }

  return (
    <div>
      <p>Count: {state.count}</p>
      <p>Step: {state.step}</p>
      <p>Status: {state.isRunning ? "Running" : "Stopped"}</p>
      <button onClick={increment}>+{state.step}</button>
      <button onClick={decrement}>-{state.step}</button>
      <button onClick={reset}>Reset</button>
      <button onClick={toggleRunning}>
        {state.isRunning ? "Stop" : "Start"}
      </button>
      <input
        type="number"
        value={state.step}
        onChange={(e) => changeStep(Number(e.target.value))}
      />
      <div>
        <h4>History:</h4>
        <ul>
          {state.history.map((action: string, index: number) => (
            <li key={index}>{action}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
```

**Benefits of the useReducer approach:**

- **Centralized Logic**: All state transitions are in one place
- **Consistent Updates**: History is always updated correctly when state changes
- **Predictable**: Easy to understand what each action does

---

## Best Practices

### 1. **Use Clear Naming Conventions**

```jsx
// ✅ Use descriptive names with 'set' prefix
function Counter() {
  const [count, setCount] = React.useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [hasError, setHasError] = useState(false);

  function handleIncrement() {
    setCount(count + 1);
  }

  function handleToggleRunning() {
    setIsRunning(!isRunning);
  }

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

When state pieces are truly independent (don't depend on each other), separate them instead of grouping them into one object:

```jsx
// ❌ Grouping independent state in one object
function Counter() {
  const [state, setState] = React.useState({
    count: 0,
    theme: "light",
    userName: "",
    showHistory: false,
    notifications: 0,
  });

  // Hard to update individual pieces - you need the spread operator every time
  function handleIncrement() {
    setState((prev) => ({ ...prev, count: prev.count + 1 }));
  }

  function handleThemeToggle() {
    setState((prev) => ({
      ...prev,
      theme: prev.theme === "light" ? "dark" : "light",
    }));
  }

  function handleNameChange(name) {
    setState((prev) => ({ ...prev, userName: name }));
  }

  function handleToggleHistory() {
    setState((prev) => ({ ...prev, showHistory: !prev.showHistory }));
  }

  function handleAddNotification() {
    setState((prev) => ({ ...prev, notifications: prev.notifications + 1 }));
  }

  function handleClearNotifications() {
    setState((prev) => ({ ...prev, notifications: 0 }));
  }

  return (
    <div className={state.theme === "dark" ? "dark-theme" : "light-theme"}>
      <h1>Welcome, {state.userName || "Guest"}!</h1>
      <p>Count: {state.count}</p>
      <p>Notifications: {state.notifications}</p>

      <button onClick={handleIncrement}>+1</button>
      <button onClick={handleThemeToggle}>
        Switch to {state.theme === "light" ? "Dark" : "Light"} Theme
      </button>
      <button onClick={handleToggleHistory}>
        {state.showHistory ? "Hide" : "Show"} History
      </button>
      <button onClick={handleAddNotification}>Add Notification</button>
      <button onClick={handleClearNotifications}>Clear Notifications</button>

      <input
        type="text"
        placeholder="Enter your name"
        value={state.userName}
        onChange={(e) => handleNameChange(e.target.value)}
      />

      {state.showHistory && <div>History panel would be here...</div>}
    </div>
  );
}
```

```jsx
// ✅ Separate independent state pieces
function Counter() {
  const [count, setCount] = React.useState(0);
  const [theme, setTheme] = React.useState("light");
  const [userName, setUserName] = React.useState("");
  const [showHistory, setShowHistory] = React.useState(false);
  const [notifications, setNotifications] = React.useState(0);

  // Easy to update each piece independently - direct updates
  function handleIncrement() {
    setCount(count + 1);
  }

  function handleThemeToggle() {
    setTheme(theme === "light" ? "dark" : "light");
  }

  function handleNameChange(name) {
    setUserName(name);
  }

  function handleToggleHistory() {
    setShowHistory(!showHistory);
  }

  function handleAddNotification() {
    setNotifications(notifications + 1);
  }

  function handleClearNotifications() {
    setNotifications(0);
  }

  return (
    <div className={theme === "dark" ? "dark-theme" : "light-theme"}>
      <h1>Welcome, {userName || "Guest"}!</h1>
      <p>Count: {count}</p>
      <p>Notifications: {notifications}</p>

      <button onClick={handleIncrement}>+1</button>
      <button onClick={handleThemeToggle}>
        Switch to {theme === "light" ? "Dark" : "Light"} Theme
      </button>
      <button onClick={handleToggleHistory}>
        {showHistory ? "Hide" : "Show"} History
      </button>
      <button onClick={handleAddNotification}>Add Notification</button>
      <button onClick={handleClearNotifications}>Clear Notifications</button>

      <input
        type="text"
        placeholder="Enter your name"
        value={userName}
        onChange={(e) => handleNameChange(e.target.value)}
      />

      {showHistory && <div>History panel would be here...</div>}
    </div>
  );
}
```

**Benefits of separating independent state:**

- **Simpler Updates**: No need for spread operator on every update
- **Better Performance**: React can optimize re-renders for individual state changes
- **Clearer Intent**: Each state piece has a clear, single responsibility
- **Easier Testing**: You can test each state piece independently
- **Less Error-Prone**: No risk of accidentally overwriting other state properties

### 3. **Use Functional Updates**

```jsx
function Counter() {
  const [count, setCount] = React.useState(0);

  // ✅ When new state depends on previous state
  function increment() {
    setCount((prevCount) => prevCount + 1);
  }

  function incrementByStep(step) {
    setCount((prevCount) => prevCount + step);
  }

  function handleAddFive() {
    incrementByStep(5);
  }

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>+1</button>
      <button onClick={handleAddFive}>+5</button>
    </div>
  );
}
```
