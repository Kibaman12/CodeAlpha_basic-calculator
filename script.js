const currentDisplay = document.getElementById('current-operand');
const previousDisplay = document.getElementById('previous-operand');

let currentOperand = '0';
let previousOperand = '';
let operation = undefined;
let shouldResetScreen = false;

function appendNumber(number) {
    if (currentOperand === '0' && number !== '.') {
        currentOperand = number;
    } else {
        if (number === '.' && currentOperand.includes('.')) return;
        if (shouldResetScreen) {
            currentOperand = number;
            shouldResetScreen = false;
        } else {
            currentOperand = currentOperand.toString() + number.toString();
        }
    }
    updateDisplay();
}

function setOperation(op) {
    if (currentOperand === '') return;
    if (previousOperand !== '') {
        calculate();
    }
    operation = op;
    previousOperand = currentOperand;
    currentOperand = '';
    updateDisplay();
}

function calculate() {
    let computation;
    const prev = parseFloat(previousOperand);
    const current = parseFloat(currentOperand);
    
    if (isNaN(prev) || isNaN(current)) return;

    switch (operation) {
        case '+':
            computation = prev + current;
            break;
        case '−':
            computation = prev - current;
            break;
        case '×':
            computation = prev * current;
            break;
        case '÷':
            computation = current === 0 ? "Error" : prev / current;
            break;
        default:
            return;
    }
    
    // Handle floating point precision errors slightly
    currentOperand = Math.round(computation * 10000000000) / 10000000000;
    operation = undefined;
    previousOperand = '';
    shouldResetScreen = true;
    updateDisplay();
}

function clearDisplay() {
    currentOperand = '0';
    previousOperand = '';
    operation = undefined;
    updateDisplay();
}

function deleteLast() {
    if (shouldResetScreen || currentOperand === "Error") {
        clearDisplay();
        return;
    }
    currentOperand = currentOperand.toString().slice(0, -1);
    if (currentOperand === '') currentOperand = '0';
    updateDisplay();
}

function updateDisplay() {
    currentDisplay.innerText = currentOperand;
    if (operation != null) {
        previousDisplay.innerText = `${previousOperand} ${operation}`;
    } else {
        previousDisplay.innerText = '';
    }
}

// Keyboard Support
document.addEventListener('keydown', (e) => {
    if (e.key >= 0 && e.key <= 9) appendNumber(e.key);
    if (e.key === '.') appendNumber('.');
    if (e.key === '=' || e.key === 'Enter') {
        e.preventDefault(); // Prevent form submission if applicable
        calculate();
    }
    if (e.key === 'Backspace') deleteLast();
    if (e.key === 'Escape') clearDisplay();
    if (e.key === '+') setOperation('+');
    if (e.key === '-') setOperation('−');
    if (e.key === '*') setOperation('×');
    if (e.key === '/') {
        e.preventDefault(); // Prevent quick-search in some browsers
        setOperation('÷');
    }
});