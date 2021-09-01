const ResponseConstants=require('../constants/response_constants')
const common_util_ctrl=require("../controller/common_ctrl")
const api_util_ctrl=require("../controller/api_util_ctrl")
const knex_config=require("../config/knex_config")
const e = require('express')

const getstaticdata=async (res)=>{
    try{
        var authdata=await api_util_ctrl.getapitoken()
        var associationlistdata= await api_util_ctrl.getapiassociationlist()
        var tournamentlistdata=await api_util_ctrl.gettournamentlist()
        var matcheslist=await api_util_ctrl.getmatchlist()

        var result={
            authdata:authdata,
            associationlistdata:associationlistdata,
            tournamentlistdata:tournamentlistdata,
            matcheslist:matcheslist
        }
        return common_util_ctrl.prepareResponse(res, 200, ResponseConstants.SUCCESS, "static data retrievd successfully", result);
    }
    catch{
        return common_util_ctrl.prepareResponse(res, 500, ResponseConstants.ERROR, "Something Went Wrong", "ERROR");
    }
}

const getDBfantasy_match_credits=async (res,received)=>{
    try{
        var result=await api_util_ctrl.getDBfantasy_match_credits(received)
        const objectArray = Object.entries(result[0]['players']);
        allplayers=[]
        await objectArray.forEach(([key, value]) => {
            allplayers.push(value)
        });
        result[0].players=allplayers
        var all_rounder=[],bowler=[],batsman=[],keeper=[],others=[]
        allplayers=[]
        await result[0].players.forEach(element => {
            var found = result[0].credits.find(element1 =>  element1.player_key ===element.key);
            element.credit=found.value
            element.performance=found.performance
            if(element.seasonal_role==="all_rounder"){
                all_rounder.push(element)
            } if(element.seasonal_role==="bowler"){
                bowler.push(element)
            } if(element.seasonal_role==="batsman"){
                batsman.push(element)
            } if(element.seasonal_role==="keeper"){
                keeper.push(element)
            }
        });
        
        result[0].players=[{
            all_rounder:all_rounder,
            batsman:batsman,
            keeper:keeper,
            bowler:bowler,
            others:others
        }]
        
        return common_util_ctrl.prepareResponse(res, 200, ResponseConstants.SUCCESS, "static data retrievd successfully", result);
    }
    catch(e){
        console.log(e)
        return common_util_ctrl.prepareResponse(res, 500, ResponseConstants.ERROR, "Something Went Wrong", e);
    }
}

const upcommingmatches=async (res)=>{
    try{
        var result=await api_util_ctrl.upcommingmatches()
        var upcommingmatch=[]
        var i=0
        if(result.length>0){
            await result.forEach((element,i)=>{
                i=i+1
                res1=((Object.values(element['players'])))
                var j=0
                var team='',up=false
                if(res1.length>0){
                    res1.forEach((ele,j)=>{
                        j=j+1
                        if(j==1){
                            team=ele.team_key
                        }
                        if(j>1){
                            console.log(j)
                            console.log(ele.team_key)
                            if(ele.team_key!=team){
                                up=true
                            }
                            if(j==res1.length){
                                if(up){
                                    upcommingmatch.push(element)
                                }
                                if(i==result.length){
                                    console.log(i,result.length)
                                    return common_util_ctrl.prepareResponse(res, 200, ResponseConstants.SUCCESS, "upcoming match retrievd successfully", upcommingmatch);
                                }
                            }
                        }
                    })
                }else{
                    if(i==result.length){
                        console.log(i,result.length)
                        return common_util_ctrl.prepareResponse(res, 200, ResponseConstants.SUCCESS, "upcoming match retrievd successfully", upcommingmatch);
                    }
                }
            })
        }else{
            return common_util_ctrl.prepareResponse(res, 200, ResponseConstants.SUCCESS, "upcoming match retrievd successfully", upcommingmatch);
        }
            
    }
    catch(e){
        console.log(e)
        return common_util_ctrl.prepareResponse(res, 500, ResponseConstants.ERROR, "Something Went Wrong", e);
    }
}

const postcontest=async (res,received)=>{
    try{
        console.log(received)
        result=await knex_config.knex('contests').insert({
            contest_id: received.contest_id,
            match_id: received.match_id,
            contest_name	:received.contest_name,
            contest_value	:received.contest_value,
            max_contest_size	:received.max_contest_size,
            entry_fee:received.entry_fee
        })
        return common_util_ctrl.prepareResponse(res, 200, ResponseConstants.SUCCESS, "contest added successfully", result);
    }
    catch(e){
        console.log(e)
        return common_util_ctrl.prepareResponse(res, 500, ResponseConstants.ERROR, "Something Went Wrong", e);
    }
}

const getcontest=async (res,received)=>{
    try{
        console.log(received)
        result=await knex_config.knex('contests').select("*").where("match_id","=",received.match_id)
        return common_util_ctrl.prepareResponse(res, 200, ResponseConstants.SUCCESS, "contest data retrieved successfully", result);
    }
    catch(e){
        console.log(e)
        return common_util_ctrl.prepareResponse(res, 500, ResponseConstants.ERROR, "Something Went Wrong", "ERROR");
    }
}
module.exports.upcommingmatches=upcommingmatches
module.exports.getstaticdata=getstaticdata
module.exports.getDBfantasy_match_credits=getDBfantasy_match_credits
module.exports.postcontest=postcontest
module.exports.getcontest=getcontest