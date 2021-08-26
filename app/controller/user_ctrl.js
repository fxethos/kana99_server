const knex_config=require("../config/knex_config")
const common_util_ctrl=require("../controller/common_ctrl")
const ResponseConstants=require("../constants/response_constants")


const signup = async function (res, received) {
    try {
        knex_config.knex('users').insert({
            uuid: received.uuid,
            username: received.username,
            email:received.email,
            wallet_address: received.wallet_address,
            points_accumulated:received.points_accumulated,
            games_played: received.games_played,
            timestamp:new Date().getTime()
        }).then((user) => {
            return common_util_ctrl.prepareResponse(res, 200, ResponseConstants.SUCCESS, 'user  sign up successfull ', user);
        }).catch((err) => {
            return common_util_ctrl.prepareResponse(res, 500, ResponseConstants.ERROR, 'Something went wrong ', err);
        })
    } catch  {
        return common_util_ctrl.prepareResponse(res, 500, ResponseConstants.ERROR, e.message, e.message);
    }
}

const getuserinfo = async function (res, received) {
    try {
        knex_config.knex('users').select('*').where("uuid","=",received.uuid).then((user) => {
            return common_util_ctrl.prepareResponse(res, 200, ResponseConstants.SUCCESS, 'user info retrived successfully ', user);
        }).catch((err) => {
            return common_util_ctrl.prepareResponse(res, 500, ResponseConstants.ERROR, 'Something went wrong ', err);
        })
    } catch {
        return common_util_ctrl.prepareResponse(res, 500, ResponseConstants.ERROR, e.message, e.message);
    }
}

module.exports.signup=signup
module.exports.getuserinfo=getuserinfo