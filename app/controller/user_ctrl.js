const knex_config=require("knex")


const signup = async function (res, received) {
    try {
        knexConfig.knex('users').insert({
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
            return common_util_ctrl.prepareResponse(res, 500, ResponseConstants.ERROR, 'Something went wrong ', user);
        })
    } catch (e) {
        console.log(e);
        return common_util_ctrl.prepareResponse(res, 500, ResponseConstants.ERROR, e.message, e.message);
    }
}



module.exports.signup=signup