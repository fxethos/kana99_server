const ResponseConstants=require('../constants/response_constants')
const common_util_ctrl=require("../controller/common_ctrl")
const api_util_ctrl=require("../controller/api_util_ctrl")

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
        return common_util_ctrl.prepareResponse(res, 200, ResponseConstants.ERROR, "static data retrievd successfully", result);
    }
    catch{
        return common_util_ctrl.prepareResponse(res, 500, ResponseConstants.ERROR, "Something Went Wrong", "ERROR");
    }
}

const getDBfantasy_match_credits=async (res,received)=>{
    try{
        var result=await api_util_ctrl.getDBfantasy_match_credits(received)
        console.log(result)
        
        return common_util_ctrl.prepareResponse(res, 200, ResponseConstants.ERROR, "static data retrievd successfully", result);
    }
    catch{
        return common_util_ctrl.prepareResponse(res, 500, ResponseConstants.ERROR, "Something Went Wrong", "ERROR");
    }
}


module.exports.getstaticdata=getstaticdata
module.exports.getDBfantasy_match_credits=getDBfantasy_match_credits