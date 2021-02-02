const {FIOSDK } = require('@fioprotocol/fiosdk')
fetch = require('node-fetch')

const fetchJson = async (uri, opts = {}) => {
  return fetch(uri, opts)
}

const baseUrl = 'https://testnet.fioprotocol.io:443/v1/'
//const baseUrl = 'https://fio.greymass.com/v1/'

let privateKey = '',
  publicKey = '',
  fioAddress = '',
  chainCode = '',
  tokenCode = '',
  publicAddress = '',
  maxFee = 100000000000


const fioAddAddress = async () => {

  user = new FIOSDK(
    privateKey,
    publicKey,
    baseUrl,
    fetchJson
  )

  try {
    const result = await user.genericAction('addPublicAddresses', {
      fioAddress: fioAddress,
      publicAddresses: [
        {
          chain_code: chainCode,
          token_code: tokenCode,
          public_address: publicAddress,
        }
      ],
      maxFee: maxFee,
      technologyProviderId: ''
    })
    console.log('Result: ', result)
  } catch (err) {
    console.log('Error: ', err)
  }
}

fioAddAddress();