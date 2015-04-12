/**
 * Created by islam on 4/4/15.
 */

angular.module('myApp').factory('aiService' , ['backGammonLogicService',
function(backGammonLogicService){
    'use strict';

    function createComputerMove(board, rollArray, player, possibleMoves){
        var start = new Date().getTime();
        var topScore = -1;
        var bestMove = 0;

        //create board for the move
        for (var i = 0; i < possibleMoves.length;i++){
            var currentBoard =[[]];
            angular.copy(board,currentBoard);


            for(var j = 0; j < possibleMoves[i].from.length; j++){
                currentBoard =
                    backGammonLogicService.makeMove(currentBoard,possibleMoves[i].from[j],possibleMoves[i].to[j],player);
            }

            var score = scoreBoard(player,currentBoard);
            if(score > topScore){
                topScore = score;
                bestMove = i;
            }
        }
        //return the move with the max score
        var end = new Date().getTime();
        console.log(end - start);
        return possibleMoves[bestMove];

    }

    function scoreBoard(player, board){
        if(player === 'W'){
            return scoreWhiteBoard(board);
        }else{
            return scoreBlackBoard(board);
        }
    }

    function scoreWhiteBoard(board){
        var score = 0;
        for(var row = 2; row <= 27; row++ ){
            for(var column = 0; column <= 14; column ++){
                var pointIndexForScoring = row - 1;

                //Scoring for most of the board, will give bonus for moving to
                //home board
                if(row >=2 && row < 21 && board[row][column] === 'W'){
                    //Score .5 * position index if no house built
                    if(column === 0){
                        score += .5 * pointIndexForScoring;
                    }else{ //Score .75 * position index if house built
                        score += .75 * pointIndexForScoring;
                    }
                }

                if(row >= 19 && row<= 25 && board[row][column] === 'W'){
                    if(column === 0){
                        //Discourage additional movment on the home board, move other players forward first
                        score+= .85 * 20 + pointIndexForScoring * .01;
                    }else{
                        score += .90 * 20 + pointIndexForScoring * .01;
                    }
                }

                //If opponent piece taken then 10 points
                if(row === 26 && board[row][column] === 'B'){
                    score += 20;
                }

                //Highly favor exiting the board
                if(row === 27 && column !== 14 && board[row][column] === 'W'){
                    score += 30;
                }

                //If can exit the final piece then do it!!
                if(row === 27 && column === 14 && board[row][column] === 'W'){
                    score += 1000000000;
            }

            }
        }
        return score;
    }

    function scoreBlackBoard(board){
        var score = 0;
        var valuesForScoring = [27,26,25,24,23,22,21,20,19,18,17,16,15,14,13,12,11,10,9,8,7,6,5,4,3,2,1,0];

        for(var row = 0; row <= 25; row++ ){
            for(var column = 0; column <= 14; column ++){
                var pointIndexForScoring = valuesForScoring[row] - 1;

                //Scoring for most of the board, will give bonus for moving to
                //home board
                if(row >=8 && row < 26 && board[row][column] === 'B'){
                    //Score .5 * position index if no house built
                    if(column === 0){
                        score += .5 * pointIndexForScoring;
                    }else{ //Score .75 * position index if house built
                        score += .75 * pointIndexForScoring;
                    }
                }

                if(row <= 7 && row > 1 && board[row][column] === 'B'){
                    if(column === 0){
                        score+= .85 * 20 + pointIndexForScoring * .01;
                    }else{
                        score += .90 * 20 + pointIndexForScoring * .01;
                    }
                }

                //If opponent piece taken then 20 points
                if(row === 1 && board[row][column] === 'W'){
                    score += 20;
                }

                //Highly favor exiting the board
                if(row === 0 && column !== 14 && board[row][column] === 'B'){
                    score += 30;
                }

                //If can exit the final piece then do it!!
                if(row === 0 && column === 14 && board[row][column] === 'B'){
                    score += 1000000000;
                }
            }

        }

        return score;
    }

    return {createComputerMove: createComputerMove};

}]);
