var rules = [
  'S+S',
  'S',
  'S',
  'S',
  'S-S',
  'S*S',
  'S/S',
  '(S)',
  '(S)',
  '(S)',
  'Z',
  'Z',
  'Z',
  'Z',
  'Z',
];

function disableButton(name) {
  document.getElementById(name).disabled = true;
}
function enableButton(name) {
  document.getElementById(name).disabled = false;
}
function addRow(step, oldState, newState, rule) {
  var table = document
    .getElementById('output')
    .getElementsByTagName('tbody')[0];
  var row = table.insertRow();
  var cell1 = row.insertCell();
  var cell2 = row.insertCell();
  var cell3 = row.insertCell();
  var cell4 = row.insertCell();
  cell1.innerHTML = step;
  cell2.innerHTML = oldState;
  cell3.innerHTML = newState;
  cell4.innerHTML = rule;
}
function clearRows() {
  var table = document.getElementById('output');
  var rowCount = table.rows.length;
  for (var i = rowCount - 1; i >= 1; i--) {
    table.deleteRow(i);
  }
}

function nextState(state) {
  var used = [];
  state = state.replaceAll('S', () => {
    var rule = rules[Math.floor(Math.random() * rules.length)];
    used.push('S -> ' + rule);
    return rule;
  });
  state = state.replaceAll('Z', () => {
    var x = Math.floor(Math.random() * 10);
    used.push('Z -> ' + x);
    return x;
  });
  return { state, used };
}
function isTerminal(state) {
  if (state.includes('S') || state.includes('Z')) {
    return false;
  }
  return true;
}
async function onCreate() {
  var currentState = 'S';
  var currentStep = 0;
  disableButton('correctexpression');
  disableButton('forward');
  disableButton('help');
  disableButton('aRange');
  enableButton('cancel');

  clearRows();
  while (!isTerminal(currentState)) {
    var oldState = currentState;
    var result = nextState(currentState);
    currentState = result.state;
    addRow(++currentStep, oldState, currentState, result.used.join(','));

    if (currentState.length > 100000) {
      alert('stopped execution - expression too long');
      break;
    }
    await new Promise((r) =>
      setTimeout(r, document.getElementById('aRange').value * 1000),
    );
  }
  enableButton('correctexpression');
  enableButton('forward');
  enableButton('help');
  enableButton('aRange');
  disableButton('cancel');
  console.log(currentState);
}

var stepState = null;
var stepCounter = 0;
function onForward() {
  if (stepState == null) {
    clearRows();
    disableButton('correctexpression');
    disableButton('help');
    disableButton('aRange');
    enableButton('cancel');
    stepState = 'S';
    stepCounter = 0;
  }
  var oldState = stepState;
  var result = nextState(stepState);
  stepState = result.state;
  addRow(++stepCounter, oldState, stepState, result.used.join(','));

  if (stepState.length > 100000) {
    alert('stopped execution - expression too long');
  }
  if (isTerminal(stepState)) {
    enableButton('correctexpression');
    enableButton('help');
    enableButton('aRange');
    disableButton('cancel');
    alert("reached final state")
    stepState = null;
    stepCounter= 0;
  }
}
