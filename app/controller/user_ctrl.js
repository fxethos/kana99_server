const knex_config = require("../config/knex_config")
const common_util_ctrl = require("../controller/common_ctrl")
const ResponseConstants = require("../constants/response_constants")
const { key } = require("../constants/params")
const { use } = require("../routers/router")


const signup = async function (res, received) {
    try {
        knex_config.knex('users').insert({
            uuid: received.uuid,
            username: received.username,
            email: received.email,
            wallet_address: received.wallet_address,
            points_accumulated: received.points_accumulated,
            games_played: received.games_played,
            timestamp: new Date().getTime()
        }).then((user) => {
            return common_util_ctrl.prepareResponse(res, 200, ResponseConstants.SUCCESS, 'user  sign up successfull ', user);
        }).catch((err) => {
            return common_util_ctrl.prepareResponse(res, 500, ResponseConstants.ERROR, 'Something went wrong ', err);
        })
    } catch (e) {
        console.log(e);
        return common_util_ctrl.prepareResponse(res, 500, ResponseConstants.ERROR, e.message, e.message);
    }
}

const getuserinfo = async function (res, received) {
    try {
        knex_config.knex('users').select('*').where("username", "=", received.username).then((user) => {
            return common_util_ctrl.prepareResponse(res, 200, ResponseConstants.SUCCESS, 'user info retrived successfully ', user);
        }).catch((err) => {
            return common_util_ctrl.prepareResponse(res, 500, ResponseConstants.ERROR, 'Something went wrong ', err);
        })
    } catch (e) {
        console.log(e);
        return common_util_ctrl.prepareResponse(res, 500, ResponseConstants.ERROR, e.message, e.message);
    }
}

const playerinfo = async function (res, received) {
    try {
        knex_config.knex('standings').insert({
            id: received.id,
            contest_id: received.contest_id,
            captain_id: received.captain_id,
            vice_captain_id: received.vice_captain_id,
            wkeeper_id: received.wkeeper_id,
            player1_id: received.player1_id,
            player2_id: received.player2_id,
            player3_id: received.player3_id,
            player4_id: received.player4_id,
            player5_id: received.player5_id,
            player6_id: received.player6_id,
            player7_id: received.player7_id,
            player8_id: received.player8_id,
            user_id: received.user_id,
            points_total: 0,

        }).then((standing) => {
            knex_config.knex('contests').select('match_id').where("contest_id", "=", received.contest_id).then((rows) => {
                for (row of rows) {
                    //console.log(`${row['match_id']} ${row['contest_id']}`);
                    knex_config.knex('fantacy_match_credits').select('credits').where("match_key", "=", `${row['match_id']}`).then((rows) => {
                        for (row of rows) {
                            //console.log(JSON.stringify(`${row['credits'][0].performance[0].points}`));


                        }
                    })
                        .catch((err) => { console.log(err); throw err })

                }
            })
                .catch((err) => { console.log(err); throw err })



            return common_util_ctrl.prepareResponse(res, 200, ResponseConstants.SUCCESS, 'Player info added successfully ', standing);
        }).catch((err) => {
            return common_util_ctrl.prepareResponse(res, 500, ResponseConstants.ERROR, 'Something went wrong ', err);
        })
    } catch (e) {
        console.log(e);
        return common_util_ctrl.prepareResponse(res, 500, ResponseConstants.ERROR, e.message, e.message);
    }
}

const updatePoints = async function (res, received) {
    try {
        knex_config.knex('standings').select("*").then((user) => {
            user.filter(elementdata => {
                let player = [elementdata.vice_captain_id, elementdata.captain_id, elementdata.wkeeper_id, elementdata.player1_id, elementdata.player2_id, elementdata.player3_id, elementdata.player4_id, elementdata.player5_id, elementdata.player6_id, elementdata.player7_id, elementdata.player8_id]
                //console.log(player)

                knex_config.knex('contests').select('match_id').where("contest_id", "=", elementdata.contest_id).then((rows) => {

                    for (row of rows) {
                        // console.log(row)

                        // console.log(`${row['match_id']} ${row['contest_id']}`);
                        knex_config.knex('fantacy_match_credits').select('credits').where("match_key", "=", `${row['match_id']}`).then((rows) => {

                            for (row of rows) {
                                let temp_array = []
                                let count = 0
                                //console.log(row.credits)
                                row.credits.filter(element => {
                                    player.find(element2 => {
                                        if (element.player_key == element2) {
                                            temp_array.push(element)
                                        }
                                    })
                                })

                                temp_array.filter(element => {
                                    count += Number(element.performance[0].points)
                                })
                                //console.log(count)
                                //console.log(elementdata.contest_id)
                                knex_config.knex('standings').where({ contest_id: elementdata.contest_id, id: elementdata.id }).update({ points_total: count, thisKeyIsSkipped: undefined }).then((user) => {

                                }).catch((err) => {
                                    console.log(err); throw err
                                })
                            }
                        }
                        )
                            .catch((err) => { console.log(err); throw err })

                    }


                }).catch((err) => { console.log(err); throw err })

            })

            return common_util_ctrl.prepareResponse(res, 200, ResponseConstants.SUCCESS, 'points updated successfully ');
        }).catch((err) => {
            return common_util_ctrl.prepareResponse(res, 500, ResponseConstants.ERROR, 'Something went wrong ', err);
        })
    } catch (e) {
        console.log(e);
        return common_util_ctrl.prepareResponse(res, 500, ResponseConstants.ERROR, e.message, e.message);
    }

}


const getaddressarray = async function (res, received) {
    let requiredArray = []
    let addressarray = []
    let userid = []
    let count = 0
    try {
        knex_config.knex('standings').select("*").orderBy('points_total', "desc").where("contest_id", "=", received.contest_id).then(async (rows) => {
            for (row of rows) {
                userid.push(row.user_id)
                requiredArray.push({ "userid": row.user_id, "points": row.points_total })
            }

            //console.log(requiredArray)


            knex_config.knex('users').select("wallet_address", "uuid").whereIn('uuid', userid).then(async (rows) => {

                for (row of rows) {
                    requiredArray.find(element2 => {
                        //console.log(element2.userid)
                        if (element2.userid == row.uuid) {
                            addressarray.push({ 'wallet_address': row.wallet_address, 'points': element2.points, 'uuid': element2.userid })
                        }
                    })

                }
                addressarray.sort((a,b) => parseFloat(b.points)-parseFloat(a.points));
                //console.log(addressarray)

            }).catch((err) => { console.log(err); throw err })

            // }) 

            return common_util_ctrl.prepareResponse(res, 200, ResponseConstants.SUCCESS, 'array retrived successfully ');
        }).catch((err) => {
            return common_util_ctrl.prepareResponse(res, 500, ResponseConstants.ERROR, 'Something went wrong ', err);
        })
    } catch (e) {
        console.log(e);
        return common_util_ctrl.prepareResponse(res, 500, ResponseConstants.ERROR, e.message, e.message);
    }
}




module.exports.signup = signup
module.exports.getuserinfo = getuserinfo
module.exports.playerinfo = playerinfo
module.exports.updatePoints = updatePoints
module.exports.getaddressarray = getaddressarray


