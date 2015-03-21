/**
 * Created by islam on 3/21/15.
 */
describe('Backgammon', function(){
    'use strict';


    beforeEach(function(){
        browser.get('http://localhost:9000/game.html')
    });

    function getSpace(row){
        return element(by.id('e2eSpace' + row ));
    }

    function getPiece(row, column){
        return element(by.id('e2e_test_' + row + column));
    }

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


};
    var matchState2 = {
        turnIndexBeforeMove: 1,
        turnIndex: 0,
        endMatchScores: null,
        lastMove: [{setTurn: {turnIndex: 0}},
            {set: {key: 'board', value: intialBoard}},
            {set: {key: 'fromDelta', value:2}},
            {set:{key: 'toDelta', value:3}}],
        lastState: {board: board1, delta: delta1},
        currentState: {board: board2, delta: delta2},
        lastVisibleTo: {},
        currentVisibleTo: {},
    };

{set: {key: 'board', value: currentBoard}},
{set: {key: 'fromDelta', value: {fromDelta: fromDelta}}},
{set: {key: 'toDelta', value: {toDelta: toDelta}}},
{set: {key: 'dice', value: {dice: dice}}}];

});