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
        eventName:`fantasy-match-credits/${rs_token}`,
        rs_token:rs_token.rs_token
    }
    return common_util_ctrl.makeGEtRequest(params);
}

module.exports.fantasy_match_credits=fantasy_match_credits
module.exports.tournament_fixtures=tournament_fixtures
module.exports.association_cboard=association_cboard
module.exports.association_list=association_list
module.exports.api_auth=api_auth