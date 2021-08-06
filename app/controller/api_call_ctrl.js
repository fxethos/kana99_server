const common_util_ctrl=require('../controller/common_ctrl')
const getparams=require('../constants/params')

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
        eventName:"association/c__board__bcci__b13f0/featured-tournaments",
        rs_token:rs_token
    }
    return common_util_ctrl.makeGEtRequest(params);
}

const tournament_fixtures = async (rs_token) => {
    params={
        type:"cricket",
        eventName:"tournament/tnplt20_2021/fixtures",
        rs_token:rs_token
    }
    return common_util_ctrl.makeGEtRequest(params);
}
const fantasy_match_credits = async (rs_token) => {
    params={
        type:"cricket",
        eventName:"fantasy-match-credits/tnplt20_2021_g1",
        rs_token:rs_token
    }
    return common_util_ctrl.makeGEtRequest(params);
}

module.exports.fantasy_match_credits=fantasy_match_credits
module.exports.tournament_fixtures=tournament_fixtures
module.exports.association_cboard=association_cboard
module.exports.association_list=association_list
module.exports.api_auth=api_auth