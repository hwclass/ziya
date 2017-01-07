import config from '../constants/config';

async function saveFile(name, content) {
  const requestOptions = {
    method: 'POST',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type,x-requested-with,Authorization,Access-Control-Allow-Origin',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
      'Content-Type': 'application/json'
    },
    mode: 'cors',
    body: JSON.stringify({
      name,
      content
    }),
  };

  try {
    const response = await fetch(`${config.serverURL}/content/`, requestOptions);
    const readedResult = await response.json();
    return readedResult;
  } catch (e) {
    console.error('Error occured on saveFile:', e);
  }
}

export default saveFile;
