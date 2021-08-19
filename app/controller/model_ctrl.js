const ResponseConstants=require('../constants/response_constants')
const common_util_ctrl=require("../controller/common_ctrl")
const associationlistmodel=require('../model/associationlistdata')
const authmodel=require('../model/authdata')
var tournamentlistmodel=require("../model/tournamentlistdata")

const getstaticdata=async (res)=>{
    try{
        var authdata=await authmodel.findOne()
        var associationlistdata= await associationlistmodel.findOne()
        var tournamentlistdata=await tournamentlistmodel.findOne()

        var result={
            authdata:authdata,
            associationlistdata:associationlistdata,
            tournamentlistdata:tournamentlistdata
        }
        return common_util_ctrl.prepareResponse(res, 200, ResponseConstants.ERROR, "static data retrievd successfully", result);
    }
    catch{
        return common_util_ctrl.prepareResponse(res, 500, ResponseConstants.ERROR, "Something Went Wrong", "ERROR");
    }
}


module.exports.getstaticdata=getstaticdata