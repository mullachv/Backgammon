/**
 * Created by islam on 3/8/15.
 */
'use strict';
angular.module('myApp')
    .controller('Ctrl', function (
        $window, $scope, $log, $timeout,
        gameService, backGammonLogicService, resizeGameAreaService) {
        resizeGameAreaService.setWidthToHeight(1);

        function updateUI(params){

            if(params.stateBeforeMove === null){
                $scope.board = backGammonLogicService.getInitialBoard();
                $scope.fromDelta = [];
                $scope.toDelta = [];
                $scope.dice = $scope.rollDice();
                $scope.turnIndex = 0;
            }else{
                $scope.board = params.stateAfterMove.board;
                $scope.fromDelta = [];
                $scope.toDelta = [];
                $scope.dice = $scope.rollDice();
                $scope.turnIndex = params.turnIndexAfterMove;
            }
            var tempDice =[];
            angular.copy($scope.dice,tempDice);
            tempDice = backGammonLogicService.totalMoves(tempDice);

            $scope.fullDiceArray = tempDice;
            console.log("Update UI full dice array");
            console.log($scope.fullDiceArray);
            console.log("UpdateUI dice");
            console.log($scope.dice);
            var tempBoard = [[]];
            angular.copy($scope.board,tempBoard);
            $scope.originalBoard = tempBoard;


            //If playing the computer then select a random move
            if(params.playMode === "playAgainstTheComputer"){

                var possibleMoves = backGammonLogicService.getPossibleMoves($scope.board,$scope.fullDiceArray,'B');

                //Select random possible move
                var selection = Math.floor(Math.random() * possibleMoves.length) + 1;

                for(var i =0; i< possibleMoves.from.length; i++){
                    $scope.clickPiece(possibleMoves.from[i]);
                    $scope.clickSpace(possibleMoves.to[i]);
                }

            }


        }



        $scope.clickPiece = function(row){

            console.log("piece clicked");

            //If it is my turn
            if($scope.turnIndex === 0 && $scope.board[row][0] !== 'W'){
                $log.info("White turn, clicked on black player");
                return;
            }else if($scope.turnIndex === 1 && $scope.board[row][0] !== 'B'){
                $log.info("Black turn, clicked on white player");
                return;
            }

            //Then add the row to my from scope, check the number of to scopes if there will be 2 more from's than to's
           //then replace the last from else just add the from
            if($scope.fromDelta.length === $scope.toDelta.length){
                $scope.fromDelta.push(row);
                return;
            }else if($scope.fromDelta.length !== $scope.toDelta.length){
                $scope.fromDelta[$scope.fromDelta.length - 1] = row;
                return;
            }
        };

        function updateCurrentBoard(from, to){
            var firstEmptySpot = emptySpot($scope.board, to);

            var firstEmptyFrom = emptySpot($scope.board, from);
            $scope.board[to][firstEmptySpot] = $scope.board[from][firstEmptyFrom - 1];
            $scope.board[from][firstEmptyFrom - 1] = '';
            return;
        }

        function emptySpot(board, row){
            for(var i = 0; i < board[row].length; i++){
                if(board[row][i] === ''){
                    return i;
                }
            }
        }

        $scope.clickSpace = function(row){

            console.log("SUCESS: " + row);

            //If the number of spaces is equal to the fromDelta array size then don't make a move ()
            if($scope.toDelta.length === $scope.fromDelta.length){
                console.log("Must select a piece to move first");
            }

            var currentPlayer;
            var opposingPlayer;

            if($scope.turnIndex === 0){
                currentPlayer = 'W';
                opposingPlayer='B';
            }else{
                currentPlayer = 'B';
                opposingPlayer = 'W';
            }

            //If its not your turn then don't make a move add any additional toDelta

            if($scope.turnIndex === 0 && $scope.board[$scope.fromDelta[$scope.fromDelta.length - 1]][0] !== 'W'){
                $log.info("Not white's turn");
            }else if($scope.turnIndex === 1 && $scope.board[$scope.fromDelta[$scope.fromDelta.length - 1]][0] !== 'B'){
                $log.info("Not blacks turn");
            }else{

                //check if the space being moved to is held by the opposing player if it is then don't allow
                if(backGammonLogicService.heldBy($scope.board,row) === opposingPlayer){
                    console.log("positoin held by opposing player");
                    return;
                }
                console.log("full dice array before:");
                console.log($scope.fullDiceArray);
                //Check if the player is trying to exit the board, if so can they
                var possibleMoves = backGammonLogicService.getPossibleMoves($scope.board,$scope.fullDiceArray,currentPlayer);
                console.log("full dice array after:");
                console.log($scope.fullDiceArray);
                var madeLegalMove = false;

                //Check the first of the from to moves to see if it is possible form teh current board
                for(var moves = 0; moves<possibleMoves.length;moves++){
                    if(possibleMoves[moves].from[0] === $scope.fromDelta[$scope.fromDelta.length -1] &&
                        possibleMoves[moves].to[0] === row){
                        madeLegalMove = true;
                    }
                }
                //Check the case that player moves some combination of possible moves ie rolls 4 and 3 and moves
                //7 spaces
                for(var moves = 0; moves<possibleMoves.length;moves++){
                    var tempFrom = $scope.fromDelta[$scope.fromDelta.length -1];
                    var tempTo = row;
                    var totalNumberOfSpaces = Math.abs(tempFrom-tempTo);
                    var runningTotal = 0;
                    for(var z = 0; z < possibleMoves[moves].from.length;z++){
                       runningTotal +=   Math.abs(possibleMoves[moves].from[z] - possibleMoves[moves].to[z]);
                        if (runningTotal === totalNumberOfSpaces && possibleMoves[moves].from[0] === tempFrom
                            && possibleMoves[moves].to[z] === tempTo){
                            madeLegalMove = true;
                            break;
                        }
                    }
                }

                //If not a legal move then return
                if(!madeLegalMove){
                    //no legal moves then switch turns
                    if(possibleMoves === false){
                        if(!backGammonLogicService.hasLegalMove($scope.board,$scope.fullDiceArray,currentPlayer)){
                            try{
                                var move = backGammonLogicService
                                    .createMove($scope.turnIndex,$scope.originalBoard,$scope.fromDelta,$scope.toDelta, $scope.dice);

                                console.log("move being made");
                                gameService.makeMove(move);
                            }catch(e){
                                $log.info("Illegal Move");
                                console.log(e);
                            }
                        }
                    }else{
                        console.log("Get possible move malfunction");
                        return;
                    }

                }else{
                    //Push the move through and check if that is the last remaining move to be made before the
                    //full move is submitted
                    $scope.toDelta.push(row);
                    backGammonLogicService.makeMove($scope.board,$scope.fromDelta[$scope.fromDelta.length -1], row, currentPlayer);
                    //updateCurrentBoard($scope.fromDelta[$scope.fromDelta.length -1], row);

                    angular.copy($scope.dice, $scope.fullDiceArray);
                    $scope.fullDiceArray = backGammonLogicService.totalMoves($scope.fullDiceArray)
                    backGammonLogicService.getUnusedRolls($scope.fromDelta,$scope.toDelta, $scope.fullDiceArray);


                    //Check if there are any remaining legal moves. If not then send the move
                    if(!backGammonLogicService.hasLegalMove($scope.board,$scope.fullDiceArray,currentPlayer)){
                        try{
                            var move = backGammonLogicService
                                .createMove($scope.turnIndex,$scope.originalBoard,$scope.fromDelta,$scope.toDelta, $scope.dice);

                            console.log("move being made");
                            gameService.makeMove(move);
                        }catch(e){
                            $log.info("Illegal Move");
                            console.log(e);
                        }
                    }
                }
            }
        };

        //Gives the total number of moves that can be made, expands the dice to 4 items if doubles are rolled
       ;


        $scope.completeMove = function(){
            //Pass the create move to the gameService.makeMove()
            try{
                var move = backGammonLogicService
                    .createMove($scope.turnIndex, $scope.board, $scope.fromDelta, $scope.toDelta, $scope.dice);

                gameService.makeMove(move);
            }catch(e){
                $log.info("Illegal move");
            }
        };

        $scope.rollDice = function(){
            //return the dice array that will be displayed and used in the make move
            $scope.dice1 = Math.floor(Math.random() * 6) + 1;
            $scope.dice2 = Math.floor(Math.random() * 6) + 1;

            var roll = [$scope.dice1, $scope.dice2];
            $scope.dice = roll;
            return roll;
        };

        $scope.getImageSource = function(row,col){
            //From the board in scope
            var cell = $scope.board[row][col];

            if(cell === 'W'){
                return 'white_man.png'
            }else if(cell === 'B'){
                return 'black_man.png'
            }else{
                return '';
            }
        };

         $scope.getRowPosition = function (row){
            //White taken position
             if(row === 1 || row === 26){
                 return 46 + "%"
             }

             if(row >= 2 && row <= 7){
                var value = 9 + 6 * (row -2);
                //console.log("current row:" + row +" Value on board:" + value);
                return value + '%';
            }

            if(row >= 8 && row <= 13){
                 var value = 18.5 + 6 * (row -2);
                 //console.log("current row:" + row +" Value on board:" + value);
                 return value + '%';
            }

            if(row >=14 && row <= 19){
                var value = 85 - (row -14) * 6;
                //console.log("current row:" + row +" Value on board:" + value);
                return value + '%';
            }

             if(row >=20 && row <= 25){
                 var value = 39 - (row -20) * 6;
                 //console.log("current row:" + row +" Value on board:" + value);
                 return value + '%';
             }

             return 0 + '%';
        };

        $scope.getColumnPositon= function (row, column){
            if(row >= 1 && row <= 13){
                var value = 6 + column * 4;
                //console.log("current column:" + column +" Value on board:" + value);
                return value + '%';
            }

            if(row >=14 && row <= 26){
                var value = 87 - column * 4;
                //console.log("current column:" + column +" Value on board:" + value);
                return value + '%';
            }

            return 0 + '%';
        };

        $scope.getBoardPosition = function(row,column){
           var top = getColumnPositon(column);
           var right = getRowPosition(row);

           if(top === undefined || right === undefined){
               return "";
           }
           //console.log("position:absolute; top:" + top + "%; right:" + right +"%; width:7%; height:7%");
           return "{position:absolute; top:" + top + "%; right:" + right +"%; width:7%; height:7%}";
        };


        $scope.shouldShowImage = function(row,column){
            var cell = $scope.board[row][column];
            var value = cell !=="";
            //console.log("contents of row and column" + row + " " + column + " " + value);
            return cell !== "";
        };

       function getDiceImage (diceValue){
            switch(diceValue){
                case 1:
                    return 'd1.gif';
                break;

                case 2:
                    return 'd2.gif';
                break;

                case 3:
                    return 'd3.gif';
                break;

                case 4:
                    return 'd4.gif';
                break;

                case 5:
                    return 'd5.gif';
                break;

                case 6:
                    return 'd6.gif';
                break;

                default:
                    console.log("error dice out of range:" + $scope.dice1);
                    return "";
            }
        }

        $scope.getDice1 = function(){
            return getDiceImage($scope.dice1);
        };

        $scope.getDice2 = function(){
            return getDiceImage($scope.dice2);
        };

        $scope.pieceColor = function (row,column){
            return $scope.board[row][column];
        };




        gameService.setGame({
            gameDeveloperEmail: "ibtawfik@gmail.com",
            minNumberOfPlayers: 2,
            maxNumberOfPlayers: 2,
            isMoveOk: backGammonLogicService.isMoveOk,
            updateUI: updateUI
        });
    });