const chai = require('chai');
const assert = chai.assert;
const converter = require('../../src/converter');
const nakedSubset = require('../../src/strategy/naked-subset');
const testUtils = require('../utils/test-utils');

describe('nakedSubset', () => {
  describe('solve', () => {
    it('should solve a valid puzzle with naked subset (1 hidden in row)', () => {
      const puzzleString = '412736589' +
        '______1_6' +
        '568_1_37_' +
        '___85_21_' +
        '1_______8' +
        '_87_9____' +
        '_3__7_865' +
        '8________' +
        '___9_84_1';
      const puzzle = testUtils.convertStringToPuzzle(puzzleString);
      const clues = converter.convert(puzzle);
      const operations = {
        nakedSubset: [ 0 ],
        nakedSubsetSet: [ new Set() ]
      };
      const trail = [];
      nakedSubset.solve(puzzle, clues, operations, trail, 1);
      const expectedTrail = [ 'NS:1R5:6:6' ];

      assert.strictEqual(puzzle[5][6], 6);
      assert.isNotOk(clues.possible.rows[5].has(6));
      assert.isNotOk(clues.possible.columns[6].has(6));
      assert.isNotOk(clues.possible.grids[5].has(6));
      assert.isNull(clues.remaining[5][6]);
      assert.strictEqual(clues.count, 44);
      assert.strictEqual(clues.pseudoCount, 1);
      assert.strictEqual(operations.nakedSubset[0], 1);
      assert.isOk(operations.nakedSubsetSet[0].has(expectedTrail[0]));
      assert.deepStrictEqual(trail, expectedTrail);
    });

    it('should solve a valid puzzle with naked subset (2 hidden in row/column/grid)', () => {
      const puzzleString = '687__4523' +
        '953__2614' +
        '142356978' +
        '31___7246' +
        '76____3_5' +
        '_2____7_1' +
        '_96__1_32' +
        '23_____57' +
        '_7_____69';
      const puzzle = testUtils.convertStringToPuzzle(puzzleString);
      const clues = converter.convert(puzzle);
      const operations = {
        nakedSubset: [ 0, 0 ],
        nakedSubsetSet: [ new Set(), new Set() ]
      };
      const trail = [];
      nakedSubset.solve(puzzle, clues, operations, trail, 2);
      const expectedTrail = [ 'NS:2R4:57:89', 'NS:2C5:47:89', 'NS:2G4:15:89' ];

      assert.isOk(testUtils.checkSetDoesNotExist(clues.remaining[3][3], new Set([ 8, 9 ])));
      assert.isOk(testUtils.checkSetDoesNotExist(clues.remaining[4][3], new Set([ 8, 9 ])));
      assert.isOk(testUtils.checkSetDoesNotExist(clues.remaining[4][4], new Set([ 8, 9 ])));
      assert.isOk(testUtils.checkSetDoesNotExist(clues.remaining[5][3], new Set([ 8, 9 ])));
      assert.isOk(testUtils.checkSetDoesNotExist(clues.remaining[5][4], new Set([ 8, 9 ])));
      assert.isOk(testUtils.checkSetDoesNotExist(clues.remaining[5][5], new Set([ 8, 9 ])));
      assert.strictEqual(clues.count, 33);
      assert.strictEqual(clues.pseudoCount, 3);
      assert.strictEqual(operations.nakedSubset[1], 3);
      assert.isOk(operations.nakedSubsetSet[1].has(expectedTrail[0]));
      assert.isOk(operations.nakedSubsetSet[1].has(expectedTrail[1]));
      assert.isOk(operations.nakedSubsetSet[1].has(expectedTrail[2]));
      assert.deepStrictEqual(trail, expectedTrail);
    });

    it('should solve a valid puzzle with naked subset (3 hidden in column)', () => {
      const puzzleString = '___29438_' +
        '___17864_' +
        '48_3561__' +
        '__48375_1' +
        '___4157__' +
        '5__629834' +
        '953782416' +
        '126543978' +
        '_4_961253';
      const puzzle = testUtils.convertStringToPuzzle(puzzleString);
      const clues = converter.convert(puzzle);
      const operations = {
        nakedSubset: [ 0, 0, 0 ],
        nakedSubsetSet: [ new Set(), new Set(), new Set() ]
      };
      const trail = [];
      nakedSubset.solve(puzzle, clues, operations, trail, 3);
      const expectedTrail = [ 'NS:3C1:134:369' ];

      assert.isNotOk(clues.remaining[0][1].has(6));
      assert.strictEqual(clues.count, 23);
      assert.strictEqual(clues.pseudoCount, 1);
      assert.strictEqual(operations.nakedSubset[2], 1);
      assert.isOk(operations.nakedSubsetSet[2].has(expectedTrail[0]));
      assert.deepStrictEqual(trail, expectedTrail);
    });

    it('should solve a valid puzzle with naked subset (4 hidden in row)', () => {
      const puzzleString = '_1_72_563' +
        '_56_3_247' +
        '732546189' +
        '693287415' +
        '247615938' +
        '581394___' +
        '_____2___' +
        '________1' +
        '__587____';
      const puzzle = testUtils.convertStringToPuzzle(puzzleString);
      const clues = converter.convert(puzzle);
      const operations = {
        nakedSubset: [ 0, 0, 0, 0 ],
        nakedSubsetSet: [ new Set(), new Set(), new Set(), new Set() ]
      };
      const trail = [];
      nakedSubset.solve(puzzle, clues, operations, trail, 4);
      const expectedTrail = [ 'NS:4R7:0235:3489' ];

      assert.isOk(testUtils.checkSetDoesNotExist(clues.remaining[7][6], new Set([ 3, 8 ])));
      assert.isNotOk(clues.remaining[7][7].has(9));
      assert.strictEqual(clues.count, 31);
      assert.strictEqual(clues.pseudoCount, 1);
      assert.strictEqual(operations.nakedSubset[3], 1);
      assert.isOk(operations.nakedSubsetSet[3].has(expectedTrail[0]));
      assert.deepStrictEqual(trail, expectedTrail);
    });
  });
});
