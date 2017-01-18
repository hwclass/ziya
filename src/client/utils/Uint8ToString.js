function Uint8ToString(u8a) {
  const CHUNK_SZ = 0x8000;
  const c = [];

  for (let i = 0; i < u8a.length; i += CHUNK_SZ) {
    c.push(String.fromCharCode.apply(null, u8a.subarray(i, i + CHUNK_SZ)));
  }

  return c.join('');
}

export default Uint8ToString;
