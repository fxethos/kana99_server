const payout = require('./payout')
// import {
//     establishConnection,
//     establishPayer,
//     checkProgram,
//     sendPayouts,
//     //reportGreetings,
//     //reportGreetings,
//   } from './payout';
  
  module.exports.main = async function() {
    console.log("connect to solana account...");
  
    // Establish connection to the cluster
    await payout.establishConnection();
  
    // Determine who pays for the fees
    await payout.establishPayer();
  
    // Check if the program has been deployed
    await payout.checkProgram();
  
    // Say hello to an account
    await payout.sendPayouts();
  
    // Find out how many times that account has been greeted
    //await reportGreetings();
  
    console.log('Success');
  }
  
  // main().then(
  //   () => process.exit(),
  //   err => {
  //     console.error(err);
  //     process.exit(-1);
  //   },
  // );
  
