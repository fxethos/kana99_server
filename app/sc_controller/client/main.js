const payout = require('./payout')
const solanaWeb3 = require('@solana/web3.js');
const NETWORK = solanaWeb3.clusterApiUrl('devnet');

/**
 * Connection to the network
 */




  
  const main = async () => {
    console.log("connect to solana account...");
    
  
    // Establish connection to the cluster
    await payout.establishConnection();
  
    // Determine who pays for the fees
    await payout.establishPayer();
  
    // Check if the program has been deployed
    await payout.checkProgram();
  
    // send payouts to an account
    await payout.sendPayouts();
  
  
    console.log('Success');
  }
  

  
  
const makepayouts = async ()=>{
  await main().then(
   
  );

  }

module.exports = {makepayouts}