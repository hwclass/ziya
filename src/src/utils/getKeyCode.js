/**
 * getKeyCode() : The method to retrieve key char from keyboard event
 *
 * @param {object} event
*/
const getKeyCode = (event) => {
  return String.fromCharCode(event.which).toLowerCase();
};

export default getKeyCode;
