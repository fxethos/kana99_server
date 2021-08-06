module.exports.swagger_options = {
    swaggerDefinition:{
        info: {
            title : "CRICKET API Document",
            description: "Here we provide the CRICKET API Information",
            contact :{
                name : "Tradala Backend team",
                email : "muthu@tradala.tech"
            },
            servers:["http://localhost:3000"]
        }
    },  
    apis : ["./app/routers/router.js"]
}