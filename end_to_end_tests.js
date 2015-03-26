/**
 * Created by islam on 3/21/15.
 */
describe('Backgammon', function(){
    'use strict';

    beforeEach(function () {
        browser.get('http://localhost:9000/game.html');
        //browser.waitForAngular();
        browser.driver.manage().window().setSize(1280, 1024);
    });

    function getSpace(row){
        return element(by.id('e2e_test_space_' + row ));
    }

    function getPiece(row,column,player){
        return element(by.id('e2e_test_piece_' + player + '_' + row + '_' + column));
    }

    function expectPiece(row, column, player){
        if(player === 'W'){
            expect(getPiece(row,column,'W').isDisplayed()).toEqual(true);
        }else if(player === 'B'){
            expect(getPiece(row,column,'B').isDisplayed()).toEqual(true);
        }
    }

    function expectBoard(board){
        for(var row = 0; row < 27; row++){
            for(var column = 0; column < 15; column++){
                expectPiece(row, column, board[row][column]);
            }
        }
    }

//    function setDice(dice){
//        browser.executeScript(function(dice){
//            var scope = window.e2e_test_scope;
//
//        angular.copy(dice, scope.dice);
//        scope.dice1 = dice[0];
//        scope.dice2 =dice[1];
//
//        if(dice[0] === dice[1]){
//            scope.fullDiceArray = [dice[0],dice[0],dice[0],dice[0]];
//        }else{
//            angular.copy(dice,scope.fullDiceArray);
//        }
//        angular.element(document).scope().$apply();},JSON.stringify(dice));
//    }
//
//    function setBoard(board){
//        browser.executeScript( function(board) {
//            var scope = window.e2e_test_scope;
//
//            scope.board = board;
//            angular.element(document).scope().$apply();},JSON.stringify(board));
//    }
//
//    function setTurnIndex(turnIndex){
//        browser.executeScript(function(turnIndex) {
//            var scope = window.e2e_test_scope;
//
//            scope.turnIndex = turnIndex;
//            angular.element(document).scope().$apply();},JSON.stringify(turnIndex));
//    }
//
//    function setEmptyDeltas(){
//        browser.executeScript(function(){
//            var scope = window.e2e_test_scope;
//
//        scope.fromDelta = [];
//        scope.toDelta = [];
//            angular.element(document).scope().$apply();});
//    }
//
//    function initalize(turnIndex, board, dice){
//        browser.executeScript(function(turnIndex,board,dice){
//            var scope = window.e2e_test_scope;
//
//            angular.copy(dice, scope.dice);
//            scope.dice1 = dice[0];
//            scope.dice2 =dice[1];
//
//            if(dice[0] === dice[1]){
//                scope.fullDiceArray = [dice[0],dice[0],dice[0],dice[0]];
//            }else{
//                angular.copy(dice,scope.fullDiceArray);
//            }
//            scope.board = board;
//            scope.turnIndex = turnIndex;
//            scope.fromDelta = [];
//            scope.toDelta = [];
//            angular.element(document).scope().$apply();
//
//
//        },JSON.stringify(turnIndex),JSON.stringify(board),JSON.stringify(dice));
//    }


    // playMode is either: 'passAndPlay', 'playAgainstTheComputer', 'onlyAIs',
    // or a number representing the playerIndex (-2 for viewer, 0 for white player, 1 for black player, etc)
    function setMatchState(matchState, playMode) {
        browser.executeScript(function(matchStateInJson, playMode) {
            var stateService = window.e2e_test_stateService;
            stateService.setMatchState(angular.fromJson(matchStateInJson));
            stateService.setPlayMode(angular.fromJson(playMode));
            angular.element(document).scope().$apply(); // to tell angular that things changes.
        }, JSON.stringify(matchState), JSON.stringify(playMode));
    }

    function clickSpaceAndExpectPiece(row, column, player){
        getSpace(row).click();
        expectPiece(row,column,player);
    }

    function clickPiece(row,column,player){
        getPiece(row,column,player).click();
    }


//    it('should have a title', function (){
//        expect(browser.getTitle()).toEqual('Backgammon');
//    });
//
//    it('should have the inital board', function () {
//       expectBoard(initalBoard);
//
//    });

    it('after rolling a 1 and a 2 white can move 3 spaces', function(){

       setMatchState(matchState1, 'passAndPlay');
//       initalize(0,initalBoard,[1,2]);
//        clickPiece(2,0,'W');
//        initalize(0,initalBoard,[1,2]);
//
//        browser.pause();
       clickPiece(2,0,'W');

       getSpace(5).click();

       expectPiece(5,0,'W');

    });



    var initalBoard =
        [['', '', '', '' , '', '', '', '', '' ,'' ,'', '','','',''],//opponent exists the board
        ['', '', '', '' , '', '', '', '', '' ,'' ,'', '','','',''],//blots taken
        ['W', '', '', '' , '', '', '', '', '' ,'' ,'', '','','',''],//start game board 24   2
        ['', '', '', '' , '', '', '', '', '' ,'' ,'', '','','',''],//23  3
        ['', '', '', '' , '', '', '', '', '' ,'' ,'', '','','',''],//22  4
        ['', '', '', '' , '', '', '', '', '' ,'' ,'', '','','',''],//21  5
        ['W', '', '', '' , '', '', '', '', '' ,'' ,'', '','','',''],//20  6
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

    var board2 =
        [['', '', '', '' , '', '', '', '', '' ,'' ,'', '','','',''],//opponent exists the board
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

    var matchState1 = {
        turnIndexBeforeMove: 0,
        turnIndex: 0,
        endMatchScores: null,
        lastMove: [{setTurn:{turnIndex:0}}, {set:{key:initalBoard}}, {set:{fromDelta:[]}}, {set:{toDelta:0}}],
        lastState: {},
        currentState: {board: initalBoard, dice1: 1,dice2:2,fromDelta:[],toDelta:[]},
        lastVisibleTo: {},
        currentVisibleTo: {}
    };

});