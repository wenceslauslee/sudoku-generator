const AWS = require('aws-sdk');
const moment = require('moment-timezone');

AWS.config.update({
  region: 'us-east-1'
});

const docClient = new AWS.DynamoDB.DocumentClient();
const puzzleDataTable = 'sudoku-puzzle-data';
const puzzleTableMap = {
  'simple': 'sudoku-puzzle-simple',
  'easy': 'sudoku-puzzle-easy',
  'medium': 'sudoku-puzzle-medium'
};

function getCount(difficulty) {
  const params = {
    TableName: puzzleDataTable,
    ProjectionExpression: 'puzzleCount',
    KeyConditionExpression: 'difficulty = :d',
    ExpressionAttributeValues: {
      ':d': difficulty
    }
  };

  return docClient.query(params).promise()
    .then(data => {
      if (data.Items.length === 0) {
        return 0;
      }
      return data.Items[0].puzzleCount;
    })
    .catch(err => {
      console.log(err);
      throw err;
    });
}

function createPuzzles(difficulty, originalCount, puzzleStrings) {
  const items = [];

  for (var i = 0; i < puzzleStrings.length; i++) {
    items.push({
      'PutRequest': {
        'Item': {
          'id': originalCount + i + 1,
          'puzzleString': puzzleStrings[i],
          'useCount': 0
        }
      }
    });
  }

  const requestItems = {};
  const tableName = puzzleTableMap[difficulty];
  requestItems[tableName] = items;
  const params = {
    'RequestItems': requestItems
  };

  return docClient.batchWrite(params).promise()
    .then(() => {
      console.log('DB create puzzles successful');
    })
    .catch(err => {
      console.log(err);
      throw err;
    });
}

function updatePuzzleData(difficulty, puzzleCount) {
  const params = {
    TableName: puzzleDataTable,
    Key: {
      'difficulty': difficulty
    },
    UpdateExpression: 'set puzzleCount = puzzleCount + :p, updatedTimestamp = :u',
    ExpressionAttributeValues: {
      ':p': puzzleCount,
      ':u': moment().utc().format()
    },
    ReturnValues: 'UPDATED_NEW'
  };

  return docClient.update(params).promise()
    .then(() => {
      console.log('DB puzzle data update successful');
    })
    .catch(err => {
      console.log(err);
      throw err;
    });
}

module.exports = {
  getCount: getCount,
  createPuzzles: createPuzzles,
  updatePuzzleData: updatePuzzleData
};
