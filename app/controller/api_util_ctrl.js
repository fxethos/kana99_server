const knex_config=require("../config/knex_config")
const api_call_ctrl=require("../controller/api_call_ctrl")
const common_util_ctrl=require('../controller/common_ctrl')

const saveapitoken=async(params)=>{
    res=await knex_config.knex('apiauthdata').insert({
        rs_token: params.rs_token,
        expires: params.expires
    })
    return res
}

const getapitoken=async()=>{
    res=await knex_config.knex('apiauthdata').select("*")
    return res
}

const updateapitoken=async(params)=>{
    res=await knex_config.knex('apiauthdata').update({
        rs_token:params.rs_token,
        expires:params.expires
    })
    return res
}

const saveapiassociationlist=async(params)=>{
    console.log(params)
    res=await knex_config.knex('apiassociationlist').insert({
        key: params.key,
        code: params.code,
        name:params.name,
        country:params.country,
        parent:params.parent
    })
    return res
}

const getapiassociationlist=async()=>{
    res=await knex_config.knex('apiassociationlist').select("*")
    return res
}

const getDBfantasy_match_credits=async(received)=>{
    res=await knex_config.knex('fantacy_match_credits').select("*").where("match_key","=",received.match_key)
    return res
}

const savetournamentlist=async(params)=>{
    console.log(params)
    res=await knex_config.knex('apitournamentdata').insert({
        key: params.key,
        name:params.name,
        short_name: params.short_name,
        countries: params.countries,
        start_date: params.start_date,
        gender: params.gender,
        point_system: params.point_system,
        competition:params.competition,
        association_key:params.association_key,
        metric_group:params.metric_group,
        is_date_confirmed:params.is_date_confirmed,
        is_venue_confirmed:params.is_venue_confirmed,
        last_scheduled_match_date:params.last_scheduled_match_date,
        formats:params.formats,
        sport:params.sport
    })
    return res
}
const savematchlist=async(params)=>{
    res=await knex_config.knex('apimatchdata').insert({
        key: params.key,
        name:params.name,
        short_name: params.short_name,
        sub_title: params.sub_title,
        teams: params.teams,
        start_at:params.start_at,
        venue: params.venue,
        tournament:params.tournament,
        association:params.association,
        metric_group:params.metric_group,
        status:params.status,
        winner:params.winner,
        messages:params.messages,
        format:params.format,
        sport:params.sport,
        gender: params.gender,
        tournament_key:params.tournament_key,
        association_key:params.association_key

    })
    return res
}

const savematchcredit=async(params)=>{
    res=await knex_config.knex('fantacy_match_credits').insert({
        match_key: params.match_key,
        credits:params.credits,
        players: params.players,
        teams: params.teams,
        last_update: params.last_update,
        match:params.match

    })
    return res
}


const gettournamentlist=async()=>{
    res=await knex_config.knex('apitournamentdata').select("*")
    return res
}

const savemultiassociationlist=async(association)=>{
    association.forEach(element => {
        param={
            key: element.key,
            code: element.code,
            name:element.name,
            country:element.country,
            parent:element.parent

        }
        saveapiassociationlist(param)
    });
}

const savemultiTounamentlist=async(association)=>{
    association.forEach(element => {
        console.log("to save ",element)
        savetournamentlist(element)
    });
}
const getmatchlist=async()=>{
    res=await knex_config.knex('apimatchdata').select("*")
    return res
}

const getmatchcreditlist=async()=>{
    res=await knex_config.knex('fantacy_match_credits').select("*")
    return res
}

const loadmatchlist=async(tournamentlist,rs_token)=>{
    console.log(tournamentlist.length)
    tournamentlist.forEach(element=>{
        params={
            page_key:element.key,
            rs_token:rs_token
        }
        api_call_ctrl.tournament_fixtures(params).then((res)=>{
            res.json().then((matches)=>{
                console.log("matches",matches.data.matches)
                matcheslist=matches.data.matches
                matcheslist.forEach(match=>{
                    match.tournament_key=match.tournament.key
                    match.association_key=match.association.key
                    savematchlist(match)
                })

            })
        })
        // console.log(res)

    })
}

const loadmatchcredit=async(matchlist,rs_token)=>{
    console.log(matchlist.length)
    matchlist.forEach(element=>{
        params={
            page_key:element.key,
            rs_token:rs_token
        }
        api_call_ctrl.fantasy_match_credits(params).then((res)=>{
            res.json().then((matches)=>{
                console.log("matches",matches.data)
                matchcredit=matches.data
                matchcredit.match_key=matchcredit.match.match_meta.key
                savematchcredit(matchcredit)
                // matcheslist=matches.data.matches
                // matcheslist.forEach(match=>{
                //     match.tournament_key=match.tournament.key
                //     match.association_key=match.association.key
                //     savematchcredit(match)
                // })
            })
        })
    })
}

function syncLoop(iterations, process, exit) {
    var index = 0,
        done = false,
        shouldExit = false;
    var loop = {
        next: function () {
            if (done) {
                if (shouldExit && exit) {
                    return exit(); // Exit if we're done
                }
            }
            // If we're not finished
            if (index < iterations) {
                index++; // Increment our index
                process(loop); // Run our process, pass in the loop
                // Otherwise we're done
            } else {
                done = true; // Make sure we say we're done
                if (exit) exit(); // Call the callback on exit
            }
        },
        iteration: function () {
            return index - 1; // Return the loop number we're on
        },
        break: function (end) {
            done = true; // End the loop
            shouldExit = end; // Passing end as true means we still call the exit callback
            return exit();
        }
    };
    loop.next();
    return loop;
}

module.exports.saveapitoken=saveapitoken
module.exports.getapitoken=getapitoken
module.exports.updateapitoken=updateapitoken
module.exports.saveapiassociationlist=saveapiassociationlist
module.exports.getapiassociationlist=getapiassociationlist
module.exports.savetournamentlist=savetournamentlist
module.exports.gettournamentlist=gettournamentlist
module.exports.savemultiassociationlist=savemultiassociationlist
module.exports.savemultiTounamentlist=savemultiTounamentlist
module.exports.loadmatchlist=loadmatchlist
module.exports.savematchlist=savematchlist
module.exports.getmatchlist=getmatchlist
module.exports.getmatchcreditlist=getmatchcreditlist
module.exports.loadmatchcredit=loadmatchcredit
module.exports.getDBfantasy_match_credits=getDBfantasy_match_credits