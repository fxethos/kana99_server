const knex_config=require("knex")


const signup = async function (res, receivedData) {
    try {
        knexConfig.knex('users').insert({
            uuid: received.clientLogin,
            username: received.symbol,
            wallet_address: received.volume,
            points_accumulated:rec_direction,
            games_played: received.stopLoss,
            open_price: received.pricePosition,
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