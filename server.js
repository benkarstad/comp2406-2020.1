//TODO: write batch script to run server automatically

const fs = require("fs");
const http = require("http");
const njk = require("nunjucks");

class ResourceError extends Error{
    constructor(resource){
        super(`${resource} is not a valid resource`);
        this.name = "ResourceError"
    }
}

let contentTypes;
let restaurants = [];
let orderStats = [];

const pathArgsRegX = /(?<=[\/?])[^\/?]*/g; //matches to individual segments of a path string
const fileExt = /\.[^\/\.]+$/; //matches the file extension of a file or file path

function init(){
    let restaurantFiles = fs.readdirSync("restaurants/");
    for(let index = 0; index < restaurantFiles.length; index++){
        fs.readFile(`restaurants/${restaurantFiles[index]}`, (up, data)=>{
            restaurants.push(JSON.parse(data));
        });
    }
    fs.readFile("contentTypes.json", (up, data)=>{
        if(up) throw up;
        contentTypes = JSON.parse(data);
    });
}
function internalErr(response, up)
{
    njk.render(
        "templated_components/_skeleton.njk",
        {
            title: "Internal Server Error",
            bodyText: "Internal Server Error"
        },
        (up, data)=>{
            if(up) throw up;
            response.statusCode = 500;
            response.setHeader("Content-Type", contentTypes[".html"]);
            response.end(data);
        });
    console.log(up);
}

const responses = { //server instructions for specific cases
    "": function(request, response){
        njk.render(
            "index.njk",
            {
                title: "Welcome to MealMobile"
            },
            (up, data)=>{
                if(up) throw up;
                response.statusCode = 200;
                response.setHeader("Content-Type", contentTypes[".html"]);
                response.end(data);
            });
    },
    "order": function(request, response){ //serve the html for the order page
        let pathArgs = request.url.match(pathArgsRegX);
        if(request.method === "GET" && pathArgs.length === 1){
            njk.render(
                "order.njk",
                {
                    body: {onload: "init()"}
                },
                (up, data)=>{
                    if(up){
                        internalErr(response, up);
                        return
                    }
                    response.statusCode = 200;
                    response.setHeader("Content-Type", contentTypes[".html"]);
                    response.end(data);
                });
        }else if(request.method === "POST"){
            let query = new URLSearchParams(pathArgs[pathArgs.length-1]);
            let orderData = "";
            request.on("data", (chunk)=>{ //extract all data from POST request
                orderData+= chunk.toString();
            });
            request.on("end", ()=>{ //aggregate data into orderStats
                let restaurant = query.get("restaurant");
                if(pathArgs[1] === "submit"){
                    orderData = JSON.parse(orderData); //convert json string to object
                    if(orderStats[restaurant] === undefined){ //initialize a new object
                        orderStats[restaurant] = {
                            name: restaurant,
                            orderCount: 0,
                            totalsSum: 0,
                            favItem: "None Yet",
                            itemsOrdered: {}
                        }
                    }
                    orderStats[restaurant].totalsSum = parseFloat( //increase sum of all order totals
                        parseFloat(orderStats[restaurant].totalsSum)+
                               parseFloat(query.get("total"))
                    );
                    orderStats[restaurant].orderCount++;
                    for(let i=0; i<orderData.length; i++){ //add each item's count to orderStats
                        orderStats[restaurant].itemsOrdered[orderData[i].item] === undefined ?
                            orderStats[restaurant].itemsOrdered[orderData[i].item] = orderData[i].amount :
                            orderStats[restaurant].itemsOrdered[orderData[i].item] += orderData[i].amount;
                    }
                    console.log(orderStats);
                }
                response.statusCode = 200;
                response.end(JSON.stringify({orderID: orderStats[restaurant].orderCount}));
            });
        }
    },
    "restaurants": function(request, response){
        let pathArgs = request.url.match(pathArgsRegX);
        if(pathArgs[1] === "names.json"){
            response.statusCode = 200;
            response.contentType = contentTypes[".json"];
            response.end(JSON.stringify(restaurants, ["name"]));
            return
        }
        query = new URLSearchParams(pathArgs[1]);
        if(query.has("name")){
            let restaurantObj = restaurants.find((obj)=>{
                return obj.name === query.get("name");
            });
            response.statusCode = 200;
            response.contentType = contentTypes[".json"];
            response.end(JSON.stringify(restaurantObj));
            return
        }
        throw new ResourceError(request.url);
    },
    "stats": function(request, response){
        njk.render(
            "stats.njk",
            {
                title: "Order Statistics",
                orderStats: Object.values(orderStats)
            },
            (up, data)=>{
                if(up){
                    internalErr(response, up);
                    return
                }
                response.statusCode = 200;
                response.setHeader("Content-Type", contentTypes[".html"]);
                response.end(data);
            })
    }
};

/* =====| Code execution begins here |===== */
init();
const server = http.createServer((request, response)=>{
    responses["index"] = responses[""];

    console.log(`${request.method} request for ${request.url}`);
    let pathArgs = request.url.match(pathArgsRegX);
    const filetype = fileExt.exec(request.url);

    fs.readFile(/(?<=^\/)(.*)/.exec(request.url)[1], (up, data)=>{
        if(up){ //on an error...
            if (up.code === "ENOENT"){ //if file DNE, try a special response case...
                try{
                responses[pathArgs[0]](request, response);
                }catch(up){//If no matches, 404
                    if((up instanceof TypeError && up.message === "responses[pathArgs[0]] is not a function")
                            || up instanceof ResourceError){
                        response.statusCode = 404;
                        response.end("Unknown resource.");
                        console.log(`Unknown resource ${request.url}\n`)
                    }else{
                        internalErr(response, up);
                        console.log(up);
                    }
                }
                return
            }
            //if other error, respond 500
            internalErr(response, up);
            return
        }
        response.statusCode = 200;
        response.setHeader("Content-Type", contentTypes[filetype]);
        response.end(data);
    });

});
server.listen(3000);