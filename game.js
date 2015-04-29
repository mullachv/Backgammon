/**
 * Created by islam on 3/8/15.
 */
'use strict';
angular.module('myApp')
    .controller('Ctrl', ['$scope','$animate','$element', '$log', '$timeout',
        'aiService','gameService', 'stateService', 'backGammonLogicService',
        'resizeGameAreaService',

        function (
        $scope,$animate,$element, $log, $timeout,
        aiService, gameService,stateService, backGammonLogicService, resizeGameAreaService) {
        resizeGameAreaService.setWidthToHeight(1);

        $scope.counter = 0;


        $scope.shouldSlowlyAppear = function(row,column){
            if($scope.fromDelta.length === 0 || $scope.toDelta.length === 0){
                return false;
            }
            var from = $scope.fromDelta[$scope.fromDelta.length - 1];
            var to = $scope.toDelta[$scope.toDelta.length - 1];
            var player = $scope.board[from][0];
            var columnTo = -1;


            for(var i  = 14; i >= 0; i--) {
                if ($scope.board[to][i] === player) {
                    columnTo = i;
                    break;
                }
            }

            if(to === row && column === columnTo){
                return true;
            }else{
                return false;
            }
        };

        function addAnimationFrom(){
            var from = $scope.fromDelta[$scope.fromDelta.length - 1];
            var to = $scope.toDelta[$scope.toDelta.length - 1];
            var player = $scope.board[from][0];
            var column = -1;


            for(var i  = 14; i >= 0; i--) {
                if ($scope.board[from][i] === player) {
                    column = i;
                    break;
                }
            }



            var element1 = document.getElementById('e2e_test_piece_' + player + '_'+from+'_'+column);
            $animate.addClass(element1, 'slowlyDisapear');

        }


        function updateUI(params){
            if($scope.counter === 0){
                $scope.counter = 1;
                var temp = [['', '', '', '' , '', '', '', '', '' ,'' ,'', '','','',''],//opponent exists the board
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
                    ['', '', '', '' , '', '', '', '', '' ,'' ,'', '','','','']];//opponent exits the board 27;
                $scope.board = temp;
                return;
            }else if($scope.counter === 1){
                $scope.counter = 2;
                makeInitialMove();
                return;
            }
            var state = stateService.getMatchState();

//                if(params.stateAfterMove.board === undefined){
//                    var temp = [['', '', '', '' , '', '', '', '', '' ,'' ,'', '','','',''],//opponent exists the board
//                        ['', '', '', '' , '', '', '', '', '' ,'' ,'', '','','',''],//blots taken
//                        ['W', 'W', '', '' , '', '', '', '', '' ,'' ,'', '','','',''],//start game board 24   2
//                        ['', '', '', '' , '', '', '', '', '' ,'' ,'', '','','',''],//23  3
//                        ['', '', '', '' , '', '', '', '', '' ,'' ,'', '','','',''],//22  4
//                        ['', '', '', '' , '', '', '', '', '' ,'' ,'', '','','',''],//21  5
//                        ['', '', '', '' , '', '', '', '', '' ,'' ,'', '','','',''],//20  6
//                        ['B', 'B', 'B', 'B' , 'B', '', '', '', '' ,'' ,'', '','','',''],//19 7
//                        ['', '', '', '' , '', '', '', '', '' ,'' ,'', '','','',''],//18  8
//                        ['B', 'B', 'B', '' , '', '', '', '', '' ,'' ,'', '','','',''],//17  9
//                        ['', '', '', '' , '', '', '', '', '' ,'' ,'', '','','',''],//16 10
//                        ['', '', '', '' , '', '', '', '', '' ,'' ,'', '','','',''],//15 11
//                        ['', '', '', '' , '', '', '', '', '' ,'' ,'', '','','',''],//14 12
//                        ['W', 'W', 'W', 'W' , 'W', '', '', '', '' ,'' ,'', '','','',''],//13 13
//                        ['B', 'B', 'B', 'B' , 'B', '', '', '', '' ,'' ,'', '','','',''],//12 14
//                        ['', '', '', '' , '', '', '', '', '' ,'' ,'', '','','',''],//11 15
//                        ['', '', '', '' , '', '', '', '', '' ,'' ,'', '','','',''],//10 16
//                        ['', '', '', '' , '', '', '', '', '' ,'' ,'', '','','',''],//9 17
//                        ['W', 'W', 'W', '' , '', '', '', '', '' ,'' ,'', '','','',''],//8 18
//                        ['', '', '', '' , '', '', '', '', '' ,'' ,'', '','','',''],//7 19
//                        ['W', 'W', 'W', 'W' , 'W', '', '', '', '' ,'' ,'', '','','',''],//6 20
//                        ['', '', '', '' , '', '', '', '', '' ,'' ,'', '','','',''],//5 21
//                        ['', '', '', '' , '', '', '', '', '' ,'' ,'', '','','',''],//4 22
//                        ['', '', '', '' , '', '', '', '', '' ,'' ,'', '','','',''],//3 23
//                        ['', '', '', '' , '', '', '', '', '' ,'' ,'', '','','',''],//2 24
//                        ['B', 'B', '', '' , '', '', '', '', '' ,'' ,'', '','','',''],//end game board //1 25
//                        ['', '', '', '' , '', '', '', '', '' ,'' ,'', '','','',''],//blots taken 26
//                        ['', '', '', '' , '', '', '', '', '' ,'' ,'', '','','','']];//opponent exits the board 27;
//                    $scope.board = temp;
//                }else{
                    $scope.board = params.stateAfterMove.board;
//                }

                $scope.fromDelta = [];
                $scope.toDelta = [];
                $scope.dice = [params.stateAfterMove.dice1, params.stateAfterMove.dice2];
                $scope.dice1 = params.stateAfterMove.dice1;
                $scope.dice2 = params.stateAfterMove.dice2;
                $scope.turnIndex = params.turnIndexAfterMove;


            var tempDice =[];
            angular.copy($scope.dice,tempDice);
            tempDice = backGammonLogicService.totalMoves(tempDice);

            $scope.fullDiceArray = tempDice;
            var tempBoard =[[]];
            angular.copy($scope.board,tempBoard);
            $scope.originalBoard = tempBoard;

            if($scope.turnIndex === 0){
                var currentPlayer = 'W';
            }else{
                var currentPlayer = 'B';
            }

            //Checking for initial fake make move
//            $scope.isYourTurn = params.stateBeforeMove !== null &&          // -1 means game end, -2 means game viewer
//                params.yourPlayerIndex === params.turnIndexAfterMove;     // it's my turn
//
//            console.log("player index: "+params.yourPlayerIndex);
//            console.log("player index after: "+params.turnIndexAfterMove);
//
//            if ($scope.dice1 === undefined || $scope.dice1 == null){
//                if($scope.isYourTurn){
//                    debugger;
//                    makeInitialMove();
//                    return;
//                }else{
//                    return;
//                }
//            }

            $scope.possibleMoves = backGammonLogicService.getPossibleMoves($scope.board,$scope.fullDiceArray,currentPlayer);

            //If playing the computer then select a random move
            if(params.playMode === "playAgainstTheComputer" && $scope.turnIndex === 1 ||
                params.playMode === "aisOnly"){
                $scope.$apply()
                createComputerMover();
            }
        }

        function isEmptyObj(obj){
            for(var prop in obj) {
                if(obj.hasOwnProperty(prop))
                    return false;
            }
            return true;
        }

        function createComputerMover(){
            var testingVaribale = true;

            if($scope.turnIndex === 0){
                var player = 'W';
            }else{
                var player = 'B';
            }

            var tempBoard = [[]];
            var tempDiceArray =[];
            angular.copy($scope.board,tempBoard);
            angular.copy($scope.fullDiceArray,tempDiceArray);


            var move = aiService.createComputerMove(tempBoard,tempDiceArray,player,$scope.possibleMoves);

            try{
                //if no legal move then switch turns
                if(move === [] || move === undefined){
                    testingVaribale = false;
                    var turnIdx;
                    if(player === 'W') {
                        turnIdx = 1;
                    }else {
                        turnIdx = 0;
                    }

                    var setTurn = {setTurn: {turnIndex: turnIdx}};
                    var move = [setTurn,
                        {set: {key: 'board', value: $scope.board}},
                        {set: {key: 'fromDelta', value: {fromDelta: $scope.fromDelta}}},
                        {set: {key: 'toDelta', value: {toDelta: $scope.toDelta}}},
                        {setRandomInteger: {key: 'dice1', from:1, to:7}},
                        {setRandomInteger: {key: 'dice2', from:1, to:7}}]
                    gameService.makeMove(move);
                }else{
                    for(var i =0; i< move.from.length; i++){
                        clickPieceInXMilliseconds(move.from[i], i * 2000);
                        clickSpaceInXMilliseconds(move.to[i], 1000 + i * 2000);
                    }
                }
            }catch(e){
                $log.info("Illegal Move");
                console.log(e);
            }
        }

        function clickPieceInXMilliseconds(piece, milliseconds) {
            $timeout(function () {
                $scope.clickPiece(piece);
            }, milliseconds);
        }

        function clickSpaceInXMilliseconds(piece, milliseconds) {
            $timeout(function () {
                $scope. clickSpace(piece);
            }, milliseconds);
        }

        window.e2e_test_statexService = stateService;

        window.handleDragEvent = function(event, type, clientX, clientY){
            var id = event.target.id;
            if(type === 'touchstart' && isPiece(id)){
                $scope.clickPiece(getRow(id));
            }else if(type === 'touchend' && isBgSpace(id)){
                $scope.clickSpace(getRow(id));
            }
        };


        function isPiece(id){
            if( id.indexOf("piece") > -1){
                return true;
            }else{
                return false;
            }
        }

        function isBgSpace(id){
            if(id.indexOf("space") > -1){
                return true;
            }else{
                return false;
            }
        }

        function getRow(id){
            var splitString = id.split("_");

            if(isPiece(id)){
                return parseInt(splitString[4]);
            }else if(isBgSpace(id)){
                return parseInt(splitString[3]);
            }else{
                return false;
            }

        }


        $scope.clickPiece = function(row){
            checkInvariant();
            if($scope.fullDiceArray.length === 4){
                var debugStmt = '';
            }

            //If it is my turn
            if($scope.turnIndex === 0 && $scope.board[row][0] !== 'W'){
                $log.info("White turn, clicked on black player");
                $scope.$apply();
                return;
            }else if($scope.turnIndex === 1 && $scope.board[row][0] !== 'B'){
                $log.info("Black turn, clicked on white player");
                $scope.$apply();
                return;
            }

            //Then add the row to my from scope, check the number of to scopes if there will be 2 more from's than to's
           //then replace the last from else just add the from
            if($scope.fromDelta.length === $scope.toDelta.length){
                $scope.fromDelta.push(row);
                $scope.$apply();
                return;
            }else if($scope.fromDelta.length !== $scope.toDelta.length){
                $scope.fromDelta[$scope.fromDelta.length - 1] = row;
                $scope.$apply();
                return;
            }
            $scope.$apply();
            checkInvariant();
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

        function checkInvariant() {
            if ($scope.toDelta.length !== $scope.fromDelta.length && $scope.toDelta.length !== $scope.fromDelta.length - 1) {
                throw new Error("Invariant broken: fromDelta=" + $scope.fromDelta + " toDelta=" + $scope.toDelta);
            }
        }

        $scope.clickSpace = function(row){
            checkInvariant();

            //If the number of spaces is equal to the fromDelta array size then don't make a move ()
            if($scope.toDelta.length === $scope.fromDelta.length){
                console.log("Must select a piece to move first");
                return;
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


                //Check if the player is trying to exit the board, if so can they
                var possibleMoves = backGammonLogicService.getPossibleMoves($scope.board,$scope.fullDiceArray,currentPlayer);


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
                                //remove latest clicked from delta
                                $scope.fromDelta.pop();

                                //Create a partial move if there was one,
                                if($scope.fromDelta.length > 0){
                                    var move = backGammonLogicService
                                        .createMove($scope.turnIndex,$scope.originalBoard,$scope.fromDelta,$scope.toDelta, $scope.dice);

                                }else{
                                    var turnIdx;
                                    if(currentPlayer === 'W') {
                                        turnIdx = 1;
                                    }else {
                                        turnIdx = 0;
                                    }

                                    var setTurn = {setTurn: {turnIndex: turnIdx}};
                                    var move = [setTurn,
                                        {set: {key: 'board', value: $scope.board}},
                                        {set: {key: 'fromDelta', value: {fromDelta: $scope.fromDelta}}},
                                        {set: {key: 'toDelta', value: {toDelta: $scope.toDelta}}},
                                        {setRandomInteger: {key: 'dice1', from:1, to:7}},
                                        {setRandomInteger: {key: 'dice2', from:1, to:7}}]
                                }



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
                    addAnimationFrom();
                    var wait = 500;
                    $timeout(function(){
                        backGammonLogicService.makeMove($scope.board,$scope.fromDelta[$scope.fromDelta.length -1], row, currentPlayer);
                        //updateCurrentBoard($scope.fromDelta[$scope.fromDelta.length -1], row);

                        angular.copy($scope.dice, $scope.fullDiceArray);
                        $scope.fullDiceArray = backGammonLogicService.totalMoves($scope.fullDiceArray);
                        backGammonLogicService.getUnusedRolls($scope.fromDelta,$scope.toDelta, $scope.fullDiceArray);


                        //addAnimationTo();

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
                    },wait);



                }
            }
            $scope.$apply();
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

            var colOfMove = -1;
            var returnObject = {imgSource: '', isBlackMan: false,isWhiteMan : false, isSelected: false};


            //If a move in progress then highlight the blot
            if($scope.fromDelta.length > $scope.toDelta.length &&
                $scope.fromDelta[$scope.fromDelta.length - 1] === row){

                for(var i =14; i >= 0; i--){
                    if($scope.board[row][i] !== ""){
                        colOfMove = i;
                        break;
                    }
                }
            }


            if(cell === 'W'){
                if(colOfMove === col){
                    returnObject.imgSource = 'white_man_selected.png';
                    returnObject.isWhiteMan = true;
                    returnObject.isSelected = true;
                    return returnObject;
                }else{
                    returnObject.imgSource = 'white_man.png';
                    returnObject.isWhiteMan = true;
                    return returnObject;
                }


            }else if(cell === 'B'){
                if(colOfMove === col){
                    returnObject.imgSource = "black_man_selected.png";
                    returnObject.isBlackMan = true;
                    returnObject.isSelected = true;
                    return returnObject;
                }else{
                    returnObject.imgSource = 'black_man.png';
                    returnObject.isBlackMan = true;
                    return returnObject;
                }
            }else{
                return returnObject;
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

            if(row === 0 || row === 27){
                return false;
            }
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

        function makeInitialMove(){
            gameService.makeMove([{set: {key: 'board', value: [['', '', '', '' , '', '', '', '', '' ,'' ,'', '','','',''],//opponent exists the board
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
                ['', '', '', '' , '', '', '', '', '' ,'' ,'', '','','','']]}},
                {set: {key: 'fromDelta', value: {fromDelta: []}}},
                {set: {key: 'toDelta', value: {toDelta: []}}},
                {setTurn: {turnIndex: 0}},
                {setRandomInteger: {key: 'dice1', from:1, to:7}},
                {setRandomInteger: {key: 'dice2', from:1, to:7}}]);
        }


//        [setTurn,
//            {set: {key: 'board', value: currentBoard}},
//            {set: {key: 'fromDelta', value: {fromDelta: fromDelta}}},
//            {set: {key: 'toDelta', value: {toDelta: toDelta}}},
//            {setRandomInteger: {key: 'dice1', from:1, to:7}},
//            {setRandomInteger: {key: 'dice2', from:1, to:7}}]

    }]);