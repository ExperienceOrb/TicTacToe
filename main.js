var turn = true;
var winner = 0;
var possibleSpaces =
[
    1, 2, 4, 8, 16, 32, 64, 128, 256
];
var winningValues =
[
    7, 56, 448, 273, 84, 292, 146, 73
];
var FULL_BOARD = 511;
var spaces_X = 0;
var spaces_O = 0;

function makePlayerMove(spaces) {
    spaces_X |= spaces;
    updateGUI();
    turn = !turn;
    if (testForWinner(spaces_X, spaces_O, 0) == 10){
        alert('winner');
    }else{
        makeAIMove();
    }
}

function makeAIMove() {
    //code
}

function getBoard(s1, s2) {
    return s1|s2;
}

function testForWinner(b1, b2, depth) {
    for (var i = 0; i<winningValues.length; i++) {
        var s = winningValues[i];
        console.log(b1&s);
        if ((b1&s)==s) {
            return 10-depth;
        }
        else if ((b2&s)==s) {
            return depth-10;
        }
        else{
            return 0;
        }
    }
}

function updateGUI() {
    for (var i = 0; i<9; i++) {
        var index = Math.pow(2, i);
        if ((spaces_X&index)==index) {
            document.getElementById(index).innerHTML = "X";
        }
        else if ((spaces_O&index)==index) {
            document.getElementById(index).innerHTML = "O";
        }
    }
}