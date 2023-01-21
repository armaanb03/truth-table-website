import { useState } from 'react';
import './App.css';
import DynamicTable from './components/Table';

function App() {
  function truthTable(input) {
    let expression = input.replace(/\s/g, '');
    const variables = new Set(expression.match(/[A-Za-z]/g));
    const rows = [];

    if (!checkWellFormed(input) || !checkOperatorsAndSymbols(input)) {
        return [false];
    }

    for (let i = 0; i < 2**variables.size; i++) {
        const assignments = Array.from(variables).reduce((acc, variable) => {
            acc[variable] = (i >> variables.size - Array.from(variables).indexOf(variable) - 1) & 1 ? 'F' : 'T';
            return acc;
        }, {});

        rows.push({
            assignments: assignments,
            value: recurEvaluate(replaceValues(expression, variables, assignments))
        });
    }
    return rows;
  }

  function replaceValues(input, variables, assignments) {
      variables.forEach(variable => 
          input = input.replaceAll(variable, assignments[variable]));
      
      return input;
  }


  function recurEvaluate(expression) {
      let numBrackets = (expression.match(/\(/g) || []).length;
      
      if (numBrackets === 0) {
          return expression;
      }

      if (numBrackets === 1) {
          let returnVal = evaluate(expression);
          return returnVal;
      }

      let rightBrack = expression.indexOf(')');
      let nearestLeft = 0;

      const substr = expression.substring(0, rightBrack).split('').reverse().join('');
      
      for (let i = 1; i < substr.length; i++) {
          if (expression.charAt(i) === '(') {
              nearestLeft = i;
          }
      }

      let currentExpr = expression.substring(nearestLeft, rightBrack+1);

      return recurEvaluate(expression.replace(currentExpr, evaluate(currentExpr)));
  }

  function evaluate(expression) {
      expression = expression.slice(1, expression.length - 1);
      const connective = expression.replaceAll('F', '').replaceAll('T', '');

      if (connective === '~') {
          if (expression.charAt(expression.length-1) === 'F') {
              return 'T';
          } else {
              return 'F';
          }
      } else if (connective === '&') {
          if (expression.charAt(0) === 'T' && expression.charAt(expression.length-1) === 'T') {
              return 'T';
          } else {
              return 'F';
          }
      } else if (connective === '|') {
          if (expression.charAt(0) === 'F' && expression.charAt(expression.length-1) === 'F') {
              return 'F';
          } else {
              return 'T';
          }
      } else if (connective === '-->') {
          if (expression.charAt(0) === 'T' && expression.charAt(expression.length-1) === 'F') {
              return 'F';
          } else {
              return 'T';
          }
      } else if (connective === '<->') {
          if (expression.charAt(0) === 'T' && expression.charAt(expression.length-1) === 'T') {
              return 'T';
          } else if (expression.charAt(0) === 'F' && expression.charAt(expression.length-1) === 'F') {
              return 'T';
          } else {
              return 'F';
          }
      }

      return null;
  }

  function checkWellFormed(expression) {
      expression = expression.replace(/\s/g, '');
      let symbols = expression.match(/[A-Za-z]/g);
      let stack = []
      let numLeft = 0;
      let numRight = 0;
      let counter = 0;
      let isBalanced = true;

      for (let n of expression) {
          if (n === '(') {
              stack.push(n);
              numLeft++;
          } else if (n === ')') {
              stack.pop();
              numRight++;
          }

          if ((numRight === numLeft || numRight > numLeft) && counter+1 !== expression.length) {
              isBalanced = false;
          }

          if (symbols.indexOf(n) > -1 && (expression.charAt(counter-1) !== '(' && expression.charAt(counter+1) !== ')')) {
              isBalanced = false;
          } else if (symbols.indexOf(n) > -1 && expression.charAt(counter-1) === '(' && expression.charAt(counter+1) === ')') {
            isBalanced = false;
          }

          counter++;
      }

      return stack.length === 0 && isBalanced;
  }

  function checkOperatorsAndSymbols(expression) {
      expression = expression.replace(/\s/g, '').replaceAll('-->', '>').replaceAll('<->', '<').replaceAll('||', '|');
      let operators = ['&', '|', '~', '>', '<'];
      let symbols = expression.match(/[A-Za-z]/g);
      let counter = 0;
      let valid = true;

      for (let n of expression) {
          if (operators.indexOf(n) > -1) {
              let symbolBool = ((!(symbols.indexOf(expression.charAt(counter-1)) > -1) && !(symbols.indexOf(expression.charAt(counter+1)) > -1)));
              let bracketBool = !(expression.charAt(counter-1) === ')' && expression.charAt(counter+1) === '(');

              if (n === '~' && expression.charAt(counter-1) !== '(') {
                  valid = false;
              } else if (n !== '~' && (symbolBool && bracketBool)) {
                  valid = false;
              }
          }
          counter++;
      }

      return valid;
  }

  const [message, setMessage] = useState('');

  const handleChange = e => {
    setMessage(e.target.value);
  }

  const renderTruthTable = () => {
    try {
        if (message !== "" && checkOperatorsAndSymbols(message) && checkWellFormed(message)) {
            return <DynamicTable data={truthTable(message)} message={message}/>;
        } else {
            <div>Enter a valid input.</div>
        }
    } catch (error) {
        return <div>Enter a valid input.</div>
    }
  }

  return (
    <div class="App">
        <h1 class='title'>TRUTH TABLE GENERATOR</h1> <br/>
        <form action="" class="search-wrapper">
            <input 
            name="wff"
            class="input-box"
            placeHolder="Enter a well formed formula"
            type="text" 
            id="userinput" 
            value={message}
            onChange={handleChange}
            /> 
        </form>
        <br/>
        <br/>
        <div className='table-display'>{renderTruthTable()}</div>

        <div class="wave">
            <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" class="shape-fill"></path>
            </svg>
        </div>    
    </div>

  );
}

export default App;
