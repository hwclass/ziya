import config from '../constants/config';

async function getDirectoryContent(path = 'root') {
  const encodedPath = encodeURIComponent(path);

  const requestOptions = {
    method: 'GET',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, x-requested-with, Authorization, Access-Control-Allow-Origin',
      'Access-Control-Allow-Credentials': 'true',
      'Content-Type': 'application/json',
    },
    mode: 'cors',
  };

  try {
    const response = await fetch(`${config.serverURL}/files/${encodedPath}`, requestOptions);
    const json = await response.json();
    return json;
  } catch (e) {
    console.error('Error occured on getFileContent:', e);
    return e;
  }
}

export default getDirectoryContent;
