const common_util_ctrl=require('../controller/common_ctrl')
const getparams=require('../constants/params')
const moment=require('moment')

const knex_config=require("../config/knex_config")
const api_util_ctrl=require("../controller/api_util_ctrl")

var rs_token=''

const api_auth = async (api_key) => {
    params={
        type:"core",
        eventName:"auth",
        api_key:api_key
    }
    return common_util_ctrl.makePostRequest(params);
}

const association_list = async (rs_token) => {
    params={
        type:"cricket",
        eventName:"association/list",
        rs_token:rs_token
    }
    return common_util_ctrl.makeGEtRequest(params);
}


const association_cboard = async (rs_token) => {
    params={
        type:"cricket",
        eventName:`association/${rs_token.page_key}/featured-tournaments`,
        rs_token:rs_token.rs_token
    }
    return common_util_ctrl.makeGEtRequest(params);
}

const tournament_fixtures = async (rs_token) => {
    params={
        type:"cricket",
        eventName:`tournament/${rs_token.page_key}/fixtures`,
        rs_token:rs_token.rs_token
    }
    return common_util_ctrl.makeGEtRequest(params);
}
const fantasy_match_credits = async (rs_token) => {
    params={
        type:"cricket",
        eventName:`fantasy-match-credits/${rs_token.page_key}`,
        rs_token:rs_token.rs_token
    }
    return common_util_ctrl.makeGEtRequest(params);
}


const callstaticdata=async ()=>{
    params={
        type:"core",
        eventName:"auth",
        api_key:getparams.api_key
    }
    
    var findauthdata=await api_util_ctrl.getapitoken()
    console.log(findauthdata)
    if(findauthdata.length==0){
        data=await common_util_ctrl.makePostRequest(params);
        var api_response = await data.json();
        rs_token=api_response.data.token
        var savedata={
            rs_token:rs_token,
            expires:api_response.data.expires
        }
        await api_util_ctrl.saveapitoken(savedata)
    }else{
        if(moment.unix(findauthdata.expires).toDate()<moment().toDate()){
            data=await common_util_ctrl.makePostRequest(params);
            var api_response = await data.json();
            rs_token=api_response.data.token
            var savedata={
                rs_token:rs_token,
                expires:api_response.data.expires
            }
            await api_util_ctrl.updateapitoken(savedata)
        }else{
            rs_token=findauthdata[0].rs_token
        }
    }
    findassociationlistdata=await api_util_ctrl.getapiassociationlist()
    if(findassociationlistdata.length==0){
        var associationlistdata=await association_list(rs_token)
        associationlistdata = await associationlistdata.json();
        var association=associationlistdata.data.associations

        await api_util_ctrl.savemultiassociationlist(association)
        
    }
    findtounamentlist=await api_util_ctrl.gettournamentlist()
    if(findtounamentlist.length==0){
        senddata={
            rs_token:rs_token,
            page_key:"c__board__bcci__b13f0"
        }
        var associationlistdata=await association_cboard(senddata)
        associationlistdata = await associationlistdata.json();
        await api_util_ctrl.savemultiTounamentlist(associationlistdata.data.tournaments)
        senddata={
            rs_token:rs_token,
            page_key:"c__board__icc__c2ab7ee61"
        }
        var associationlistdata=await association_cboard(senddata)
        associationlistdata = await associationlistdata.json();
        await api_util_ctrl.savemultiTounamentlist(associationlistdata.data.tournaments)
        console.log("done 1")
    }
    var findmatchlist=await api_util_ctrl.getmatchlist()
    if(findmatchlist.length==0){
        tournamentlist=await api_util_ctrl.gettournamentlist()
        await api_util_ctrl.loadmatchlist(tournamentlist,rs_token)
        console.log("done 2")

    }
    var findmatchcredits= await api_util_ctrl.getmatchcreditlist()
    if(findmatchcredits.length==0){
        var findmatchlist=await api_util_ctrl.getmatchlist()
        await api_util_ctrl.loadmatchcredit(findmatchlist,rs_token)
        console.log("done 3")
    }
}

const callingcronjob=async()=>{
    params={
        type:"core",
        eventName:"auth",
        api_key:getparams.api_key
    }
    data=await common_util_ctrl.makePostRequest(params);
    var api_response = await data.json();
    rs_token=api_response.data.token
    var savedata={
        rs_token:rs_token,
        expires:api_response.data.expires
    }
    await api_util_ctrl.updateapitoken(savedata)

}
//     var findauthdata=await authdata.findOne({})
//     if(!findauthdata){
//         data=await common_util_ctrl.makePostRequest(params);
//         var api_response = await data.json();
//         rs_token=api_response.data.token
//         var savedata=new authdata({
//             rs_token:rs_token,
//             timestamp:api_response.data.expires
//         })
//         savedata.save()
//     }else{
//         console.log(findauthdata)
//         if(moment.unix(findauthdata.timestamp).toDate()<moment().toDate()){
//             data=await common_util_ctrl.makePostRequest(params);
//             var api_response = await data.json();
//             rs_token=api_response.data.token
//             var savedata=new authdata({
//                 rs_token:rs_token,
//                 timestamp:api_response.data.expires
//             })
//             authdata.findByIdAndUpdate({_id:findauthdata._id},{$set:savedata})
//         }else{
//             rs_token=findauthdata.rs_token
//         }
//     }
//     console.log(rs_token)
//     findassociationlistdata=await associationlistmodel.findOne()
//     console.log(findassociationlistdata)
//     if(!findassociationlistdata){
//         var associationlistdata=await association_list(rs_token)
//         associationlistdata = await associationlistdata.json();
//         res=[]
//         res.push(associationlistdata.data)
//         console.log(res)
//         savedata=new associationlistmodel({
//             data:res,
//             timestamp:new Date().getTime()
//         })
//         await savedata.save()
//     }
    
// }

module.exports.fantasy_match_credits=fantasy_match_credits
module.exports.tournament_fixtures=tournament_fixtures
module.exports.association_cboard=association_cboard
module.exports.association_list=association_list
module.exports.api_auth=api_auth
module.exports.callstaticdata=callstaticdata
module.exports.callingcronjob=callingcronjob
//module.exports.callstaticdata=callstaticdata
