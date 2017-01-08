/**
 * Extracts File Name from Given File Path
 * @param  {string} path
 * @return {string} fileName
 */

function extractFileNameFromPath(path) {
  const splittedPath = path.split('/');
  return splittedPath[splittedPath.length - 1];
}

module.exports = extractFileNameFromPath;
