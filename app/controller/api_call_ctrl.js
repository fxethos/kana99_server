const common_util_ctrl=require('../controller/common_ctrl')
const getparams=require('../constants/params')
const moment=require('moment')

var authdata=require('../model/authdata')
var associationlistmodel=require('../model/associationlistdata')
var tournamentlistmodel=require("../model/tournamentlistdata")

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
    
    var findauthdata=await authdata.findOne({})
    if(!findauthdata){
        data=await common_util_ctrl.makePostRequest(params);
        var api_response = await data.json();
        rs_token=api_response.data.token
        var savedata=new authdata({
            rs_token:rs_token,
            timestamp:api_response.data.expires
        })
        savedata.save()
    }else{
        console.log(findauthdata)
        if(moment.unix(findauthdata.timestamp).toDate()<moment().toDate()){
            data=await common_util_ctrl.makePostRequest(params);
            var api_response = await data.json();
            rs_token=api_response.data.token
            var savedata={
                rs_token:rs_token,
                timestamp:api_response.data.expires
            }
            authdata.findByIdAndUpdate({_id:findauthdata._id},{$set:savedata})
        }else{
            rs_token=findauthdata.rs_token
        }
    }
    console.log(rs_token)
    findassociationlistdata=await associationlistmodel.findOne()
    console.log(findassociationlistdata)
    if(!findassociationlistdata){
        var associationlistdata=await association_list(rs_token)
        associationlistdata = await associationlistdata.json();
        res=[]
        res.push(associationlistdata.data)
        console.log(res)
        savedata=new associationlistmodel({
            data:res,
            timestamp:new Date().getTime()
        })
        await savedata.save()
    }
    findtounamentlist=await tournamentlistmodel.findOne()
    if(!findtounamentlist){
        senddata={
            rs_token:rs_token,
            page_key:"c__board__bcci__b13f0"
        }
        var associationlistdata=await association_cboard(rs_token)
        associationlistdata = await associationlistdata.json();
        res=[]
        res.push(associationlistdata.data)
        senddata={
            rs_token:rs_token,
            page_key:"c__board__icc__c2ab7ee61"
        }
        var associationlistdata=await association_cboard(rs_token)
        associationlistdata = await associationlistdata.json();
        res.push(associationlistdata.data)
        console.log(res)
        savedata=new tournamentlistmodel({
            data:res,
            timestamp:new Date().getTime()
        })
        await savedata.save()
    }
    
}
const callingcronjob=async()=>{
    params={
        type:"core",
        eventName:"auth",
        api_key:getparams.api_key
    }
    var findauthdata=await authdata.findOne({})
    data=await common_util_ctrl.makePostRequest(params);
    var api_response = await data.json();
    rs_token=api_response.data.token
    var savedata={
        rs_token:rs_token,
        timestamp:api_response.data.expires
    }
    authdata.findByIdAndUpdate({_id:findauthdata._id},{$set:savedata})
    
}

module.exports.fantasy_match_credits=fantasy_match_credits
module.exports.tournament_fixtures=tournament_fixtures
module.exports.association_cboard=association_cboard
module.exports.association_list=association_list
module.exports.api_auth=api_auth
module.exports.callstaticdata=callstaticdata
module.exports.callingcronjob=callingcronjob