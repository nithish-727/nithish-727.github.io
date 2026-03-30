const display = document.getElementById("display");
const keys = document.querySelector(".keys");

const state = {
  current: "0",
  previous: null,
  operator: null,
  overwrite: true,
};

const formatResult = (value) => {
  if (!Number.isFinite(value)) {
    return "Error";
  }

  const formatted = Number.parseFloat(value.toFixed(10)).toString();
  return formatted;
};

const updateDisplay = () => {
  display.value = state.current;
};

const clearAll = () => {
  state.current = "0";
  state.previous = null;
  state.operator = null;
  state.overwrite = true;
  updateDisplay();
};

const calculate = (first, second, operator) => {
  switch (operator) {
    case "+":
      return first + second;
    case "-":
      return first - second;
    case "*":
      return first * second;
    case "/":
      return second === 0 ? Infinity : first / second;
    default:
      return second;
  }
};

const inputDigit = (digit) => {
  if (state.overwrite) {
    state.current = digit;
    state.overwrite = false;
  } else {
    state.current = state.current === "0" ? digit : state.current + digit;
  }
  updateDisplay();
};

const inputDecimal = () => {
  if (state.overwrite) {
    state.current = "0.";
    state.overwrite = false;
  } else if (!state.current.includes(".")) {
    state.current += ".";
  }
  updateDisplay();
};

const chooseOperator = (nextOperator) => {
  const currentValue = Number(state.current);

  if (state.previous === null || state.operator === null) {
    state.previous = currentValue;
  } else if (!state.overwrite) {
    const computed = calculate(state.previous, currentValue, state.operator);
    state.previous = computed;
    state.current = formatResult(computed);
  }

  state.operator = nextOperator;
  state.overwrite = true;
  updateDisplay();
};

const evaluate = () => {
  if (state.operator === null || state.previous === null) {
    return;
  }

  const computed = calculate(state.previous, Number(state.current), state.operator);
  state.current = formatResult(computed);
  state.previous = null;
  state.operator = null;
  state.overwrite = true;
  updateDisplay();
};

const toggleSign = () => {
  if (state.current === "0" || state.current === "Error") {
    return;
  }
  state.current = state.current.startsWith("-")
    ? state.current.slice(1)
    : `-${state.current}`;
  updateDisplay();
};

const percent = () => {
  if (state.current === "Error") {
    return;
  }
  state.current = formatResult(Number(state.current) / 100);
  state.overwrite = true;
  updateDisplay();
};

keys.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) {
    return;
  }

  const { action, value } = button.dataset;

  switch (action) {
    case "digit":
      inputDigit(value);
      break;
    case "decimal":
      inputDecimal();
      break;
    case "operator":
      chooseOperator(value);
      break;
    case "equals":
      evaluate();
      break;
    case "clear":
      clearAll();
      break;
    case "sign":
      toggleSign();
      break;
    case "percent":
      percent();
      break;
    default:
      break;
  }
});

document.addEventListener("keydown", (event) => {
  const { key } = event;

  if (/^[0-9]$/.test(key)) {
    inputDigit(key);
  } else if (key === ".") {
    inputDecimal();
  } else if (["+", "-", "*", "/"].includes(key)) {
    chooseOperator(key);
  } else if (key === "Enter" || key === "=") {
    evaluate();
  } else if (key === "Backspace") {
    if (state.overwrite || state.current.length === 1) {
      state.current = "0";
      state.overwrite = true;
    } else {
      state.current = state.current.slice(0, -1);
    }
    updateDisplay();
  } else if (key.toLowerCase() === "c" || key === "Escape") {
    clearAll();
  } else if (key === "%") {
    percent();
  }
});

updateDisplay();
