/**
 * Created by islam on 3/21/15.
 */
describe('Backgammon', function(){
    'use strict';

    beforeEach(module('myApp','Ctrl'));
    var scope;
    beforeEach(inject(function (backGammonLogicService,Ctrl) {
        scope = Ctrl.$scope;
        browser.get('http://localhost:9000/game.html');
    }));



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

    function getSpace(row){
        return element(by.id('e2e_test_space_' + row ));
    }

    function getPiece(row,column,player){
        //grunt.log(element(by.id('e2e_test_piece_' + player + '_' + row + '_' + column)));
        return element(by.id('e2e_test_piece_' + player + '_' + row + '_' + column));
    }

    function expectPiece(row, column, player){
        if(player === 'W'){
            expect(getPiece(row,column,'W').isDisplayed()).toEqual(true);
        }else if(player === 'B'){
            expect(getPiece(row,column,'B').isDisplayed()).toEqual(true);
        }
//        expect(getPiece(row,column,'B').isDisplayed()).toEqual(player === 'B' ? true : false);
//        expect(getPiece(row,column,'W').isDisplayed()).toEqual(player === 'W' ? true : false);
    }

    function expectBoard(board){
        for(var row = 0; row < 27; row++){
            for(var column = 0; column < 15; column++){
                expectPiece(row, column, board[row][column]);
            }
        }
    }

    function clickSpaceAndExpectPiece(row, column, player){
        getSpace(row).click();
        expectPiece(row,column,player);
    }

    function setDice(diceArray){
        angular.copy(diceArray, scope.dice);

    }

    it('should have a title', function (){
        expect(browser.getTitle()).toEqual('Backgammon');
    });

    it('should have the inital board', function () {
       expectBoard(initalBoard);
    });

    it('after rolling a 1 and a 2 white can move 3 spaces', function(){
        setDice([1,2]);
    });


    var initalBoard =
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

    var dice = [1,2];

    var matchState2 = {
        turnIndexBeforeMove: 0,
        turnIndex: 0,
        endMatchScores: null,
        lastMove: [{setTurn: {turnIndex: 1}},
            {set: {key: 'board', value: initalBoard}},
            {set: {key: 'fromDelta', value:2}},
            {set:{key: 'toDelta', value:5}}],
        lastState: {board: null, dice: null, fromDelta:null, toDelta:null},
        currentState: {board: board2, dice: dice, fromDelta:[2], toDelta:[5]},
        lastVisibleTo: {},
        currentVisibleTo: {}
    };





//{set: {key: 'board', value: currentBoard}},
//{set: {key: 'fromDelta', value: {fromDelta: fromDelta}}},
//{set: {key: 'toDelta', value: {toDelta: toDelta}}},
//{set: {key: 'dice', value: {dice: dice}}}];

});