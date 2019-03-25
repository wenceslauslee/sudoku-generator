const chai = require('chai');
const assert = chai.assert;
const converter = require('../../src/converter');
const hiddenSubset = require('../../src/strategy/hidden-subset');
const testUtils = require('../utils/test-utils');

describe('hiddenSubset', () => {
  describe('solve', () => {
    it('should solve a valid puzzle with hidden subset (1 hidden in row)', () => {
      const puzzleString = '_28__7___' +
        '_16_83_7_' +
        '____2_851' +
        '13729____' +
        '___73____' +
        '____463_7' +
        '29__7____' +
        '___86_14_' +
        '___3__7__';
      const puzzle = testUtils.convertStringToPuzzle(puzzleString);
      const clues = converter.convert(puzzle);
      const operations = {
        hiddenSubset: [ 0 ],
        hiddenSubsetSet: [ new Set() ]
      };
      const trail = [];
      hiddenSubset.solve(puzzle, clues, operations, trail, 1);
      const expectedTrail = [ 'HS:1R2:6:3' ];

      assert.strictEqual(puzzle[2][3], 6);
      assert.isNotOk(clues.possible.rows[2].has(6));
      assert.isNotOk(clues.possible.columns[3].has(6));
      assert.isNotOk(clues.possible.grids[1].has(6));
      assert.isNull(clues.remaining[2][3]);
      assert.strictEqual(clues.count, 48);
      assert.strictEqual(clues.pseudoCount, 1);
      assert.strictEqual(operations.hiddenSubset[0], 1);
      assert.isOk(operations.hiddenSubsetSet[0].has(expectedTrail[0]));
      assert.deepStrictEqual(trail, expectedTrail);
    });

    it('should solve a valid puzzle with hidden subset (2 hidden in column)', () => {
      const puzzleString = '_49132___' +
        '_81479___' +
        '327685914' +
        '_96_518__' +
        '_75_28___' +
        '_38_46__5' +
        '853267___' +
        '712894563' +
        '964513___';
      const puzzle = testUtils.convertStringToPuzzle(puzzleString);
      const clues = converter.convert(puzzle);
      const operations = {
        hiddenSubset: [ 0, 0 ],
        hiddenSubsetSet: [ new Set(), new Set() ]
      };
      const trail = [];
      hiddenSubset.solve(puzzle, clues, operations, trail, 2);
      const expectedTrail = [ 'HS:2C8:19:46' ];

      assert.isNotOk(clues.remaining[4][8].has(6));
      assert.strictEqual(clues.count, 27);
      assert.strictEqual(clues.pseudoCount, 1);
      assert.strictEqual(operations.hiddenSubset[1], 1);
      assert.isOk(operations.hiddenSubsetSet[1].has(expectedTrail[0]));
      assert.deepStrictEqual(trail, expectedTrail);
    });

    it('should solve a valid puzzle with hidden subset (3 hidden in grid)', () => {
      const puzzleString = '28____473' +
        '534827196' +
        '_71_34_8_' +
        '3__5___4_' +
        '___34__6_' +
        '46_79_31_' +
        '_9_2_3654' +
        '__3__9821' +
        '____8_937';
      const puzzle = testUtils.convertStringToPuzzle(puzzleString);
      const clues = converter.convert(puzzle);
      const operations = {
        hiddenSubset: [ 0, 0, 0 ],
        hiddenSubsetSet: [ new Set(), new Set(), new Set() ]
      };
      const trail = [];
      hiddenSubset.solve(puzzle, clues, operations, trail, 3);
      const expectedTrail = [ 'HS:3G6:245:478' ];

      assert.isNotOk(clues.remaining[8][1].has(1));
      assert.isNotOk(clues.remaining[8][2].has(6));
      assert.strictEqual(clues.count, 35);
      assert.strictEqual(clues.pseudoCount, 1);
      assert.strictEqual(operations.hiddenSubset[2], 1);
      assert.isOk(operations.hiddenSubsetSet[2].has(expectedTrail[0]));
      assert.deepStrictEqual(trail, expectedTrail);
    });

    it('should solve a valid puzzle with hidden subset (4 hidden in grid)', () => {
      const puzzleString = '816573294' +
        '392______' +
        '4572_9__6' +
        '941___568' +
        '785496123' +
        '6238___4_' +
        '279_____1' +
        '138____7_' +
        '564____82';
      const puzzle = testUtils.convertStringToPuzzle(puzzleString);
      const clues = converter.convert(puzzle);
      const operations = {
        hiddenSubset: [ 0, 0, 0, 0 ],
        hiddenSubsetSet: [ new Set(), new Set(), new Set(), new Set() ]
      };
      const trail = [];
      hiddenSubset.solve(puzzle, clues, operations, trail, 4);
      const expectedTrail = [ 'HS:4G7:2458:1245' ];

      assert.isOk(testUtils.checkSetDoesNotExist(clues.remaining[6][4], new Set([ 3, 6 ])));
      assert.isNotOk(clues.remaining[7][4].has(6));
      assert.strictEqual(clues.count, 30);
      assert.strictEqual(clues.pseudoCount, 1);
      assert.strictEqual(operations.hiddenSubset[3], 1);
      assert.isOk(operations.hiddenSubsetSet[3].has(expectedTrail[0]));
      assert.deepStrictEqual(trail, expectedTrail);
    });
  });
});
