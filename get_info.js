fetch = require('node-fetch')

apiNodesTestnet = [
  "https://fiotestnet.blockpane.com",
  "https://fiotestnet.greymass.com",
  "https://testnet.fio.eosdetroit.io",
  "https://test.fio.eosusa.news",
  "https://api.fiotest.alohaeos.com",
  "https://api.fiotest.currencyhub.io",
  "https://testnet.fioprotocol.io",
  "https://api.testnet.fiosweden.org",
  "https://fio-test.eos.barcelona",
  "https://fio-testnet.eosblocksmith.io",
  "https://api.fio.alohaeos.com",
  "https://fio-bp.dmail.co:7777"
]

apiNodesMainnet = [
  "https://fio.blockpane.com",
  "https://fio.eu.eosamsterdam.net",
  "https://fio.eosdac.io",
  "https://api-fio.nodeone.network:8344",
  "https://fio.eosphere.io",
  "https://fio.eosrio.io",
  "https://fio.acherontrading.com",
  "https://fio.eos.barcelona",
  "https://api.fio.eosdetroit.io",
  "https://fio.zenblocks.io",
  "https://api.fio.alohaeos.com",
  "https://fio.greymass.com",
  "https://fio.genereos.io",
  "https://fio.eosusa.news",
  "https://fio.eosargentina.io",
  "https://fio.cryptolions.io",
  "https://fio-mainnet.eosblocksmith.io",
  "https://api.fio.currencyhub.io",
  "https://fio.eoscannon.io",
  "https://fio.eosdublin.io",
  "https://api.fiosweden.org",
  "https://api.fio.greeneosio.com",
  "https://fioapi.ledgerwise.io",
  "https://api.fio.services",
  "https://fio.eostribe.io",
  "https://fio-za.eostribe.io",
  "https://fio-bp.dmail.co"
]

const getInfo = async () => {

  for (node in apiNodesTestnet) {
    try {
      httpEndpoint = apiNodesTestnet[node];
      info = await (await fetch(httpEndpoint + '/v1/chain/get_info ', { method: 'POST' })).json()
      console.log('Server: ' + httpEndpoint + ', server_version_string: ' + info.server_version_string);
    } catch (err) {
      console.log('Error: ', err)
    }
  }
  
}

getInfo();