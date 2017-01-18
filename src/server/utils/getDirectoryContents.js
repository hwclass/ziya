/**
 * Returns contents of a read directory.
 * @param  {string} dirPath: path of parrent directory
 * @param  {array} items: contents of parrent directory, read by fs.readdir()
 * @return {array} [{ name, path, type}] of contents
 */

const path = require('path');
const fs = require('fs');

function getDirectoryContents(dirPath, items) {
  return items.map((item) => {
    const filePath = path.join(dirPath, item);
    const fileStat = fs.statSync(filePath);
    const fileType = (fileStat.isDirectory() && 'directory') ||
      (fileStat.isFile() && 'file') ||
      'unknown';

    return {
      name: item,
      path: filePath,
      type: fileType,
    };
  });
}

module.exports = getDirectoryContents;
