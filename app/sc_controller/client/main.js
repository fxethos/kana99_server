const payout = require('./payout')
const solanaWeb3 = require('@solana/web3.js');
const NETWORK = solanaWeb3.clusterApiUrl('devnet');
const knex_config = require("../../config/knex_config")
const common_util_ctrl = require("../../controller/common_ctrl")
const ResponseConstants = require("../../constants/response_constants")

/**
 * Connection to the network
 */



 const getaddressarray = async function (res, received) {
  let requiredArray = []
  let addressarray = []
  let userid = []
  let contest_value = 0
  try {

    knex_config.knex('contests').select("contest_value").where("contest_id", "=", received.contest_id).then(async (rows) => {

     // console.log(rows[0].contest_value)
      //requiredArray.push({"contest_value" : rows[0].contest_value})
     contest_value = rows[0].contest_value
     // console.log(contest_value)
      knex_config.knex('standings').select("*").orderBy('points_total', "desc").where("contest_id", "=", received.contest_id).then(async (rows) => {

       
          for (row of rows) {
              userid.push(row.user_id)
              requiredArray.push({ "userid": row.user_id, "points": row.points_total,"contest_value" : contest_value })
          }

         // console.log(requiredArray)


          knex_config.knex('users').select("wallet_address", "uuid").whereIn('uuid', userid).then(async (rows) => {

              for (row of rows) {
                  requiredArray.find(element2 => {
                      //console.log(element2.userid)
                      if (element2.userid == row.uuid) {
                          addressarray.push({ 'wallet_address': row.wallet_address, 'points': element2.points, 'uuid': element2.userid,"contest_value" : element2.contest_value })
                      }
                  })

              }
              addressarray.sort((a,b) => parseFloat(b.points)-parseFloat(a.points));
              //console.log(addressarray)
              
              console.log("connect to solana account...");
    
  
              // Establish connection to the cluster
              await payout.establishConnection();
            
              // Determine who pays for the fees
              await payout.establishPayer();
            
              // Check if the program has been deployed
              await payout.checkProgram();
            
              // send payouts to an account
            //   await payout.sendPayouts(addressarray);
            
              //console.log(addressarray)

          }).catch((err) => { console.log(err); throw err })

         }).catch((err) => { console.log(err); throw err })


          // }) 

          return common_util_ctrl.prepareResponse(res, 200, ResponseConstants.SUCCESS, 'array retrived successfully ');
      }).catch((err) => {
          return common_util_ctrl.prepareResponse(res, 500, ResponseConstants.ERROR, 'Something went wrong ', err);
      })
  } catch (e) {
      console.log(e);
      return common_util_ctrl.prepareResponse(res, 500, ResponseConstants.ERROR, e.message, e.message);
  }
}
  
  // const main = async (req,res) => {
  //   console.log("connect to solana account...");
    
  
  //   // Establish connection to the cluster
  //   await payout.establishConnection();
  
  //   // Determine who pays for the fees
  //   await payout.establishPayer();
  
  //   // Check if the program has been deployed
  //   await payout.checkProgram();
  
  //   // send payouts to an account
  //   await payout.getaddressarray();
  
  
  //   //console.log('Success');
  // }
  

  
  
const makepayouts = async (req,res)=>{
  await main().then(
   res.send("payouts made")
  );

  }

module.exports = {makepayouts,getaddressarray}