(function () {
    "use strict";

    angular.module('myApp', []).factory('backGammonLogicService',
            function () {

                // This is a simple implementation for constant and enum, so the value
                // can be changed. Since this is a small personal project, all caps
                // naming convention should be enough.
                //var ILLEGAL_CODE = enumService.ILLEGAL_CODE;
                var ILLEGAL_CODE,

                    ILLEGAL_CODE = {
                        ILLEGAL_MOVE: 'ILLEGAL_MOVE',
                        ILLEGAL_DELTA: 'ILLEGAL_DELTA',
                        INCOMPLETE_MOVE: 'INCOMPLETE_MOVE',
                        NO_PLAYER:'NO_PLAYER'
                    };


                /**
                 * Returns the initial backgammon board as a 28 X 15 board. Index 0 and 27 represent blots exiting the board,
                 * Index 1 and 26 represent blots taken during game play.
                 *
                 *Each player has 15 blots of their own the initial arrangment is: two in each players 24 point, five on each
                 * players thirteen point, three on each players eight point, and five on each player's six point.
                 *
                 *  @returns {*[]}
                 */

                function getInitialBoard() {
                    return [['', '', '', '' , '', '', '', '', '' ,'' ,'', '','','',''],//opponent exists the board
                        ['', '', '', '' , '', '', '', '', '' ,'' ,'', '','','',''],//blots taken
                        ['W', 'W', '', '' , '', '', '', '', '' ,'' ,'', '','','',''],//start game board 24   2
                        ['', '', '', '' , '', '', '', '', '' ,'' ,'', '','','',''],//23  3
                        ['', '', '', '' , '', '', '', '', '' ,'' ,'', '','','',''],//22  4
                        ['', '', '', '' , '', '', '', '', '' ,'' ,'', '','','',''],//21  5
                        ['', '', '', '' , '', '', '', '', '' ,'' ,'', '','','',''],//20  6
                        ['B', 'B', 'B', 'B' , 'B', '', '', '', '' ,'' ,'', '','','',''],//19 7
                        ['', '', '', '' , '', '', '', '', '' ,'' ,'', '','','',''],//18  8
                        ['B', 'B', 'B', '' , '', '', '', '', '' ,'' ,'', '','','',''],//17  9
                        ['', '', '', '' , '', '', '', '', '' ,'' ,'', '','','',''],//16 10
                        ['', '', '', '' , '', '', '', '', '' ,'' ,'', '','','',''],//15 11
                        ['', '', '', '' , '', '', '', '', '' ,'' ,'', '','','',''],//14 12
                        ['W', 'W', 'W', 'W' , 'W', '', '', '', '' ,'' ,'', '','','',''],//13 13
                        ['B', 'B', 'B', 'B' , 'B', '', '', '', '' ,'' ,'', '','','',''],//12 14
                        ['', '', '', '' , '', '', '', '', '' ,'' ,'', '','','',''],//11 15
                        ['', '', '', '' , '', '', '', '', '' ,'' ,'', '','','',''],//10 16
                        ['', '', '', '' , '', '', '', '', '' ,'' ,'', '','','',''],//9 17
                        ['W', 'W', 'W', '' , '', '', '', '', '' ,'' ,'', '','','',''],//8 18
                        ['', '', '', '' , '', '', '', '', '' ,'' ,'', '','','',''],//7 19
                        ['W', 'W', 'W', 'W' , 'W', '', '', '', '' ,'' ,'', '','','',''],//6 20
                        ['', '', '', '' , '', '', '', '', '' ,'' ,'', '','','',''],//5 21
                        ['', '', '', '' , '', '', '', '', '' ,'' ,'', '','','',''],//4 22
                        ['', '', '', '' , '', '', '', '', '' ,'' ,'', '','','',''],//3 23
                        ['', '', '', '' , '', '', '', '', '' ,'' ,'', '','','',''],//2 24
                        ['B', 'B', '', '' , '', '', '', '', '' ,'' ,'', '','','',''],//end game board //1 25
                        ['', '', '', '' , '', '', '', '', '' ,'' ,'', '','','',''],//blots taken 26
                        ['', '', '', '' , '', '', '', '', '' ,'' ,'', '','','','']];//opponent exits the board 27
                }

                function isMoveOk(params){
                    //return true;
                    //First move of the game.
                    if(params.stateBeforeMove.board === undefined){
                        return true;
                    }
                    if(params.stateBeforeMove.board === getInitialBoard() && params.toDelta === undefined){
                        return true;
                    }




                    var board = params.stateBeforeMove.board;
                    var fromDelta = params.stateAfterMove.fromDelta.fromDelta;
                    var toDelta = params.stateAfterMove.toDelta.toDelta;
                    var dice = [params.stateBeforeMove.dice1 ,params.stateBeforeMove.dice2] ;
                    var turnIndexBeforeMove = params.turnIndexBeforeMove;
                    var currentPlayer;
                    var opposingPlayer;
                    var remainingMoves = totalMoves(dice);

                    if((dice[0] != dice [1] && (fromDelta.length > 2 || toDelta.length > 2)) ||
                        fromDelta.length>4 || toDelta.length >4){
                        console.log(75);
                        return false;
                    }

                    if (board === null || board === undefined || board === '' || board === [[]]){
                        board =getInitialBoard();
                    }


                    if(turnIndexBeforeMove === 0){
                        currentPlayer = 'W';
                        opposingPlayer = 'B';
                    }else if(turnIndexBeforeMove === 1){
                        currentPlayer = 'B';
                        opposingPlayer = 'W';
                    }else{
                        console.log(91);
                        return false;
                    }
                    //Check that the to point is not the blots taken spot
                    for(var i = 0 ; i < toDelta.length; i++){
                        if(toDelta[i] === 1 || toDelta[i] === 26){
                            console.log(97);
                            return false;
                        }
                    }


                    //Check that the player is actually on the from point, bad test, needs to be changed doesnt take into
                    //account changing board state
//                    var numberOfPiecesFound = 0;
//                    for (var j = 0; j < fromDelta.length;j++){
//                        var row = fromDelta[j];
//                        for(var i = 0; i < 15 ; i++){
//                            if(board[row][i] === currentPlayer){
//                                numberOfPiecesFound++;
//                            }
//                        }
//                        if(numberOfPiecesFound === 0){
//                            console.log(113);
//                            return false;
//                        }
//                        numberOfPiecesFound = 0;
//                    }

                    //Checks if the player has utilized full dice roll, if not check if other legal moves availible
                    if(!hasUsedFullRoll(fromDelta,toDelta,remainingMoves)){

                        var unusedRolls = remainingMoves;
                        unusedRolls = [];

                        angular.copy(remainingMoves,unusedRolls);
                        unusedRolls = getUnusedRolls(fromDelta, toDelta , unusedRolls);

                        if(hasLegalMove(board,unusedRolls,currentPlayer)){
                            console.log(129);
                            return false;
                        }
                    }

                    //Count the number of players on the taken spot
                    if(playerCaptured(currentPlayer,board)){
                        var indexToCheck = takenIndex(currentPlayer);

                        //count the number of pieces in the taken spot
                        var numberTaken = 0;
                        for(var i = 0; i<15;i++){
                            if(board[indexToCheck][i] === currentPlayer){
                                numberTaken += 1;
                            }
                        }

                        //count the number of moves from the taken spot
                        var movesFromTaken = 0;
                        for(var i = 0; i < fromDelta.length; i++){
                            if(fromDelta[i]===indexToCheck){
                                movesFromTaken+=1;
                            }
                        }

                        //if the number of moves from the taken spot is less than the number taken and there are moves
                        //taken then decalre an illegal move
                        if(movesFromTaken < numberTaken && fromDelta.length > movesFromTaken){
                            console.log(164);
                            return false;
                        }
                    }

                    //Ensure that player exiting the board is allowed to
                    var remainingRolls = [[]];
                    for(var i = 0; i < toDelta.length; i++){
                        if(currentPlayer === 'W' && toDelta[i] === 27){
                            if(!canExit(board,currentPlayer)){
                                console.log(159);
                                return false;
                            }
                        }

                        if(currentPlayer === 'B' && toDelta[i] === 0){
                            if(!canExit(board,currentPlayer)){
                                console.log(166);
                                return false;
                            }
                        }
                    }


                    for( var i = 0; i < toDelta.length; i++){
                        if(heldBy(board, toDelta[i]) === opposingPlayer){
                            console.log(175);
                            return false;
                        }
                    }

                    //check intermediate points for each remaining roll
                    var numberOfMovesTaken=0;
                    for(var i = 0; i<fromDelta.length;i++){
                        if(fromDelta[i] !== ''){
                            numberOfMovesTaken++;
                        }
                    }
                    //One move for two rolls
                    if(remainingMoves.length === 2 && numberOfMovesTaken === 1){

                        if(currentPlayer === 'W'){
                            if(heldBy(board,fromDelta[0] + remainingMoves[0]) === 'B' &&
                                heldBy(board, fromDelta[0] + remainingMoves[1]) === 'B'){
                                console.log(193);
                                return false;
                            }
                        }

                        if(currentPlayer ==='B'){
                            if(heldBy(board,fromDelta[0] - remainingMoves[0]) === 'W' &&
                                heldBy(board, fromDelta[0] - remainingMoves[1]) === 'W'){
                                console.log(201);
                                return false;
                            }
                        }
                        //Case of rolling doubles
                    }else if (remainingMoves.length === 4){

                        for( var i = 0; i<=numberOfMovesTaken; i++){
                            if(currentPlayer === 'W'){
                                for(var j = fromDelta[i]; j<= toDelta[i]; j = j + (remainingMoves[0])){
                                    if(heldBy(board, j) === 'B'){
                                        console.log(212);
                                        return false;
                                    }
                                }
                            }else{
                                for(var j = fromDelta[i]; j>= toDelta[i];j = j - remainingMoves[0]){
                                    if(heldBy(board, j) === 'W'){
                                        console.log(219);
                                        return false;
                                    }
                                }
                            }

                        }
                    }

                    //Iterate through all rolls and check that all moves can be made together
                    var unusedRolls = remainingMoves;

                    for(var i = 0; i < fromDelta.length; i++){
                        if(fromDelta[i] !== '' && toDelta[i] !== 0 && toDelta[i] !== 27){
                            //Check what rolls are left over after each move is made.
                            unusedRolls = (getUnusedRollSinglePoint(fromDelta[i], toDelta[i], unusedRolls));
                        }
                    }

                    for(var i = 0; i< fromDelta.length; i++){
                        if(toDelta[i] === 0 || toDelta[i] === 27){

                            var totalNumberOfSpaces = Math.abs(fromDelta[i] - toDelta[i]);

                            //Else check that there is a large enough roll total to exit, and remove from unused, look
                            //for smallest amount that will get off the board
                            unusedRolls.sort(function(a, b){return b-a});
                            var runningTotal = 0;

                            for(var j = unusedRolls.length; j >= 0 ;j--){

                                if(runningTotal + unusedRolls[j] >= totalNumberOfSpaces){
                                    //Remove the elements that are used
                                    unusedRolls.splice(j, unusedRolls.length - (j + 1));
                                    runningTotal = 0;
                                    break;
                                }
                            }
                        }
                    }
                    return true;
                }

                function playerCaptured(player, board){
                    var row;

                    if(player === 'W'){
                        row = 1;
                    }else{
                        row =26;
                    }

                    for(var i = 0; i<15;i++){
                        if(board[row][i] === player){
                            return true;
                        }
                    }
                    return false;
                }


                /**
                 *
                 * @param board current board state before a move is made
                 * @param fromDelta array of starting positions, has 4 moves only one is required, the remaining
                 * are for two blots moving in the case of chaining a roll, or up to 4 blots moving in the case the
                 * roll is doubles. Represented as a single number for the point on the board.
                 * @param toDelta array of ending positions, has 4 moves only one is required, the remaining are for
                 * two blots in the case of chaining a roll, or up to 4 blots moving in the case the player rolls
                 * doubles. Represented as a single number.
                 * @param {Array.<int>} dice an array of two dice rolls
                 * @param turnIndexBeforeMove players turn before the roll
                 */
                function createMove(turnIndexBeforeMove ,board, fromDelta, toDelta, dice) {
                    //To track remaining dice moves that haven't been taken
                    var remainingMoves = [];
                    angular.copy(dice, remainingMoves);
                    remainingMoves = totalMoves(remainingMoves);
                    var currentPlayer;
                    var opposingPlayer;

                    if (board === null || board === undefined || board === '' || board === [[]]) {
                        board = getInitialBoard();
                    }

                    if (turnIndexBeforeMove === 0) {
                        currentPlayer = 'W';
                        opposingPlayer = 'B';
                    } else if (turnIndexBeforeMove === 1) {
                        currentPlayer = 'B';
                        opposingPlayer = 'W';
                    } else {
                        throw new Error(ILLEGAL_CODE.NO_PLAYER);
                    }
                    //Check that the to point is not the blots taken spot
                    for (var i = 0; i < toDelta.length; i++) {
                        if (toDelta[i] === 1 || toDelta[i] === 26) {
                            throw new Error(ILLEGAL_CODE.ILLEGAL_DELTA);
                        }
                    }

                    //This check makes no sense beuase not changing th board each time, already taken care of elswhere
//                    //Check that the player is actually on the from point
//                    var numberOfPiecesFound = 0;
//                    for (var j = 0; j < fromDelta.length; j++) {
//                        var row = fromDelta[j];
//                        for (var i = 0; i < 15; i++) {
//                            if (board[row][i] === currentPlayer) {
//                                numberOfPiecesFound++;
//                            }
//                        }
//                        if (numberOfPiecesFound === 0) {
//                            throw new Error(ILLEGAL_CODE.ILLEGAL_DELTA);
//                        }
//                        numberOfPiecesFound = 0;
//                    }

                    //Checks if the player has utilized full dice roll, if not check if other legal moves availible
                    if (!hasUsedFullRoll(fromDelta, toDelta, remainingMoves)) {

                        var unusedRolls = remainingMoves;
                        unusedRolls = [];

                        angular.copy(remainingMoves, unusedRolls);
                        unusedRolls = getUnusedRolls(fromDelta, toDelta, unusedRolls);

                        //Board state after moves to check if there would be moves availible in the future state.
                        var projectedBoard =[[]];
                        angular.copy(board,projectedBoard);
                        for (var i = 0; i < fromDelta.length; i++) {
                            if (fromDelta[i] !== '') {
                                projectedBoard = makeMove(projectedBoard, fromDelta[i], toDelta[i], currentPlayer);
                            }
                        }

                        if (hasLegalMove(projectedBoard, unusedRolls, currentPlayer)) {
                            throw new Error(ILLEGAL_CODE.INCOMPLETE_MOVE);
                        }
                    }

                    //Check that all blots that were taken entered before other moves were made
                    var numberCaptured = 0;
                    var capturePoint = 0;
                    if(currentPlayer === 'W'){
                        capturePoint = 1;
                    }else{
                        capturePoint = 26;
                    }
                    //count the number captured
                    for(var i =0; i<15; i++ ){
                        if(board[capturePoint][i] === currentPlayer){
                            numberCaptured++;
                        }
                    }

                    //loop through the from array and match the number captured to the number of from's from the captured
                    //position
                    if(numberCaptured>0){
                        var numberMoved = 0;
                        var nonCapturedMoves = 0;
                        for(var i=0;i<fromDelta.length;i++){
                            if(fromDelta[i] === capturePoint){
                                numberMoved++;
                            }else{
                                nonCapturedMoves++;
                            }
                        }
                        //if the number captured is not the same as the number moved then make sure that no other move
                        //occured, if it has then trhow an exception
                        if(numberCaptured > numberMoved && nonCapturedMoves > 0){
                            throw new Error(ILLEGAL_CODE.ILLEGAL_MOVE);
                        }

                    }



//                    for (var i = 0; i < toDelta.length; i++) {
//                        if (playerCaptured(currentPlayer, board)) {
//                            //If player didn't move off the taken spot then check if any other moves were made
//                            for (var j = 0; j < toDelta.length; j++) {
//
//                                //If a move was made that didn't remove a blot back onto the board then decalre an
//                                //illegal move
//
//                                if (fromDelta[j] !== '' && toDelta[j] !== '' && Math.abs(fromDelta[j] - toDelta[j])
//                                    > 0 && !(fromDelta[j] === 1 || fromDelta[j] === 26)) {
//                                    throw new Error(ILLEGAL_CODE.ILLEGAL_MOVE);
//                                }
//
//                            }
//
//                        }
//                    }

                    //Ensure that player exiting the board is allowed to
                    for (var i = 0; i < toDelta.length; i++) {
                        if (currentPlayer === 'W' && toDelta[i] === 27) {
                            if (!canExit(board, currentPlayer)) {
                                throw new Error(ILLEGAL_CODE.ILLEGAL_MOVE);
                            }
                        }

                        if (currentPlayer === 'B' && toDelta[i] === 0) {
                            if (!canExit(board, currentPlayer)) {
                                throw new Error(ILLEGAL_CODE.ILLEGAL_MOVE);
                            }
                        }
                    }


                    for (var i = 0; i < toDelta.length; i++) {
                        if (heldBy(board, toDelta[i]) === opposingPlayer) {
                            throw new Error(ILLEGAL_CODE.ILLEGAL_MOVE);
                        }
                    }

                    //check intermediate points for each remaining roll
                    var numberOfMovesTaken = 0;
                    for (var i = 0; i < fromDelta.length; i++) {
                        if (fromDelta[i] !== '') {
                            numberOfMovesTaken++;
                        }
                    }
                    //One move for two rolls
                    if (remainingMoves.length === 2 && numberOfMovesTaken === 1) {

                        if (currentPlayer === 'W') {
                            if (heldBy(board, fromDelta[0] + remainingMoves[0]) === 'B' &&
                                heldBy(board, fromDelta[0] + remainingMoves[1]) === 'B') {
                                throw new Error(ILLEGAL_CODE.ILLEGAL_DELTA);
                            }
                        }

                        if (currentPlayer === 'B') {
                            if (heldBy(board, fromDelta[0] - remainingMoves[0]) === 'W' &&
                                heldBy(board, fromDelta[0] - remainingMoves[1]) === 'W') {
                                throw new Error(ILLEGAL_CODE.ILLEGAL_DELTA);
                            }
                        }
                        //Case of rolling doubles
                    } else if (remainingMoves.length === 4) {

                        for (var i = 0; i <= numberOfMovesTaken; i++) {
                            if (currentPlayer === 'W') {
                                for (var j = fromDelta[i]; j <= toDelta[i]; j = j + (remainingMoves[0])) {
                                    if (heldBy(board, j) === 'B') {
                                        throw new Error(ILLEGAL_CODE.ILLEGAL_MOVE);
                                    }
                                }
                            } else {
                                for (var j = fromDelta[i]; j >= toDelta[i]; j = j - remainingMoves[0]) {
                                    if (heldBy(board, j) === 'W') {
                                        throw new Error(ILLEGAL_CODE.ILLEGAL_MOVE);
                                    }
                                }
                            }

                        }
                    }

                    //Iterate through all rolls and check that all moves can be made together
                    var unusedRolls = remainingMoves;

                    for (var i = 0; i < fromDelta.length; i++) {
                        if (fromDelta[i] !== '' && toDelta[i] !== 0 && toDelta[i] !== 27) {
                            //Check what rolls are left over after each move is made.
                            unusedRolls = (getUnusedRolls(fromDelta[i], toDelta[i], unusedRolls));
                        }
                    }

                    for (var i = 0; i < fromDelta.length; i++) {
                        if (toDelta[i] === 0 || toDelta[i] === 27) {

                            var totalNumberOfSpaces = Math.abs(fromDelta[i] - toDelta[i]);
                            //Trying to exit but no moves left
                            if (unusedRolls.length === 0) {
                                throw new Error(ILLEGAL_CODE.ILLEGAL_DELTA);
                            }

                            //Else check that there is a large enough roll total to exit, and remove from unused, look
                            //for smallest amount that will get off the board
                            unusedRolls.sort(function (a, b) {
                                return b - a
                            });
                            var runningTotal = 0;

                            for (var j = unusedRolls.length; j >= 0; j--) {

                                if (runningTotal + unusedRolls[j] >= totalNumberOfSpaces) {
                                    //Remove the elements that are used
                                    unusedRolls.splice(j, unusedRolls.length - (j + 1));
                                    runningTotal = 0;
                                    break;
                                }
                            }
                        }
                    }

                    //All tests passed then alter the board, set turn index and return
                    var currentBoard = board;
                    for (var i = 0; i < fromDelta.length; i++) {
                        if (fromDelta[i] !== '') {
                            currentBoard = makeMove(currentBoard, fromDelta[i], toDelta[i], currentPlayer);
                        }
                    }

                    var setTurn;
                    //check of there is an end of game scenario
                    if (hasWon(currentPlayer, board)) {
                        setTurn = {endMatch: {endMatchScores: (currentPlayer === 'W' ? [1, 0] : (currentPlayer === 'B' ? [0, 1] : [0, 0]))}};
                    } else {
                        setTurn = {setTurn: {turnIndex: 1 - turnIndexBeforeMove}};
                    }

                    var returnValue = [setTurn,
                        {set: {key: 'board', value: currentBoard}},
                        {set: {key: 'fromDelta', value: {fromDelta: fromDelta}}},
                        {set: {key: 'toDelta', value: {toDelta: toDelta}}},
                        {setRandomInteger: {key: 'dice1', from:1, to:7}},
                        {setRandomInteger: {key: 'dice2', from:1, to:7}}];

                    return returnValue;

                }

                /**
                 * Returns true if a player has won the game.
                 * @param player
                 * @param board
                 * @returns {boolean}
                 */
                function hasWon(player, board){
                    var count = 0;
                    var row = winIndex(player);

                    for(var i = 0; i< board[row].length;i++){
                        if(board[row][i] === player){
                            count++;
                        }
                    }

                    return count === 15;

                }

                /**
                 * Returns a board after a single move is made.
                 * @param board
                 * @param from
                 * @param to
                 * @param player
                 * @returns {*}
                 */
                function makeMove(board, from, to, player){

                    //remove piece from current spot get furthest element index
                    for(var i = 14; i >= 0; i-- ){
                        if(board[from][i] === player){
                            board[from][i] = '';
                            break;
                        }
                    }

                    //check if to spot has an opposing player
                    if(board [to][0] === opposingPlayer(player)){
                        //Replace with current player
                        board [to][0] = player;

                        //Put opposing player in taken position
                        var row = takenIndex(opposingPlayer(player));
                        var column = firstEmptySpot(board, row);

                        board[row][column] = opposingPlayer(player);
                        return board;
                    }

                    //if no opposing player then find first empty spot and place piece
                    var column = firstEmptySpot(board, to);
                    board[to][column] = player;
                    return board;

                }

                /**
                 * Gives the color of the opponent given a player
                 * @param player
                 * @returns {string}
                 */
                function opposingPlayer(player){
                    if(player === 'W'){
                        return 'B';
                    }else{
                        return 'W';
                    }
                }

                /**
                 * Given a player returns the index of where the player is held in case of capture.
                 * @param player
                 */
                function takenIndex(player){
                    if(player === 'W'){
                        return 1;
                    }else{
                        return 26;
                    }
                }

                /**
                 * Returns teh index of the row that
                 * @param player
                 * @returns {number}
                 */
                function winIndex(player){
                    if(player === 'W'){
                        return 27;
                    }else{
                        return 0;
                    }
                }

                /**
                 * Finds the first empty position given a row index and a board.
                 * @param board
                 * @param row
                 */
                function firstEmptySpot(board, row){
                    for(var i = 0; i < board[row].length; i++){
                        if(board[row][i] === ''){
                            return i;
                        }
                    }
                }

                /**
                 * Expands the dice rolls into an array of 4 if doubles are rolled, otherwise returns an un-altered
                 * dice object.
                 * @param dice
                 */
                function totalMoves(dice){
                    if(dice[0] === dice[1]){
                        return [dice[0],dice[0],dice[0],dice[0]];
                    }else{
                        return dice;
                    }
                }

                /**
                 * Returns the player that is currently holding the point on the board, if not held then returns and
                 * empty string. Returns undefined if the point index is off the board.
                 * @param board
                 * @param pointIndex
                 */
                function heldBy(board, pointIndex){

                    var countHeld = 0;
                    var color;

                    if(pointIndex > 25 || pointIndex < 2){
                        return undefined;
                    }

                    for(var i = 0; i < 15; i++){
                        if(board[pointIndex][i] !== ''){
                            countHeld++;
                            color = board[pointIndex][i];
                            if(countHeld >= 2){
                                return color;
                            }
                        }
                    }
                    //Less than two blots on the space found
                    return '';

                }

                /**
                 * Check if the full roll has been used, if not then return false.
                 * @param fromDelta
                 * @param toDelta
                 * @param player
                 * @param remainingMoves
                 */
                function hasUsedFullRoll(fromDelta, toDelta, remainingMoves){
                    var totalDice = 0;

                    //Sum of total dice rolls
                    for(var i = 0 ; i< remainingMoves.length; i++){
                        if(remainingMoves[i]!== ''){
                            totalDice = totalDice + remainingMoves[i];
                        }

                    }

                    //Sum of total spaces moved
                    var totalDelta =0;
                    for(var i = 0; i< toDelta.length; i++){
                        if(toDelta[i] !== ''){
                            totalDelta = totalDelta + Math.abs(toDelta - fromDelta);
                        }
                    }

                    //If there are unaccounted for moves check if they are player exiting the board
                    if(totalDelta > totalDice){
                        for(var i = 0; toDelta.length; i++){
                            if(toDelta[i] === 0 || toDelta[i] === 27){
                                return true;
                            }
                        }
                    }

                    return  totalDice === totalDelta;

                }

                /**
                 * Returns an array of dice rolls that haven't been used given a from delta array
                 * todelta array and remainng moves array
                 * @param fromDelta
                 * @param toDelta
                 * @param remainingMoves
                 * @param board
                 * @param player
                 */
                function getUnusedRolls(fromDelta, toDelta , remainingMoves){


                    var deltaArray =[];
                    //Get the distance traveled
                    for(var i = 0; i<fromDelta.length;i++){

                        if(fromDelta[i] !== ''){
                            deltaArray.push(Math.abs(fromDelta[i] - toDelta[i]));
                        }
                    }
                    var theSame=true;
                    //Check if the elemnts in the remiaing moves array are the same
                    for(var i = 0; i<remainingMoves.length - 1;i++){
                        if(remainingMoves[i] !== remainingMoves[i+1]){
                            theSame = false;
                            break;
                        }
                    }

                    //Used if not a double roll
                    if(!theSame) {


                        var sum = 0;
                        //Check if any combination of dice rolls equals that number, if found then delete from remaining moves
                        for (var i = 0; i < deltaArray.length; i++) {
                            for (var j = remainingMoves.length - 1; j >= 0; j--) {
                                sum = 0;
                                for (var k = j; k >= 0; k--) {
                                    sum = sum + remainingMoves[k];
                                    if (sum === deltaArray[i]) {
                                        remainingMoves.splice(k, (j + 1));
                                    }
                                }
                            }
                        }
                    }else{
                        var totalDetla =0;
                        for(var i = 0; i< deltaArray.length; i++){
                            totalDetla+=deltaArray[i];
                            var numberOfElementsLeft = remainingMoves.length;
                            if(numberOfElementsLeft > 0 && totalDetla % remainingMoves[0] === 0){
                                var numberOfElemetsToRemove = totalDetla/remainingMoves[0];
                                if(numberOfElementsLeft >= numberOfElemetsToRemove){
                                    console.log("number of elements to remove");
                                    console.log(numberOfElemetsToRemove);
                                    remainingMoves.splice(0,numberOfElemetsToRemove);
                                    totalDetla = 0;
                                }
                            }

                        }

                    }
                    return remainingMoves;
                }

                /**
                 * Returns an array of dice rolls that haven't been used given a a single from and to point
                 * and remainng moves array
                 * @param fromDelta
                 * @param toDelta
                 * @param remainingMoves
                 * @param board
                 * @param player
                 */
                function getUnusedRollSinglePoint(from, to , remainingMoves){


                    var delta;
                    //Get the distance traveled
                    delta = Math.abs(from - to);

                    var sum = 0;
                    //Check if any combination of dice rolls equals that number, if found then delete from remaining moves

                    for( var j = remainingMoves.length -1 ; j>=0;j--){
                        sum = 0;
                        for (var k = j; k>=0;k--){
                            sum = sum + remainingMoves[k];
                            if(sum === delta){
                                remainingMoves.splice(k,(j + 1));
                            }
                        }
                    }
                    return remainingMoves;
                }

                /**
                 * Checks if a legal move can be made based on the number of moves remaining, checks for a single move
                 * @param board
                 * @param remainingMoves
                 * @param player
                 * @returns {boolean}
                 */
                function hasLegalMove(board, remainingMoves, player){


                    var hasRemainginRoll = false;
                    //Check if there are any remaining moves first
                    for(var i =0 ; i< remainingMoves.length; i++){
                        if(remainingMoves[i] !== undefined){
                            hasRemainginRoll = true;
                            break;
                        }
                    }

                    if(!hasRemainginRoll){
                        return false;
                    }


                    //if player waiting entry to board, can they enter?
                    if(player === 'W' && board[1][0] ==='W') {

                        for (var i = 0; i < remainingMoves.length; i++) {
                            if (heldBy(board, remainingMoves[i] + 1) !== 'B') {
                                return true;
                            }
                        }
                        return false;
                    }

                    if (player === 'B' && board[26][0] === 'B'){
                        for(var i = 0 ; i<remainingMoves.length; i++){
                            if(heldBy(board, 26 - remainingMoves[i]) !== 'W'){
                                return true;
                            }
                        }
                        return false;
                    }

                    //if player can exit the board did they?
                    if(player === 'W' && canExit(board, player)){
                        for(var i = 0; i < remainingMoves.length; i++){
                            for(var j = 19; j <=25; j++){
                                if(board[j][0] === 'W' && j + remainingMoves[i] > 25){
                                    return true;
                                }
                            }
                        }
                    }

                    if(player === 'B' && canExit(board, player)){
                        for(var i = 0; i < remainingMoves.length; i++){
                            for(var j = 2; j <=7; j++){
                                if(board[j][0] === 'B' && j - remainingMoves[i] < 2){
                                    return true;
                                }
                            }
                        }
                    }

                    //All other moves not blocked?
                    if(player === 'W'){
                        for(var i = 1; i <= 25; i++){
                            for(var j = 0; j<remainingMoves.length;j++){
                                if(board[i][0] === 'W'){
                                    if(heldBy(board, i + remainingMoves[j]) !== 'B' &&
                                        heldBy(board, i + remainingMoves[j]) !== undefined){
                                        return true;
                                    }
                                }
                            }
                        }
                    }

                    if(player === 'B'){
                        for(var i = 25; i >= 2; i--){
                            for(var j = 0; j < remainingMoves.length; j++){
                                if(board[i][0] === 'B'){
                                    if(heldBy(board, i - remainingMoves[j]) !== 'W' &&
                                        heldBy(board, i - remainingMoves[j]) !== undefined){
                                        return true;
                                    }
                                }
                            }
                        }
                    }
                    return false;
                }

                /**
                 * Checks if a player has all blots on home board.
                 * @param board
                 * @param player
                 * @returns {boolean}
                 */
                function canExit(board, player){
                    //Check if white player blots only on home board. Home board is index
                    var countOnHomeBoard = 0;
                    if(player === 'W'){
                        for(var i = 1; i < 26; i++){
                            for(var j = 0; j <= 15; j++){
                                if(board[i][j] === 'W'){
                                    if(i < 20){
                                        return false;
                                    }else{
                                        countOnHomeBoard++;
                                    }
                                }
                            }
                        }
                    }

                    if(player === 'B'){
                        for(var i = 27; i >= 2; i--){
                            for(var j = 0; j < 15; j++){
                                if(board[i][j] === 'B'){
                                    if(i > 7){
                                        return false;
                                    }else{
                                        countOnHomeBoard++;
                                    }
                                }
                            }
                        }
                    }

                    if(countOnHomeBoard>0){
                        return true;
                    }
                }

                /**
                 * Returns an array of all possible moves given a board, the rollArray(upt to 4 items, is the actual
                 * moves that can be made), and a player
                 * @param board
                 * @param diceArray
                 * @param player
                 */
                function getPossibleMoves(board, rollArray, player){
                    var currentRolls = [];
                    var remainingRolls = [];
                    var currentBoard =[[]];
                    var newBoard = [[]];
                    angular.copy(board,currentBoard);
                    angular.copy(rollArray,currentRolls);


                    //if no legal moves left then return false
                    if(rollArray.length === 0 || !hasLegalMove(board, rollArray, player)){
                        return false;
                    }

                    var possibleMoves = [];
                    for(var i = 0; i < currentRolls.length;i++){

                        var currentRoll = currentRolls[i];
                        for(var j=1;j<=26;j++){
                            var from = j;

                            var legalMoves = getLegalMoves(currentBoard,player,currentRoll,from);
                            var currentResult = {from:[from], to:[legalMoves]};

                            if(currentResult.from[0] === 2){
                                var wait = "wait";
                            }

                            if(legalMoves !== false){

                                angular.copy(currentRolls,remainingRolls);
                                remainingRolls.splice(i,1);
                                angular.copy(currentBoard,newBoard);
                                newBoard = makeMove(newBoard,from,legalMoves,player);
                                var test = getPossibleMoves(newBoard,remainingRolls,player);

                                if(test !== false && test !== undefined && test !== []){
                                    for(var counter = 0 ; counter < test.length;counter++ ){
                                        var tempArray = [];
                                        angular.copy(currentResult,tempArray);
                                        for (var internalCounter = 0; internalCounter < test[counter].from.length; internalCounter++){

                                            var recursiveFrom = test[counter].from[internalCounter];
                                            var recursiveTo = test[counter].to[internalCounter];
                                            tempArray.from.push(recursiveFrom);
                                            tempArray.to.push(recursiveTo);
                                            possibleMoves.push(tempArray);
                                        }
                                    }

                                }else{
                                    possibleMoves.push(currentResult);
                                }
                            }
                        }
                    }
                    return possibleMoves;
                }
                    /**
                     * Returns a legal to position given a from positon and a board. Checks for legitamacy (blocking,
                     * exiting, taken picies), returns false if no legal moves.
                     * @param board
                     * @param player
                     * @param singleRoll
                     * @param fromPosition
                     */
                    function getLegalMoves(board, player, singleRoll, fromPosition) {

                        var singleRollArray = [singleRoll];
                        if (!hasLegalMove(board, singleRollArray, player)) {
                            return false;
                        }

                        //If a blot is taken and its not moving back on the board then return false
                        var takenIndex = 1;

                        if(player === "W"){
                            takenIndex = 1;
                        }else{
                            takenIndex = 26;
                        }


                        for (var i = 0; i < 15; i++) {
                            if (board[takenIndex][i] === player && fromPosition !== takenIndex) {
                                return false;
                            }
                        }

                        //Check that there is actually a piece in that spot
                        var piceFound = false;
                        for(var i = 0; i < 15 ; i++){
                            if(board[fromPosition][i] === player){
                                piceFound = true;
                            }
                        }
                        //If not found at that position then return false
                        if(piceFound === false){
                            return piceFound;
                        }


                        var legalToMove = false;

                        if (player === 'W') {
                            if (heldBy(board, singleRoll + fromPosition) !== opposingPlayer(player)
                                && singleRoll + fromPosition <= 25) {
                                legalToMove = singleRoll + fromPosition;
                            } else if (singleRoll + fromPosition > 25 && canExit(board, player)) {
                                legalToMove = 27;
                            }
                        }


                        if (player === 'B') {
                            if (heldBy(board, fromPosition - singleRoll) !== opposingPlayer(player)
                                && fromPosition - singleRoll >= 2) {

                                legalToMove = fromPosition - singleRoll;

                            } else if (fromPosition - singleRoll < 2 && canExit(board, player)) {
                                console.log("Can exit reached");
                                legalToMove = 0;
                            }
                        }
                        return legalToMove;
                    }
                return {
                    isMoveOk: isMoveOk,
                    createMove: createMove,
                    getInitialBoard: getInitialBoard,
                    totalMoves: totalMoves,
                    hasUsedFullRoll:hasUsedFullRoll,
                    getUnusedRolls:getUnusedRolls,
                    heldBy:heldBy,
                    getPossibleMoves:getPossibleMoves,
                    hasLegalMove:hasLegalMove,
                    makeMove:makeMove
                };
            });
}());