var express = require('express');
var apiRoutes = express.Router();
const api_ctrl = require('../controller/api_user_ctrl');
const bodyParser = require('body-parser');
const common_util_controller = require('../controller/common_ctrl');
const ResponseConstants = require('../constants/response_constants.js');


// module.exports = (app) => {

//     const api_ctrl = require('../controller/api_user_ctrl');
//     const bodyParser = require('body-parser');
//     const common_util_controller = require('../controller/common_ctrl');
//     const ResponseConstants = require('../constants/response_constants.js');

//     // parse application/x-www-form-urlencoded
    
//     // JWT Authentication 

//     app.use(bodyParser.urlencoded({
//       extended: true
//     }))
  
//     // parse application/json
//     app.use(bodyParser.json())
    
//     app.post('/auth', function (req, res) {
//         console.log('auth ' + req.body);
//         const passwordObj = req.body;
//         api_ctrl.api_auth(res, passwordObj);
//       });
  
//   }

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

module.exports=apiRoutes