const dotenv = require('dotenv');
const fetch = require('node-fetch');
const getparams=require('../constants/params')

exports.prepareResponse = (res, httpCode, status, message, responseData) => {
    res.status(httpCode).json({
        'status': status,
        'message': message,
        'data': responseData
    });
}



exports.makePostRequest = async (params) => {
    var url = new URL(`${getparams.api_base_url}/${getparams.version}/${params.type}/${getparams.key}/${params.eventName}/`)
    var body={
        api_key:params.api_key
    }
    const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' }
    });
    return response;
};

exports.makeGEtRequest = async (params) => {
    var url = new URL(`${getparams.api_base_url}/${getparams.version}/${params.type}/${getparams.key}/${params.eventName}/`)

    
    const response = await fetch(url, {
        method: 'GET',
        headers: { 'rs-token': params.rs_token }
    });
    return response;
};