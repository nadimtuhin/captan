const fs = require('fs');
const { join } = require('path');

const isDirectory = source => fs.lstatSync(source).isDirectory();
const getDirectories = source =>
  fs.readdirSync(source).map(name => join(source, name)).filter(isDirectory);

module.exports = {
  isDirectory,
  getDirectories
};
