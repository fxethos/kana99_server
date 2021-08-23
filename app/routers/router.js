var express = require('express');
var apiRoutes = express.Router();
const api_ctrl = require('../controller/api_user_ctrl');
const common_util_ctrl=require("../controller/common_ctrl")
const ResponseConstants=require("../constants/response_constants")
const user_ctrl=require("../controller/user_ctrl")
const model_ctrl=require('../controller/model_ctrl')

apiRoutes.post('/auth', function (req, res) {
    console.log('auth ' + req.body);
    const passwordObj = req.body;
    api_ctrl.api_auth(res, passwordObj);
});

apiRoutes.post('/association/list', function (req, res) {
    console.log('received association list ' + req.body);
    const passwordObj = req.body;
    api_ctrl.association_list(res, passwordObj);
});

apiRoutes.post('/association/c_board', function (req, res) {
    console.log('received association c_board ' + req.body);
    const passwordObj = req.body;
    api_ctrl.association_cboard(res, passwordObj);
});

apiRoutes.post('/tournament/fixtures', function (req, res) {
    console.log('received tournament fixtures ' + req.body);
    const passwordObj = req.body;
    api_ctrl.tournament_fixtures(res, passwordObj);
});

apiRoutes.post('/fantasy_match_credits', function (req, res) {
    console.log('received fantasy_match_credits ' + req.body);
    const passwordObj = req.body;
    api_ctrl.fantasy_match_credits(res, passwordObj);
});

apiRoutes.post('/user/signup', function (req, res) {
    console.log('received signup ' + req.body);
    var receivedData = req.body;
    if((receivedData.uuid && receivedData.email && receivedData.username)){
        receivedData.points_accumulated=0
        receivedData.games_played=0
        user_ctrl.signup(res, receivedData);
    }else{
        return common_util_ctrl.prepareResponse(res, 500, ResponseConstants.ERROR, 'Missing Mandatory params', "ERROR");
    }
});

apiRoutes.post('/user/info', function (req, res) {
    console.log('received info ' + req.body);
    var receivedData = req.body;
    if((receivedData.uuid)){
        user_ctrl.getuserinfo(res, receivedData);
    }else{
        return common_util_ctrl.prepareResponse(res, 500, ResponseConstants.ERROR, 'Missing Mandatory params', "ERROR");
    }
});

apiRoutes.get('/getstaticdata', function (req, res) {
    model_ctrl.getstaticdata(res);
});

apiRoutes.post('/fantasy_match_credits/db', function (req, res) {
    console.log('received fantasy_match_credits ' + req.body);
    const passwordObj = req.body;
    model_ctrl.getDBfantasy_match_credits(res, passwordObj);
});

apiRoutes.post('/postcontest', function (req, res) {
    console.log('received postcontest ' + req.body);
    const passwordObj = req.body;
    model_ctrl.postcontest(res, passwordObj);
});

apiRoutes.get('/getcontest', function (req, res) {
     console.log('received get contest ' + req.query.match_id);
     //const passwordObj = req.body;
    const passwordObj = req.query;
    model_ctrl.getcontest(res, passwordObj);
});

module.exports=apiRoutes