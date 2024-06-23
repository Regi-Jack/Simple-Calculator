let btn = document.querySelectorAll(".btn");
let resultSpace = document.querySelector(".resultSpace");
let theme = document.querySelector(".themeIcon");
let currOp = null;
let currNum = "0";
let flag = 0;
let operatorStack = [];
let operandStack = [];

function viewStack() {
    console.log("operand Stack: ");
    for (let i = 0; i < operandStack.length; i++) {
        console.log(operandStack[i]);
    }
    console.log("operator Stack: ");
    for (let i = 0; i < operatorStack.length; i++) {
        console.log(operatorStack[i]);
    }
}

function priority(operator) {
    switch (operator) {
        //greater number = higher priority
        case "%":
            return 6;
        case "/":
            return 5;
        case "x":
            return 4;
        case "+":
            return 3;
        case "-":
            return 3;
        default:
            return 1;
    }
}

function calculate(num1, operator, num2) {
    if (operator === "/") {
        if (num2 === 0) {
            resultSpace.innerHTML = "Error";
            return null;
        }
        return (num1 / num2).toFixed(3);
    } else if (operator === "x") return num1 * num2;
    else if (operator === "+") return num1 + num2;
    else if (operator === "-") return num1 - num2;
    else if (operator === "%") return ((num1 * num2) / 100).toFixed(3);
}

function handleNumber(num) {
    currNum += num;
    if (resultSpace.innerHTML == "0") {
        resultSpace.innerHTML = num;
    } else {
        resultSpace.innerHTML += num;
    }
}

function handleAC() {
    resultSpace.innerHTML = "0";
    currOp = null;
    currNum = "0";
    operatorStack = [];
    operandStack = [];
}

function handleDel() {
    if (resultSpace.innerHTML == "Error") handleAC();
    else if (resultSpace.innerHTML == "NaN") handleAC();
    else if (flag == 1) {
        flag = 0;
        handleAC();
    } else {
        resultSpace.innerHTML = resultSpace.innerHTML.slice(0, -1);
        currNum = currNum.slice(0,-1);
    }
}

function handleSign() {
    if (operatorStack.length != 0) {
        resultSpace.innerHTML = "Error";
        return;
    }
    resultSpace.innerHTML = (-1 * parseFloat(resultSpace.innerHTML)).toString();
    currNum = (-1*parseFloat(currNum)).toString();
}

function handleDecimal() {
    if (!currNum.includes(".")) {
        currNum += ".";
        resultSpace.innerHTML += ".";
    }
}

function handleEqual() {
    flag = 1;
    operandStack.push(parseFloat(currNum));
    while (operatorStack.length != 0) {
        currOp = operatorStack.pop();
        num2 = operandStack.pop();
        num1 = operandStack.pop();
        let result = calculate(num1, currOp, num2);
        if (result === null) return; // Exit if division by zero occurred
        operandStack.push(result);
    }
    currNum = operandStack.pop().toString();
    resultSpace.innerHTML = currNum;
}

function handleOperator(operator) {
    console.log("currNum: ", currNum);

    resultSpace.innerHTML += operator;
    operandStack.push(parseFloat(currNum));
    console.log("pushing operand: ", currNum);
    currNum = "";
    while (1) {
        if (operatorStack.length == 0) {
            operatorStack.push(operator);
            console.log("pushing operator due to empty stack: ", operator);
            return;
        } else if (
            priority(operator) >
            priority(operatorStack[operatorStack.length - 1])
        ) {
            operatorStack.push(operator);
            console.log("pushing operator due to higher priority: ", operator);
            return;
        } else {
            num2 = operandStack.pop();
            num1 = operandStack.pop();
            currOp = operatorStack.pop();
            console.log("popped for evaluation: ", num1, currOp, num2);
            let result = calculate(num1, currOp, num2);
            if (result === null) return; // Exit if division by zero occurred
            operandStack.push(result);
            console.log(
                "pushed evaluated expression: ",
                calculate(num1, currOp, num2)
            );
        }
    }

    //push currNum to stack
    //make currNum set to ""
    //push operator to stack
}

for (let i = 0; i < btn.length; i++) {
    btn[i].addEventListener("click", (e) => {
        let clicked = e.target.textContent;
        if (!isNaN(clicked)) {
            handleNumber(clicked);
        } else if (clicked === "AC") {
            handleAC();
        } else if (clicked === "Del") {
            handleDel();
        } else if (clicked === "+-") {
            handleSign();
        } else if (clicked === ".") {
            handleDecimal();
        } else if (clicked === "=") {
            handleEqual();
        } else {
            handleOperator(clicked);
            viewStack();
        }
    });
}

theme.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
});
