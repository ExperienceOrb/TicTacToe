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

function makePlayerMove(space) {
    if (turn && !spaceTaken(spaces_X+spaces_O, space)) {
        spaces_X |= space;
        updateGUI();
        turn = !turn;
        var res = testForWinner(spaces_X, spaces_O, 0);
        if (checkWinner()=="none"){
            document.getElementById("whoseturn").src="assets/computer.png";
            stateChange(-1);
        }
    }
}

function stateChange(newState) {
    setTimeout(function () {
        if (newState == -1) {
            console.log("With Alpha-Beta Pruning")
            console.time('AI Move');
            makeAIMove();
            console.timeEnd('AI Move')
        }
    }, 1000);
}

function makeAIMove() {
    var b1, b2;
    if (turn) {
        b1 = spaces_X;
        b2 = spaces_O;
    } else {
        b1 = spaces_O;
        b2 = spaces_X;
    }
    var best = -11, space = 0;
    for (var i = 0; i<possibleSpaces.length; i++) {
        var s = possibleSpaces[i];
        if (spaceTaken(getBoard(b1, b2), s)) continue;
        var board1 = b1 | s;
        var temp = minimax(board1, b2, 0, true, -11, 11);
        if (temp>best) {
            best = temp;
            space = s;
        }
    }
    if (turn) {
        spaces_X |= space;
    } else {
        spaces_O |= space;
    }
    checkWinner();
    updateGUI();
    turn = !turn;
    document.getElementById("whoseturn").src="assets/human.png";
}

//orignal = true: maximizer
//original = false: minimizer
//alpha is the best value from the maximizer
//best is the 'worst' value from the minimizer
function minimax(b1, b2, depth, original, alpha, beta) {
    var talpha = alpha + 0;
    var tbeta = beta + 0;
    var result = testForWinner(b1, b2, depth);
    if (result !=0 || getBoard(b1, b2)==FULL_BOARD) {
        return result;
    }
    original = !original;
    var mostLikelyScore = original ? -11 : 11;
    for (var i = 0; i<possibleSpaces.length; i++){
        var s = possibleSpaces[i];
        if (spaceTaken(getBoard(b1, b2), s)) continue;
        if (original){
            var nb1 = b1 | s;
            var s = minimax(nb1, b2, depth+1, original, talpha, tbeta);
            if (s >= mostLikelyScore) mostLikelyScore = s;
            talpha = mostLikelyScore;
            if (mostLikelyScore >= beta) return mostLikelyScore;
        } else {
            var nb2 = b2 | s;
            var s = minimax(b1, nb2, depth+1, original, talpha, tbeta);
            if (s <= mostLikelyScore) mostLikelyScore = s;
            tbeta = mostLikelyScore;
            if (mostLikelyScore <= alpha) return mostLikelyScore;
        }
    }
    return mostLikelyScore;
}

function spaceTaken(board, space) {
    return ((board&space)==space);
}

function reset() {
    //turn = true;
    spaces_O = 0;
    spaces_X = 0;
    document.getElementById("winner").className = "hidden";
    updateGUI();
    if (!turn) {
        makeAIMove();
    }
}

function getBoard(s1, s2) {
    return s1|s2;
}

function testForWinner(b1, b2, depth) {
    for (var i = 0; i<winningValues.length; i++) {
        var s = winningValues[i];
        if ((b1&s)==s) {
            return 10-depth;
        }
        else if ((b2&s)==s) {
            return depth-10;
        }
    }
    return 0;
}

function checkWinner() {
    var res = testForWinner(spaces_X, spaces_O, 0);
    if (res==10) {
        document.getElementById("windisplay").innerHTML = "HUMAN WINS!!";
        document.getElementById("winner").className = "shown";
        return "human";
    } else if (res==-10) {
        document.getElementById("windisplay").innerHTML = "COMPUTER WINS!!";
        document.getElementById("winner").className = "shown";
        return "computer";
    } else {
        if (getBoard(spaces_X, spaces_O)==FULL_BOARD) {
            document.getElementById("windisplay").innerHTML = "NOBODY WINS!!";
            document.getElementById("winner").className = "shown";
            return "tie";
        }
    }
    return "none";
}

function updateGUI() {
    for (var i = 0; i<9; i++) {
        var index = Math.pow(2, i);
        if ((spaces_X&index)==index) {
            document.getElementById(index).innerHTML = "X";
        }
        else if ((spaces_O&index)==index) {
            document.getElementById(index).innerHTML = "O";
        } else {
            document.getElementById(index).innerHTML = " ";
        }
    }
}
