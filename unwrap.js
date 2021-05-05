const { Fio } = require('@fioprotocol/fiojs');
const { TextEncoder, TextDecoder } = require('text-encoding');
const fetch = require('node-fetch') 

const httpEndpoint = ''

let contract = 'fio.oracle',
  action = 'unwraptokens',
  oraclePrivateKey = '',
  oraclePublicKey = '',
  oracleAccount = '',
  amount = 30000000000,
  obtId = '',
  fioAddress = ''

const unwrapTokens = async () => {
  info = await (await fetch(httpEndpoint + '/v1/chain/get_info')).json();
  blockInfo = await (await fetch(httpEndpoint + '/v1/chain/get_block', { body: `{"block_num_or_id": ${info.last_irreversible_block_num}}`, method: 'POST' })).json()
  chainId = info.chain_id;
  currentDate = new Date();
  timePlusTen = currentDate.getTime() + 10000;
  timeInISOString = (new Date(timePlusTen)).toISOString();
  expiration = timeInISOString.substr(0, timeInISOString.length - 1);

  transaction = {
    expiration,
    ref_block_num: blockInfo.block_num & 0xffff,
    ref_block_prefix: blockInfo.ref_block_prefix,
    actions: [{
      account: contract,
      name: action,
      authorization: [{
        actor: oracleAccount,
        permission: 'active',
      }],
      data: {
        fio_address: fioAddress,
        amount: amount,
        obt_id: obtId,
        actor: oracleAccount
      },
    }]
  };

  abiMap = new Map()
  tokenRawAbi = await (await fetch(httpEndpoint + '/v1/chain/get_raw_abi', { body: `{"account_name": "fio.oracle"}`, method: 'POST' })).json()
  abiMap.set('fio.oracle', tokenRawAbi)

  var privateKeys = [oraclePrivateKey];

  const tx = await Fio.prepareTransaction({
    transaction,
    chainId,
    privateKeys,
    abiMap,
    textDecoder: new TextDecoder(),
    textEncoder: new TextEncoder()
  });

  pushResult = await fetch(httpEndpoint + '/v1/chain/push_transaction', {
    body: JSON.stringify(tx),
    method: 'POST',
  });

  json = await pushResult.json()

  if (json.type) {
    console.log('Error: ', json);
  } else if (json.error) {
    console.log('Error: ', json)
  } else {
    console.log('Result: ', json)
  }

};

unwrapTokens();