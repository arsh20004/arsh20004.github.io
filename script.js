
document.addEventListener('DOMContentLoaded', function () {
     expressionInput = document.getElementById('expression');
  
     buttons = document.querySelectorAll('button');
  
    buttons.forEach(function (button) {
      button.addEventListener('click', function () {
        handleButtonClick(button.textContent);
      });
    });
  
    function handleButtonClick(value) {
      switch (value) {
        case '=':
          calculateResult();
          break;
        case 'Delete':
          deleteLastCharacter();
          break;
        case 'clear':
          clearExpression();
          break;
         default:
          appendToExpression(value);
          break;
      }
    }
  
    function appendToExpression(value) {
      expressionInput.value += value;
    }
  
    function deleteLastCharacter() {
      expressionInput.value = expressionInput.value.slice(0, -1);
    }
  
    function clearExpression() {
      expressionInput.value = '';
    }
  
  
    function calculateResult() {
      try {
        const result = eval(expressionInput.value);
        expressionInput.value = result;
      } catch (error) {
        expressionInput.value = 'Error';
      }
    }
  });
  