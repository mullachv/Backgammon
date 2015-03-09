/**
 * Created by islam on 3/8/15.
 */
'use strict';
angular.module('myApp')
    .controller('Ctrl', function (
        $window, $scope, $log, $timeout,
        gameService, backGammonLogicService, resizeGameAreaService) {
        resizeGameAreaService.setWidthToHeight(1);





        $scope.clickPiece = function(row){
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
        }

        $scope.clickSpace = function(row){
            //If the number of spaces is equal to the fromDelta array size then don't make a move ()
            if($scope.toDelta.length !== $scope.fromDelta.length){
                $log.info("Must select a piece to move first");
            }

            var currentPlayer;

            if($scope.turnIndex === 'W'){
                currentPlayer = 'W';
            }else{
                currentPlayer = 'B';
            }

            //If its not your turn then don't make a move add any additional toDelta
            if($scope.turnIndex === 0 && $scope.board[row][0] !== 'W'){
                $log.info("Not white's turn");
            }else if($scope.turnIndex === 1 && $scope.board[row][0] !== 'B'){
                $log.info("not blacks turn");
            }else{
                $scope.toDelta.push(row);
                return;
            }
            //Else add to scope.toDelta
        }

        $scope.completeMove = function(){

            //Pass the create move to the gameService.makeMove()

            //Log any exceptions

        }

        $scope.rollDice = function(){
            //return the dice array that will be displayed and used in the make move
            $scope.dice1 = Math.floor(Math.random() * 6);
            $scope.dice2 = Math.floor(Math.random() * 6);

            var roll = [$scope.dice1, $scope.dice2];
            return roll;
        }

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
        }

        gameService.setGame({
            gameDeveloperEmail: "ibtawfik@gmail.com",
            minNumberOfPlayers: 2,
            maxNumberOfPlayers: 2,
            isMoveOk: backGammonLogicService.isMoveOk,
            updateUI: updateUI
        });
    });