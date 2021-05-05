// This is in draft. Needs to be completed.

const {FIOSDK } = require('@fioprotocol/fiosdk')
fetch = require('node-fetch')

const fetchJson = async (uri, opts = {}) => {
  return fetch(uri, opts)
}

const baseUrl = 'http://44.242.158.42:8889/v1/'

let privateKey = '5KQ6f9ZgUtagD3LZ4wcMKhhvK9qy4BuwL3L1pkm6E2v62HCne2R',
  publicKey = 'FIO7jVQXMNLzSncm7kxwg9gk7XUBYQeJPk8b6QfaK5NVNkh3QZrRr',
  amount = 50000000000,
  obtId = '0x64f3350e4516a2c8509849b36ab680f7ad40811c1923d8979c4292f6883919d2',
  fioAddress = 'bp1@Dapixdev'


const fioUnwrap = async () => {

  user = new FIOSDK(
    privateKey,
    publicKey,
    baseUrl,
    fetchJson
  )

  try {
    const result = await user.genericAction('pushTransaction', {
      action: 'unwraptokens',
      account: 'fio.oracle',
      data: {
        fio_address: fioAddress,
        amount: amount,
        obt_id: '0x64f3350e4516a2c8509849b36ab680f7ad40811c1923d8979c4292f6883919d2',
        actor: "qbxn5zhw2ypw"
      }
    })
    console.log('Result: ', result)
  } catch (err) {
    console.log('Error: ', err)
  }
}

fioUnwrap();