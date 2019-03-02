function remove(puzzle, record) {
  var row = Math.floor(Math.random() * 9);
  var column = Math.floor(Math.random() * 9);
  var key = `${row}${column}`;

  while (record.set.has(key)) {
    row = Math.floor(Math.random() * 9);
    column = Math.floor(Math.random() * 9);
    key = `${row}${column}`;
  }

  record.set.add(key);
  record.list.push(key);
  record.answer.push(puzzle[row][column]);
  puzzle[row][column] = null;
}

function insert(puzzle, record) {
  const key = record.list.splice(0, record.list.length - 1);
  const answer = record.answer.splice(0, record.answer.length - 1);
  const rowString = key.substring(0, 1);
  const colString = key.substring(1);

  record.set.delete(key);
  puzzle[parseInt(rowString)][parseInt(colString)] = answer;
}

module.exports = {
  insert: insert,
  remove: remove
};
