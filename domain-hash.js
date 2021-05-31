const fetch = require('node-fetch')

const fetchJson = async (uri, opts = {}) => {
  return fetch(uri, opts)
}

//const httpEndpoint = 'https://testnet.fioprotocol.io:443'
const httpEndpoint = 'https://fio.greymass.com'

/**
 *  https://nodejs.org/api/crypto.html
 *  hash.update - Updates the hash content with the given data. 
 *      If encoding is not provided, and the data is a string, an encoding of 'utf8' is enforced. If data is a Buffer, TypedArray, or DataView, then inputEncoding is ignored.
 *  .digest() - Calculates the digest of all of the data passed to be hashed (using the hash.update() method). 
 *      If encoding is provided a string will be returned; otherwise a Buffer is returned.
 *  slice(0,16) - takes the first 16 characters
 *  .reverse() - 
 */
function nameHash(name) {
  const hash = require('crypto').createHash('sha1')
  one = hash.update(name)
  console.log('hash.update(name): ', one)
  two = one.digest();  // Returns a buffer
  console.log('.digest(): ', two)
  three = two.slice(0, 16)
  console.log('.slice(0, 16): ', three)
  four = three.reverse()
  console.log('.reverse(): ', four)
  five = four.toString("hex")
  console.log('.toString("hex"): ', five)
  
  return '0x' + five;
  //return '0x' + hash.update(name).digest().slice(0, 16).reverse().toString("hex")
}

const name = 'ericbutz@guarda';
hashedName = nameHash(name)
console.log('Hash of ' + name + ': ' + hashedName)

const json = {
  code: "fio.address",
  scope: "fio.address",
  table: "fionames",
  lower_bound: hashedName,
  upper_bound: hashedName,
  key_type: "i128",
  index_position: "5",
  json: true
}

const lookupDomain = async () => {

  pushResult = await fetch(httpEndpoint + '/v1/chain/get_table_rows', {
      body: JSON.stringify(json),
      method: 'POST',
  });

  result = await pushResult.json()

  console.log('pushResult: ', result.rows[0])
};

lookupDomain();