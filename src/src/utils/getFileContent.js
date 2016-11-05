import config from '../constants/config';
import Uint8ToString from './Uint8ToString';

async function getFileContent(name) {
  const encodedName = encodeURIComponent(name);

  const requestOptions = {
    method: 'GET',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type,x-requested-with,Authorization,Access-Control-Allow-Origin',
      'Access-Control-Allow-Credentials': 'true',
      'Content-Type': 'application/json'
    },
    mode: 'cors'
  };

  try {
    const response = await fetch(`${config.serverURL}/content/${encodedName}`, requestOptions);
    const readedResult = await response.body.getReader().read();
    const u8 = new Uint8Array(readedResult.value);
    return Uint8ToString(u8);
  } catch (e) {
    console.error('Error occured on getFileContent:', e);
  }
}

export default getFileContent;