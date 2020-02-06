'format cjs';

const engine = require('./engine');
const conventionalCommitTypes = require('./commons/types');
const options = {
  types: conventionalCommitTypes.types
};
module.exports = engine(options);
