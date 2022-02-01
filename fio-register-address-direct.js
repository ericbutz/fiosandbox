const {FIOSDK } = require('@fioprotocol/fiosdk')
fetch = require('node-fetch')

const fetchJson = async (uri, opts = {}) => {
  return fetch(uri, opts)
}

const baseUrl = 'https://testnet.fioprotocol.io/v1/'
//const baseUrl = 'https://fio.greymass.com/v1/'

let privateKey = '',
  publicKey = '',
  newAddress = '',
  maxFee = 100000000000


const fioRegAddress = async () => {

  user = new FIOSDK(
    privateKey,
    publicKey,
    baseUrl,
    fetchJson
  )

  try {
    //const result = await user.genericAction('registerFioAddress', {
    //  fioAddress: newAddress,
    //  maxFee: maxFee,
    //  technologyProviderId: ''
    //})
    const result = await user.registerOwnerFioAddress(newAddress, publicKey, maxFee);

    console.log('Result: ', result)
  } catch (err) {
    console.log('Error: ', err.json)
  }
}

fioRegAddress();