// This is in draft. Needs to be completed.

const {FIOSDK } = require('@fioprotocol/fiosdk')
fetch = require('node-fetch')

const fetchJson = async (uri, opts = {}) => {
  return fetch(uri, opts)
}

const baseUrl = ''

let privateKey = '',
  publicKey = '',
  amount = 50000000000,
  obtId = '',
  fioAddress = ''


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
        obt_id: obtId,
        actor: ''
      }
    })
    console.log('Result: ', result)
  } catch (err) {
    console.log('Error: ', err)
  }
}

fioUnwrap();