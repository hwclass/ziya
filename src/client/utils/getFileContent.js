import config from '../constants/config';
// import Uint8ToString from './Uint8ToString';

async function getFileContent(path) {
  const encodedPath = encodeURIComponent(path);

  const requestOptions = {
    method: 'GET',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type,x-requested-with,Authorization,Access-Control-Allow-Origin',
      'Access-Control-Allow-Credentials': 'true',
      'Content-Type': 'application/json; charset=utf-8',
      'Accept-Charset': 'iso-8859-5, unicode-1-1;q=0.8',
    },
    mode: 'cors',
  };

  try {
    const response = await fetch(`${config.serverURL}/files/${encodedPath}`, requestOptions);
    const readedResult = await response.body.getReader().read();
    const utf8Decoder = new TextDecoder('utf-8');
    return utf8Decoder.decode(new Uint8Array(readedResult.value));
  } catch (e) {
    /* eslint-disable */
    console.error('Error occured on getFileContent:', e);
    /* eslint-enable */
    return e;
  }
}

export default getFileContent;
