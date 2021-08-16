const getparams=require('../constants/params')
const common_util_ctrl = require('./common_ctrl');
const ResponseConstants = require('../constants/response_constants.js');
const dotenv = require('dotenv');
const fetch = require('node-fetch');
const api_call_ctrl=require("./api_call_ctrl")

dotenv.config();

const api_auth = async function (res, receivedData) {
    try {
        if (receivedData && receivedData.api_key) {
            const api_call_response = await api_call_ctrl.api_auth(receivedData.api_key);
            console.log("api Http status: " + api_call_response.http_status_code);
            const api_response = await api_call_response.json();
            console.log(api_response)
            if (api_response && api_response.http_status_code===200) {
                return common_util_ctrl.prepareResponse(res, api_response.http_status_code, ResponseConstants.SUCCESS, 'user authenticated successfully ', api_response.data);
            } else {
                return common_util_ctrl.prepareResponse(res, api_response.http_status_code, ResponseConstants.ERROR, 'Invalid Credentials ', api_response);
            }
        } else {
            return common_util_ctrl.prepareResponse(res, 400, ResponseConstants.ERROR, 'Invalid Credentials ', '');
        }
    } catch (e) {
        console.log(e);
        return common_util_ctrl.prepareResponse(res, 500, ResponseConstants.ERROR, e.message, e.message);
    }
}

const association_list = async function (res, receivedData) {
    try {
        if (receivedData && receivedData.rs_token) {
            const api_call_response = await api_call_ctrl.association_list(receivedData.rs_token);
            console.log("api Http status: " + api_call_response.http_status_code);
            const api_response = await api_call_response.json();
            console.log(api_response)
            if (api_response && api_response.http_status_code===200) {
                return common_util_ctrl.prepareResponse(res, api_response.http_status_code, ResponseConstants.SUCCESS, 'association list retrievd successfully ', api_response.data);
            } else {
                return common_util_ctrl.prepareResponse(res, api_response.http_status_code, ResponseConstants.ERROR, 'Invalid Credentials ', api_response);
            }
        } else {
            return common_util_ctrl.prepareResponse(res, 400, ResponseConstants.ERROR, 'Invalid Credentials ', '');
        }
    } catch (e) {
        console.log(e);
        return common_util_ctrl.prepareResponse(res, 500, ResponseConstants.ERROR, e.message, e.message);
    }
}

const association_cboard = async function (res, receivedData) {
    try {
        if (receivedData && receivedData.rs_token) {
            const api_call_response = await api_call_ctrl.association_cboard(receivedData);
            console.log("api Http status: " + api_call_response.http_status_code);
            const api_response = await api_call_response.json();
            console.log(api_response)
            if (api_response && api_response.http_status_code===200) {
                return common_util_ctrl.prepareResponse(res, api_response.http_status_code, ResponseConstants.SUCCESS, 'association c board retreived successfully ', api_response.data);
            } else {
                return common_util_ctrl.prepareResponse(res, api_response.http_status_code, ResponseConstants.ERROR, 'Invalid Credentials ', api_response);
            }
        } else {
            return common_util_ctrl.prepareResponse(res, 400, ResponseConstants.ERROR, 'Invalid Credentials ', '');
        }
    } catch (e) {
        console.log(e);
        return common_util_ctrl.prepareResponse(res, 500, ResponseConstants.ERROR, e.message, e.message);
    }
}

const tournament_fixtures = async function (res, receivedData) {
    try {
        if (receivedData && receivedData.rs_token) {
            const api_call_response = await api_call_ctrl.tournament_fixtures(receivedData);
            console.log("api Http status: " + api_call_response.http_status_code);
            const api_response = await api_call_response.json();
            console.log(api_response)
            if (api_response && api_response.http_status_code===200) {
                return common_util_ctrl.prepareResponse(res, api_response.http_status_code, ResponseConstants.SUCCESS, 'Tounament fixtures retrieved successfully ', api_response.data);
            } else {
                return common_util_ctrl.prepareResponse(res, api_response.http_status_code, ResponseConstants.ERROR, 'Invalid Credentials ', api_response);
            }
        } else {
            return common_util_ctrl.prepareResponse(res, 400, ResponseConstants.ERROR, 'Invalid Credentials ', '');
        }
    } catch (e) {
        console.log(e);
        return common_util_ctrl.prepareResponse(res, 500, ResponseConstants.ERROR, e.message, e.message);
    }
}

const fantasy_match_credits = async function (res, receivedData) {
    try {
        if (receivedData && receivedData.rs_token) {
            const api_call_response = await api_call_ctrl.fantasy_match_credits(receivedData);
            console.log("api Http status: " + api_call_response.http_status_code);
            const api_response = await api_call_response.json();
            console.log(api_response)
            if (api_response && api_response.http_status_code===200) {
                return common_util_ctrl.prepareResponse(res, api_response.http_status_code, ResponseConstants.SUCCESS, 'fantacy match credit retrieved successfully ', api_response.data);
            } else {
                return common_util_ctrl.prepareResponse(res, api_response.http_status_code, ResponseConstants.ERROR, 'Invalid Credentials ', api_response);
            }
        } else {
            return common_util_ctrl.prepareResponse(res, 400, ResponseConstants.ERROR, 'Invalid Credentials ', '');
        }
    } catch (e) {
        console.log(e);
        return common_util_ctrl.prepareResponse(res, 500, ResponseConstants.ERROR, e.message, e.message);
    }
}



module.exports.fantasy_match_credits=fantasy_match_credits
module.exports.tournament_fixtures=tournament_fixtures
module.exports.association_cboard=association_cboard
module.exports.association_list=association_list;
module.exports.api_auth=api_auth