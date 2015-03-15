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
            console.log("updated UI");

            if(params.stateBeforeMove === null){
                $scope.board = backGammonLogicService.getInitialBoard();
                $scope.fromDelta = [];
                $scope.toDelta = [];
                $scope.dice = $scope.rollDice();
                $scope.turnIndex = 0;
            }else{
                $scope.board = params.stateBeforeMove.board;
                $scope.fromDelta = params.stateBeforeMove.fromDelta;
                $scope.toDelta = params.stateBeforeMove.toDelta;
                $scope.dice = params.stateBeforeMove.dice;
                $scope.turnIndex = params.turnIndexBeforeMove;
            }
            var tempDice =[];
            angular.copy($scope.dice,tempDice);
            tempDice = backGammonLogicService.totalMoves(tempDice);
            $scope.fullDiceArray = tempDice

            var tempBoard = [[]];
            angular.copy($scope.board,tempBoard);
            $scope.afterBoard = tempBoard

        }

//        var returnValue = [setTurn,
//            {set: {key: 'board', value: currentBoard}},
//            {set: {key: 'fromDelta', value: {fromDelta: fromDelta}}},
//            {set: {key: 'toDelta', value: {toDelta: toDelta}}},
//            {set: {key: 'dice', value: {dice: dice}}}];

        //updateUI({turnIndex: 0, board: [], fromDelta: [], toDelta:[], dice: []});





        $scope.clickPiece = function(row){

            console.log($scope.dice);
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
            }else if($scope.fromDelta.length +1 === $scope.toDelta.length){
                $scope.fromDelta[$scope.fromDelta.length - 1] = row;
                return;
            }
        };

        function updateCurrentBoard(from, to){
            var firstEmptySpot = emptySpot($scope.afterBoard, to);
            console.log("first empty spot:" + firstEmptySpot);
            var firstEmptyFrom = emptySpot($scope.afterBoard, from);
            $scope.afterBoard[to][firstEmptySpot] = $scope.afterBoard[from][firstEmptyFrom - 1];
            $scope.afterBoard[from][firstEmptyFrom - 1] = '';
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

            //console.log("SUCESS");

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

            if($scope.turnIndex === 0 && $scope.afterBoard[$scope.fromDelta[$scope.fromDelta.length - 1]][0] !== 'W'){
                $log.info("Not white's turn");
            }else if($scope.turnIndex === 1 && $scope.afterBoard[$scope.fromDelta[$scope.fromDelta.length - 1]][0] !== 'B'){
                $log.info("Not blacks turn");
            }else{

                //check if the space being moved to is held by the opposing player if it is then don't allow
                if(backGammonLogicService.heldBy($scope.afterBoard,row) === opposingPlayer){
                    console.log("positoin held by opposing player");
                    return;
                }

                //Check if the player is trying to exit the board, if so can they
                var possibleMoves = backGammonLogicService.getPossibleMoves($scope.board,$scope.fullDiceArray,currentPlayer);

                console.log("possoble form: ");
                console.log(possibleMoves[0].from);
                console.log("possible to: ");
                console.log(possibleMoves[0].to);
                //Check that the current move is in the possible array
                var currentMove = {from: $scope.fromDelta[$scope.fromDelta.length -1], to: row};
                var madeLegalMove = false;

                for(var i = 0; i < possibleMoves.length ; i++){
                    if(angular.equals(possibleMoves[i],currentMove)){
                        madeLegalMove = true;
                        break;
                    }
                }

                //If not a legal move then return
                if(!madeLegalMove){
                    console.log("Get possible move malfunction");
                    return;
                }else{
                    //Push the move through and check if that is the last remaining move to be made before the
                    //full move is submitted
                    $scope.toDelta.push(row);

                    updateCurrentBoard($scope.fromDelta[$scope.formDelta.length -1], row);

                    backGammonLogicService.getUnusedRolls($scope.fromDelta,$scope.toDelta, $scope.fullDiceArray);

                    //Check if there are any remaining legal moves. If not then send the move
                    if(!backGammonLogicService.hasLegalMove($scope.afterBoard,$scope.fullDiceArray,currentPlayer)){
                        try{
                            var move = backGammonLogicService
                                .createMove($scope.turnIndex,$scope.board,$scope.fromDelta,$scope.toDelta, $scope.dice);

                            console.log("move being made");
                            gameService.makeMove(move);
                        }catch(e){
                            $log.info("Illegal Move");
                        }
                    }
                }


//                $scope.toDelta.push(row);
//                updateCurrentBoard($scope.fromDelta[$scope.fromDelta.length-1], row);
//
//                backGammonLogicService.getUnusedRolls($scope.fromDelta,$scope.toDelta, $scope.fullDiceArray);
//
//                //Check if its time to switch players and submit a move
//                console.log(backGammonLogicService.hasUsedFullRoll($scope.fromDelta, $scope.toDelta, $scope.fullDiceArray));
//                console.log($scope.fromDelta);
//                console.log($scope.toDelta);
//                console.log($scope.fullDiceArray);
//                console.log($scope.fullDiceArray.length)
//                if($scope.fullDiceArray.length === 0){
//                    try{
//                        console.log("in try/catch");
//                        console.log($scope.dice);
//                        var move = backGammonLogicService
//                            .createMove($scope.turnIndex, $scope.board, $scope.fromDelta, $scope.toDelta, $scope.dice);
//                        //createMove(turnIndexBeforeMove ,board, fromDelta, toDelta, dice)
//
//                        console.log("create move worked");
//                        gameService.makeMove(move);
//                    }catch(e){
//                        $log.info("Illegal move");
//                    }
//                }
//
//                return;
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
            if(row >= 2 && row <= 13){
                var value = 6 + column * 4;
                //console.log("current column:" + column +" Value on board:" + value);
                return value + '%';
            }

            if(row >=14 && row <= 25){
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




        gameService.setGame({
            gameDeveloperEmail: "ibtawfik@gmail.com",
            minNumberOfPlayers: 2,
            maxNumberOfPlayers: 2,
            isMoveOk: backGammonLogicService.isMoveOk,
            updateUI: updateUI
        });
    });