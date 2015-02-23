(function () {
    "use strict";

    angular.module('myApp').factory('backGammonLogicService',
        ['enumService',
            function (enumService) {

                // This is a simple implementation for constant and enum, so the value
                // can be changed. Since this is a small personal project, all caps
                // naming convention should be enough.
                var ILLEGAL_CODE = enumService.ILLEGAL_CODE;

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
                 *
                 * @param board current board state before a move is made
                 * @param fromDelta array of starting positions, has 4 moves only one is required, the remaining
                 * are for two blots moving in the case of chaining a roll, or up to 4 blots moving in the case the
                 * roll is doubles. Represented as a single number for the point on the board.
                 * @param toDelta array of ending positions, has 4 moves only one is required, the remaining are for
                 * two blots in the case of chaining a roll, or up to 4 blots moving in the case the player rolls
                 * doubles. Represented as a single number.
                 * @param dice an array of two dice rolls
                 * @param turnIndexBeforeMove players turn before the roll
                 */
                function createMove(board, fromDelta, toDelta, dice, turnIndexBeforeMove){

                    //To track remaining dice moves that haven't been taken
                    var remainingMoves = totalMoves(dice);
                    var exitBoard = false;
                    var currentPlayer;
                    var opposingPlayer;

                    if(turnIndexBeforeMove === 0){
                        currentPlayer = 'W';
                        opposingPlayer = 'B';
                    }else{
                        currentPlayer = 'B';
                        opposingPlayer = 'W';
                    }

                    //Check that moves could be made ie the player is not blocked in the positions that they are
                    //trying to move to and that they can reach those positions with the current roll.
                    canMove(board, fromDelta, toDelta, remainingMoves, currentPlayer);


                    //Cannot move to the position where blots are taken
                    for( var i = 0; i < toDelta.length; i++){
                        if(toDelta[i] === 1 || toDelta === 26){
                            throw new Error(ILLEGAL_CODE.ILLEGAL_DELTA);
                        }
                    }

                    //If a player has blots taken by opponent then they must enter first
                    if(currentPlayer === 'W'){
                        for( var i = 0; i < toDelta.length; i++){
                            if(toDelta === 1){
                                throw new Error(ILLEGAL_CODE.ILLEGAL_DELTA);
                            }
                        }
                    }

                    //Check that the to point is not held by opposing player
                    for( var i = 0; i < toDelta; i++){
                        if(heldBy(board, toDelta[i]) === opposingPlayer){
                            throw new Error(ILLEGAL_CODE.ILLEGAL_DELTA);
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
                 * empty string.
                 * @param board
                 * @param pointIndex
                 */
                function heldBy(board, pointIndex){

                    var countHeld = 0;
                    var color;

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

                function canMove(board, fromDelta, toDelta, remainingMoves, player){

                    var spacesMoved = [];

                    //Get the number of spaces that the blot moved
                    for(var i = 0; i < toDelta.length; i++){
                        if(fromDelta[i] !== ''){
                            spacesMoved.push(Math.abs(fromDelta - toDelta));
                        }
                    }
                    var rollSum = 0;
                    var rollObject = {};
                    var tempRolls = [];


                    //Check if that is a reachable position
                    for(var i = remainingMoves.length - 1; i >= 0; i--){
                        rollSum = remainingMoves[i];
                        tempRolls = [];
                        tempRolls.push(remainingMoves[i]);

                        for(var j = i -1; j>= 0; j--){
                            rollSum = rollSum + remainingMoves[j];
                            tempRolls.push(remainingMoves[j]);

                            for(var k = spacesMoved.length - 1; k >= 0; k--){
                                if(rollSum === spacesMoved[k]){

                                    //Check that the opposing player doesn't hold the positions between start and
                                    //end point


                                    rollObject.push({movedFromPosition:k, rolls:tempRolls});

                                    //Remove the tempRolls from the remaining moves and spaces moved
                                    spacesMoved.splice(k,1);
                                    remainingMoves.splice(j,i-j);

                                }
                            }

                        }
                    }

                    //If there are moves remaining to be made then see if it is possible to move any other pieces
                    if(remainingMoves.length > 0){

                    }



                }

                return {
                    isMoveOk: isMoveOk,
                    getFirstMove: getFirstMove,
                    createMove: createMove,
                    getJumpMoves: getJumpMoves,
                    getSimpleMoves: getSimpleMoves,
                    getAllPossibleMoves: getAllPossibleMoves,
                    hasMandatoryJumps: hasMandatoryJumps,
                    getJumpedDelta: getJumpedDelta,
                    isOwnColor: isOwnColor,
                    getIllegalEmailObj: getIllegalEmailObj,
                    getWinner: getWinner,
                    getColor: getColor,
                    getKind: getKind,
                    isEmptyObj: isEmptyObj,
                    isSimpleMove: isSimpleMove,
                    isJumpMove: isJumpMove,
                    getInitialBoard: getInitialBoard
                };
            }]);
}());