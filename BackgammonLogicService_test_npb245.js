//Could not find any bugs in the code
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
  
  
  it("Using a dice which is invalid is illegal",function(){
  var a = [-1,3]
    expectError(0,'',[2],[5],a)
  });

  it("making a move white on an empty board is legal" , function(){
       expectMoveOk(0,'',[2],[5],[1,2])

  });

    it("making a move from a space you don't occupy is illegal" , function(){
        expectIllegalMove(1,'',[2],[5],[1,2])
 
    });

  

});