import { useState } from 'react';
import './App.css';
import DynamicTable from './components/Table';
import Guide from './components/Guide';

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
            if (variable === 'T') {
                acc[variable] = 'T';
            } else if (variable === 'F') {
                acc[variable] = 'F';
            } else {
                acc[variable] = (i >> variables.size - Array.from(variables).indexOf(variable) - 1) & 1 ? 'F' : 'T';
            }
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
            return <Guide/>;
        }
    } catch (error) {
        return <Guide/>;
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
    </div>

  );
}

export default App;
