//Varshini
//Module for Node.js
const readline = require('readline');

//Symbol table using a plain object
const symbolTable = {};

//Function to handle variable assignment, deletion, substitutiom
function preparePostfix(line, symbolTable) {
  //Split the input line into tokens by spaces
  const tokens = line.trim().split(" ");
  //Create a queue to process them in FIFO order
  const tokenQueue = [...tokens];
  //To store the final list of tokens 
  const tokenProcessed = [];

  //Checks if the line contains the =/# operation
  if (tokenQueue.includes("=") || tokenQueue.includes("#")) {
    //Gets the last token
    const operator = tokenQueue[tokenQueue.length - 1];

    //Handles the assignment
    if (operator === "=") {
      //Extracts the variiable letter
      const variableName = tokenQueue[0];
      //Validates that the variable is a single uppercase letter
      if (!/^[A-Z]$/.test(variableName)) {
        throw new Error(`Invalid assignment target: ${variableName}`);
      }
      //Expression to assign = all tokens between variable and "="
      const expressionTokens = tokenQueue.slice(1, tokenQueue.length - 1);
      //Storing the evaluated the expression
      const evaluatedValue = evaluatePostfix(expressionTokens);
      //Store in symbol table
      symbolTable[variableName] = evaluatedValue[0];
      //Print out the symbol table to show variables and values
      console.log("Symbol Table: ", symbolTable);
      return null;
    }
    
    //Handles the variable deletion 
    if (operator === "#") {
      //stores the variable name to delete
      const variableToDelete = tokenQueue[tokenQueue.length - 2];

      //Ensuring the variable is a valid one
      if (!/^[A-Z]$/.test(variableToDelete)) {
        throw new Error(`Invalid variable name: ${variableToDelete}`);
      }
      //If the variable doesn't exist in the symbol table, throw an error
      if (symbolTable[variableToDelete] === undefined) {
        throw new Error(`Cannot delete: variable ${variableToDelete} is not defined.`);
      }
      //Remove the variable from the symbol table
      delete symbolTable[variableToDelete];
      //Message to show that the variable is deleted
      console.log(`Variable ${variableToDelete} deleted.`);
      //Print out the symbol table to show the remaining variables
      console.log("Symbol Table: ", symbolTable);
      //Nothing to evaluate
      return null;
    }
  }
  
  //Loops through tokens and replacees variables with their values
  while (tokenQueue.length > 0) {
    //Dequeue the next token
    const tokenCurrent = tokenQueue.shift();

    //If the token is a variable, replace with its value from the symboltable
    if (/^[A-Z]$/.test(tokenCurrent)) {
      if (symbolTable[tokenCurrent] === undefined) {
        throw new Error(`Variable ${tokenCurrent} is not defined.`);
      }
      tokenProcessed.push(symbolTable[tokenCurrent]);
    } else {
      //Otherwise, push the token with no changes
      tokenProcessed.push(tokenCurrent);
    }
  }
  //Return the fully processed postfix expression ready for evaluation
  return tokenProcessed;
}

//Function to evaluate a postfix expression
function evaluatePostfix(arr) {
  //Initialize an empty stack to hold numbers
  let stack = [];

  //Loops through each token in the array
  for (let token of arr) {
    //If the token is a number, convert it and push onto the stack
    if (!isNaN(token)) {
      stack.push(Number(token));
      //Check if the token is a single operator
    } else if (["sin", "cos", "tan", "log", "sqrt", "!"].includes(token)) {
      //Pop one operand from the stack
      const val = stack.pop();
      //Apply the operation and push the result to stack
      stack.push(applySingleOperator(token, val));
      //Else operator is binry operation
    } else {
      //Pop the top double operands from the stack
      const val1 = stack.pop();
      const val2 = stack.pop();
      //Apply the operation and push the result to stack
      stack.push(applyDoubleOperator(token, val2, val1));
    }
  }
  //Return the final stack
  return stack;
}

//Function to apply the single operator
function applySingleOperator(op, value) {
  switch (op) {
    case "sin": //Sine
      return Math.sin(value * Math.PI / 180);
    case "cos": //Cosinr
      return Math.cos(value * Math.PI / 180);
    case "tan": //Tangent
      return Math.tan(value * Math.PI / 180);
    case "log": //Logarithm
      return Math.log10(value);
    case "sqrt": //Square root
      return Math.sqrt(value);
    case "!": //Factorial
      return factorial(value);
    default:
      throw new Error(`Unsupported operator: ${op}`);
  }
}

//Function to apply the operator
function applyDoubleOperator(op, a, b) {
  switch (op) {
    case "+": //Addition
      return a + b;
    case "-": //Subtraction
      return a - b;
    case "*": //Multiplication
      return a * b;
    case "/": //Divide
      return Math.trunc(a / b);
    case "^": //Power
      return a ** b;
    default:
      throw new Error(`Unsupported operator: ${op}`);
  }
}

//Function to compute factorial of a number using recursion
function factorial(n) {
  if (n < 0) throw new Error("Cannot compute factorial of a negative number");
  if (n == 0 || n == 1) return 1;
  return n * factorial(n - 1);
}

// Readline setup
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log("Welcome to Postfix++ Calculator. Type 'exit' to quit.");

//Function to read userinput 
function userInput() {
  //Prompt the user to enter input
  rl.question("> ", (inputLine) => {
    //If the user types 'exit',stop the program
    if (inputLine.trim().toLowerCase() === 'exit') {
      //Closes the interface
      rl.close();
      //Ends the recursion
      return;
    }
    try {
      //Process the input line
      const tokensPrepared = preparePostfix(inputLine, symbolTable);

      //If the line was an expression, evaluate it
      if (tokensPrepared) {

      //Compute and store the final result
        const result = evaluatePostfix(tokensPrepared);
        //Print the result
        console.log("Result: [ " + result.join(" ") + " ]");
      }
    } catch (error) {
      //Throw error message, if an error
      console.log("Error:", error.message);
    }
    //Repeat the input prompt after processing the current line
    userInput();
  });
}

//Start the input loop as soon as the program runs
userInput(); 
