const chai = require('chai');
const assert = chai.assert;
const converter = require('../../src/converter');
const fullHouse = require('../../src/strategy/full-house');
const testUtils = require('../utils/test-utils');

describe('full-house', () => {
  describe('solve', () => {
    it('should solve a valid puzzle', () => {
      const puzzleString = '_52489376' +
        '7_9256841' +
        '46_371295' +
        '387_24659' +
        '5917_3428' +
        '246895713' +
        '914637582' +
        '625948137' +
        '873512964';
      const puzzle = testUtils.convertStringToPuzzle(puzzleString);
      const clues = converter.convert(puzzle);
      const operations = {
        fullHouse: 0
      };
      const trail = [];
      fullHouse.solve(puzzle, clues, operations, trail);
      const expectedTrail = [ 'FH:R00:1', 'FH:R11:3', 'FH:R22:8', 'FH:R33:1', 'FH:R44:6' ];

      assert.strictEqual(puzzle[0][0], 1);
      assert.strictEqual(puzzle[1][1], 3);
      assert.strictEqual(puzzle[2][2], 8);
      assert.strictEqual(puzzle[3][3], 1);
      assert.strictEqual(puzzle[4][4], 6);
      assert.strictEqual(clues.count, 0);
      assert.strictEqual(clues.pseudoCount, 5);
      assert.strictEqual(operations.fullHouse, 5);
      assert.deepStrictEqual(trail, expectedTrail);
    });
  });
});
