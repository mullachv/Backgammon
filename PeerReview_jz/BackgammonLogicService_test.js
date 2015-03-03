/**
 * File: BackgammonLogicService_test.js
 * -------------------------------------------
 * By: Jingxin Zhu
 * On: 2015.03.02
 * -------------------------------------------
 */

describe("Backgammon", function() {
    var _gameLogic;

    beforeEach(module('myApp'));

    beforeEach(inject(function (backGammonLogicService) {
        _gameLogic = backGammonLogicService;
    }));

    function expectMoveOk(turnIndex, board, fromDelta, toDelta, dice) {
        expect(_gameLogic.isMoveOk({turnIndex:turnIndex,
            board: board,
            fromDelta: fromDelta,
            toDelta: toDelta,
            dice:dice})).toBe(true);
    }

    function expectIllegalMove(turnIndex, board, fromDelta, toDelta, dice) {
        expect(_gameLogic.isMoveOk({turnIndex:turnIndex,
            board: board,
            fromDelta: fromDelta,
            toDelta: toDelta,
            dice:dice})).toBe(false);
    }

    function expectError(turnIndexBeforeMove, board, fromDelta, toDelta, dice)  {
        expect(function(){_gameLogic.createMove(board,fromDelta,toDelta,dice,turnIndexBeforeMove)}).toThrow();
    }

    describe("[out of bound] accessing elements out of board's boundary", function(){

        it("[WRONG] wrong from position for player0" , function(){
            expectIllegalMove(0,'',[-1],[10],[3,5]);
        });

        it("[WRONG] wrong from position for player0" , function(){
            expectIllegalMove(0,'',[30],[10],[3,5]);
        });

    });

});
