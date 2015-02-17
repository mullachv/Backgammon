/**
 * Created by islam on 2/15/15.
 */
'use strict';

angular.module('myApp', []).factory('gameLogic', function() {

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
                ['W', 'W', '', '' , '', '', '', '', '' ,'' ,'', '','','',''],//start game board 24
                ['', '', '', '' , '', '', '', '', '' ,'' ,'', '','','',''],//23
                ['', '', '', '' , '', '', '', '', '' ,'' ,'', '','','',''],//22
                ['', '', '', '' , '', '', '', '', '' ,'' ,'', '','','',''],//21
                ['', '', '', '' , '', '', '', '', '' ,'' ,'', '','','',''],//20
                ['B', 'B', 'B', 'B' , 'B', '', '', '', '' ,'' ,'', '','','',''],//19
                ['B', 'B', 'B', '' , '', '', '', '', '' ,'' ,'', '','','',''],//18
                ['', '', '', '' , '', '', '', '', '' ,'' ,'', '','','',''],//17
                ['', '', '', '' , '', '', '', '', '' ,'' ,'', '','','',''],//16
                ['', '', '', '' , '', '', '', '', '' ,'' ,'', '','','',''],//15
                ['', '', '', '' , '', '', '', '', '' ,'' ,'', '','','',''],//14
                ['W', 'W', 'W', 'W' , 'W', '', '', '', '' ,'' ,'', '','','',''],//13
                ['', '', '', '' , '', '', '', '', '' ,'' ,'', '','','',''],//12
                ['B', 'B', 'B', 'B' , 'B', '', '', '', '' ,'' ,'', '','','',''],//11
                ['', '', '', '' , '', '', '', '', '' ,'' ,'', '','','',''],//10
                ['', '', '', '' , '', '', '', '', '' ,'' ,'', '','','',''],//9
                ['W', 'W', 'W', '' , '', '', '', '', '' ,'' ,'', '','','',''],//8
                ['', '', '', '' , '', '', '', '', '' ,'' ,'', '','','',''],//7
                ['W', 'W', 'W', 'W' , 'W', '', '', '', '' ,'' ,'', '','','',''],//6
                ['', '', '', '' , '', '', '', '', '' ,'' ,'', '','','',''],//5
                ['', '', '', '' , '', '', '', '', '' ,'' ,'', '','','',''],//4
                ['', '', '', '' , '', '', '', '', '' ,'' ,'', '','','',''],//3
                ['', '', '', '' , '', '', '', '', '' ,'' ,'', '','','',''],//2
                ['B', 'B', '', '' , '', '', '', '', '' ,'' ,'', '','','',''],//end game board //1
                ['', '', '', '' , '', '', '', '', '' ,'' ,'', '','','',''],//blots taken
                ['', '', '', '' , '', '', '', '', '' ,'' ,'', '','','','']];//opponent exits the board
    }

    /**
     * A winner is decalred when the board at index 0 or index 27 has 15 blots in it. This means that all blots
     * have exited the board for that player. Will return either W of B for white or black.
     * @param board
     */
    function getWinner(board){
        if (board[27][14] === 'W'){
            return 'W';
        }else if(board[0][14] ==='B'){
            return 'B';
        }else{
            return '';
        }
    }

    /**
     * Rolls a single dice and returns a value between 1 and 6 inclusive
     * @returns {number}
     */
    function rollDice(){
        return Math.floor(Math.random() * 6) + 1
    }

    /**
     * Have a player roll the dice.
     */
    function takeTurn(){
        var dice1 = rollDice();
        var dice2 = rollDice();

        if(dice1 === dice2){
            var dice3 = dice1;
            var dice4 = dice1;
            return [dice1 ,dice2 , dice3 , dice4];
        }else{
            return [dice1, dice2];
        }
    }

    /**
     * Check if a move is valid. White blots move up in index, black blots move down. Blots cannot move to spaces where
     * more than 2 or more blots of the other color reside.
     * it can move is 1.
     * @param board
     * @param diceArray
     * @param fromPoint
     * @param toPoint
     * @param turnIndex
     */
    function isMoveOk(board,diceArray,fromPoint, toPoint, turnIndex){

        var exitBoard;
        var numberOfSpaces = Math.abs(fromPoint - toPoint);
        var currentBlot;
        var opposingBlot;

        //Assign a the string representation of the current blot to current blot to make it easier to check
        if (turnIndex === 0){
            currentBlot = 'W';
            opposingBlot = 'B'
        }else{
            currentBlot = 'B';
            opposingBlot = 'W';
        }

        ////If there are blots awaiting entry then they must be moved first.
        if(awaitingEntry(board,currentBlot)){
            if(currentBlot === 'W'){
                //For white these are stored at index 1
                if(fromPoint !== 1){
                    return false;
                }
            }else{
                //For black these are stored at array 26
                if(fromPoint !== 26){
                    return false;
                }
            }
        }

        //Assign a boolean that lets us know if the move is to exit the board
        if(toPoint === 0 || toPoint == 27){
            exitBoard = true;
        }else{
            exitBoard = false;
        }

        //Check that the blots are moving in the right direction
        if(currentBlot === 'W' && toPoint < fromPoint){
            return false;
        }else if(currentBlot === 'B' && fromPoint< toPoint){
            return false;
        }

        //Check that the position that the blot is moving to is not blocked.
        if(pointHeldBy(board, toPoint) === opposingBlot){
            return false;
        }

        //Check that a blot can reach that position with the current dice roll
        var possibleRolls;

        //Check the special case where a blot is exiting the board
        if(exitBoard){
            //Cannot exit board unless all blots on home board.
            if(allOnHomeBoard()){
                possibleRolls = possibleRollsExitBoard(numberOfSpaces, diceArray);
            }else{
                return false
            }
        //If not an attempt the exit the board then get the combinations of dice rolls that work
        }else{
            possibleRolls = possibleRolls(numberOfSpaces, diceArray);
        }

        //If no possible combinations lead to space then return false
        if(possibleRolls.length === 0){
            return false;
        }


        //Check that the intermediate points are not blocked
        var i = 0;
        for (i = 0; i<possibleRolls.length;i++){

            //If player is white then idicies move up else indexes move down
            if(currentBlot === 'W'){
                if(pointHeldBy(board, (fromPoint + possibleRolls[i][0]) !== opposingBlot) ||
                    pointHeldBy(board, (fromPoint + possibleRolls[i][1]) !== opposingBlot)){
                    return true;
                }
            }else{
                if(pointHeldBy(board, (fromPoint - possibleRolls[i][0]) !== opposingBlot) ||
                    pointHeldBy(board, (fromPoint - possibleRolls[i][1]) !== opposingBlot)){
                    return true;
                }
            }
        }

    }

    /**
     * Checks if a point on the board is blocked, returns the string representing the player that's holding the
     * point.
     * @param point
     */
    function pointHeldBy(board, point){

        var i;
        var colorFound = '';
        var count= 0;

        for (i = 0; i < 15; i++){

            if(board[point][i] !== ''){
                colorFound = board[point][i];
                count++;
            }
        }

        if(count > 1){
            return colorFound;
        }else{
            return '';
        }
    }

    /**
     * Checks if the total amount of a roll can be attained. Returns an array of tuples, each tuple represents a dice roll
     * that has the two numbers that can get that result. If the total amount cannot be dervied then it
     * returns an empty array.
     * @param totalRollAmount
     * @param diceArray
     */
    function possibleRolls (totalRollAmount, diceArray){

        var i;
        var j;
        var possibleRolls = [];

        for (i = 0; i < diceArray.length; i++){
            for (j = 0; j < diceArray.length; j++){
                if ((diceArray[i] + diceArray[j]) === totalRollAmount){
                    possibleRolls.push([diceArray[i], diceArray[j]]);
                }
            }
        }
        return possibleRolls;
    }

    /**
     * Used to check if there is a dice roll pair that can get the blot off the board.
     * Checks if the total amount of a roll can be attained. Returns an array of tuples, each tuple represents a dice roll
     * that has the two numbers that can get that result. If the total amount cannot be dervied then it
     * returns an empty array.
     * @param totalRollAmount
     * @param diceArray
     */
    function possibleRollsExitBoard(totalRollAmount, diceArray){
        var i;
        var j;
        var possibleRolls = [];

        for (i = 0; i < diceArray.length; i++){
            for (j = 0; j < diceArray.length; j++){
                if ((diceArray[i] + diceArray[j]) >= totalRollAmount){
                    possibleRolls.push([diceArray[i], diceArray[j]]);
                }
            }
        }
        return possibleRolls;
    }


    /**
     * Checks if all remaining blots are on their home board.
     * @param board
     * @param blotColor
     * @returns {boolean}
     */
    function allOnHomeBoard(board, blotColor){
        var i;
        var j;
        var from;
        var to;

        //If any blots have been hit and need to re-enter the board then all blots not on home board.
        if(awaitingEntry(board, blotColor)){
            return false;
        }

        //Assign the ranges to check for all other blots
        if(blotColor === 'W'){
            from = 2;
            to = 19;
        }else{
            from = 8;
            to = 25;
        }

        //If a blot is found on the rest of the board then all are not on the home board.
        for(i = from; i <= to; i++){
            for(j = 0; j <15 ; j++){

                if (board[i][j] === blotColor){
                    return false;
                }

            }
        }

        //if no blots found elsewhere then all must be on home board.
        return true;
    }

    /**
     * Returns true if there are blots have been hot for a particular color. These blots will need to re-enter the
     * board before the player can move again.
     * @param board
     * @param blotColor
     * @returns {boolean}
     */
    function awaitingEntry(board, blotColor){
        var i;
        var index;

        //For white the blots waiting to enter are stored at index 1, for black at index 26
        if(blotColor === 'W'){
            index = 1;
        }else{
            index = 26
        }

        //Check the array
        for( i = 0; i < 15; i++){
            if(board[index][i] === 'W'){
                return true;
            }
        }

        return false;
    }

    /**
     * Returns the move that should be performed when player
     * with index turnIndexBeforeMove makes a move in cell row X col.
     */
    function createMove(board, diceArray, fromPoint, toPoint, turnIndex) {

        var dice = diceArray;
        var currentPlayer;
        var opposingPlayer;
        var hitIndex;

        //Assign players of readability
        if(turnIndex === 0) {
            currentPlayer = 'W';
            opposingPlayer = 'B';
            hitIndex = 26;
        }else{
            currentPlayer = 'B';
            opposingPlayer = 'W';
            hitIndex = 1;
        }

        //Check if valid move is available
        if(!areMovesAvailible(board, dice, currentPlayer)){
            if(turnIndex === 0){
                turnIndex = 1;
            }else{
                turnIndex = 0;
            }
            //If no valid moves then give control to the next player
            createMove(board,turnIndex);
        }

        if(isMoveOk(board,diceArray, fromPoint, toPoint, turnIndex)){
            if(currentPlayer === 'W'){
                for(var i = 0; i < 15; i++){
                    if(board[toPoint][i] === ''){
                        board[toPoint][i] = currentPlayer;
                        return;
                    }else if(board[toPoint][i] ===opposingPlayer){
                        board[toPoint][i] = currentPlayer;
                        for(var j = 0; j<15;j++){
                            if(board[hitIndex][j] ===''){
                                board[hitIndex][j] =opposingPlayer;
                                return;
                            }
                        }
                    }
                }
            }
        }

    }



    /**
     * Returns true if there is at least one move possible.
     * @param board
     * @param diceArray
     * @param currentPlayer
     */
    function areMovesAvailible(board, diceArray, currentPlayer){


        //If there are blots awaiting entry then must check if they can be brought in, if not then there are no possible
        //moves.
        if(awaitingEntry(board,currentPlayer)){

            if(currentPlayer === 'W'){
                for(var i = 0; diceArray.length; i++){
                    if(pointHeldBy(board, (diceArray[i] + 1)) !== 'B'){
                        return true;
                    }
                }
            }else{
                for(var i = 0; diceArray.length; i++){
                    if(pointHeldBy(board,(26 - diceArray[i])) !== 'W'){
                        return true;
                    }
                }
            }
        }

       //If no blots awaiting entry then check if all are on home board and any of them can exit
        if(allOnHomeBoard(board, currentPlayer)){
            if(currentPlayer === 'W'){
                for(var curretDiceIndex = 0; diceArray.length;curretDiceIndex++){
                    for(var boardRow = 25; boardRow >= 20; j--){
                        for(var boardColumn = 0; boardColumn < 15; k++){

                            //If the current row plus the current dice roll takes the blot off the board then a move
                            //is availible.
                            if(board[boardRow ][boardColumn] === 'W'
                                && boardRow + diceArray[curretDiceIndex] > 25){
                                return true;
                            }
                        }
                    }
                }
            }else{
                for(var curretDiceIndex = 0; diceArray.length;curretDiceIndex++){
                    for(var boardRow = 2; boardRow <= 7; j++){
                        for(var boardColumn = 0; boardColumn < 15; k++){

                            //If the current row minus the current dice roll takes the blot off the board then a move
                            //is availible.
                            if(board[boardRow ][boardColumn] === 'B'
                                && boardRow - diceArray[curretDiceIndex] < 2){
                                return true;
                            }
                        }
                    }
                }
            }

        }

        //Otherwise loop through the entire board and see if the player can make a single move.
        for(var currentDiceIndex = 0; diceArray.length; currentDiceIndex++){
            //If white then blot moves up the array
            if(currentPlayer === 'W'){
                for(var boardRow = 2; boardRow <= 25; boardRow++){
                  for(var boardColumn = 0; boardColumn<15; boardColumn++){
                      if(board[boardRow][boardColumn] === 'W'){
                          if(pointHeldBy(board, boardRow + diceArray[currentDiceIndex]) !== 'B'){
                              return true;
                          }
                      }
                  }
                }
            }

            //If player os lack then moves down the array
            if(currentPlayer === 'B'){
                for(var boardRow = 25; boardRow >= 2; boardRow--){
                    for(var boardColumn = 0; boardColumn<15; boardColumn++){
                        if(board[boardRow][boardColumn] === 'B'){
                            if(pointHeldBy(board, boardRow - diceArray[currentDiceIndex]) !== 'W'){
                                return true;
                            }
                        }
                    }
                }
            }
        }

    }
});