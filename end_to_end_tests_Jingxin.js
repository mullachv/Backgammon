/**
 * File: end_to_end_tests_Jingxin.js
 * ----------------------------------
 * @date: 2015.03.27
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


    describe("[ok]", function(){
        it('should have a title', function (){
            expect(browser.getTitle()).toEqual('Backgammon');
        });

        it('should have the inital board', function () {
            expectBoard(board2);
        });

        it('after rolling a 1 and a 2 white can move 3 spaces', function(){
            setMatchState(matchState1, 'passAndPlay');
            clickPiece(2,0,'W');

            getSpace(5).click();

            expectPiece(5,0,'W');

        });

        it('after rolling a 2 and a 1 white can move 3 spaces', function(){
            setMatchState(matchState1, 'passAndPlay');
            clickPiece(2,0,'W');

            getSpace(5).click();

            expectPiece(5,0,'W');

        });

        it('after rolling a  4 and a 2 move two white pieces', function(){
            setMatchState(matchState2, 'passAndPlay');
            clickPiece(2,0,'W');

            getSpace(6).click();

            expectPiece(6,0,'W');

        });

        it('after rolling a  4 and a 2 move two white pieces', function(){
            setMatchState(matchState2, 'passAndPlay');
            clickPiece(6,0,'W');

            getSpace(12).click();

            expectPiece(12,0,'W');

        });

        it("double dice bonus for two same dices", function(){
            // two dice 2 in state3, can move 8 in total
            setMatchState(matchState3, 'passAndPlay');

            clickPiece(2,0,'W');

            getSpace(10).click();

            expectPiece(10,0,'W');

        });

        it("double dice bonus for two same dices, two dices move separately", function(){
            // two dice 2 in state3, can move 8 in total
            setMatchState(matchState3, 'passAndPlay');

            clickPiece(6,0,'W');

            getSpace(10).click();

            expectPiece(10,0,'W');

            clickPiece(2, 0, 'W');

            getSpace(6).click();

            expectPiece(6,0,'W');
        });

        it("cannot move to black part", function(){
            // dice: 5, dice : 2
            setMatchState(matchState4, 'passAndPlay');

            clickPiece(2,0,'W');

            getSpace(7).click();

            // still stays there
            expectPiece(2,0,'W');

            clickPiece(2,0,'W');

            expectPiece(2,0,'W');
        });

        it("cannot move to black part", function(){
            // dice: 5, dice : 2
            setMatchState(matchState4, 'passAndPlay');

            clickPiece(2,0,'W');

            getSpace(4).click();

            expectPiece(4,0,'W');

            clickPiece(4, 0, 'W');
            getSpace(9).click();
            expectPiece(4,0,'W');

        });

    });

    xdescribe("[under test]", function(){

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

    function clone(obj) {
        if (null == obj || "object" != typeof obj) return obj;
        var copy = obj.constructor();
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
        }
        return copy;
    }

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

    var matchState2 = {
        turnIndexBeforeMove: 0,
        turnIndex: 0,
        endMatchScores: null,
        lastMove: [{setTurn:{turnIndex:0}}, {set:{key:initalBoard}}, {set:{fromDelta:[]}}, {set:{toDelta:0}}],
        lastState: {},
        currentState: {board: initalBoard, dice1: 4,dice2:2,fromDelta:[],toDelta:[]},
        lastVisibleTo: {},
        currentVisibleTo: {}
    };

    var matchState3 = {
        turnIndexBeforeMove: 0,
        turnIndex: 0,
        endMatchScores: null,
        lastMove: [{setTurn:{turnIndex:0}}, {set:{key:initalBoard}}, {set:{fromDelta:[]}}, {set:{toDelta:0}}],
        lastState: {},
        currentState: {board: initalBoard, dice1: 2,dice2:2,fromDelta:[],toDelta:[]},
        lastVisibleTo: {},
        currentVisibleTo: {}
    };

    var matchState4= {
        turnIndexBeforeMove: 0,
        turnIndex: 0,
        endMatchScores: null,
        lastMove: [{setTurn:{turnIndex:0}}, {set:{key:initalBoard}}, {set:{fromDelta:[]}}, {set:{toDelta:0}}],
        lastState: {},
        currentState: {board: initalBoard, dice1: 5,dice2:2,fromDelta:[],toDelta:[]},
        lastVisibleTo: {},
        currentVisibleTo: {}
    };
});
