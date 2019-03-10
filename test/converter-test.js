const assert = require('assert');
const converter = require('../src/converter');
const testUtils = require('./utils/test-utils');

describe('converter', () => {
  describe('convert', () => {
    it('should convert a valid puzzle to object for solving', () => {
      const defaultPuzzleString = testUtils.getDefaultPuzzle();
      const puzzleString = defaultPuzzleString.substr(0, 8) + '_' + defaultPuzzleString.substr(9);
      const puzzle = testUtils.convertStringToPuzzle(puzzleString);

      const clues = converter.convert(puzzle);

      assert.deepStrictEqual(clues.remaining[0][8], new Set([6]));
      assert.deepStrictEqual(clues.possible.rows[0], new Set([6]));
      assert.deepStrictEqual(clues.possible.columns[8], new Set([6]));
      assert.deepStrictEqual(clues.possible.grids[2], new Set([6]));
      assert.strictEqual(clues.count, 1);
      assert.strictEqual(clues.pseudoCount, 0);
    });
  });
});
