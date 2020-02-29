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
function internalErr(response, up){
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

/*server instructions for specific cases*/
const responses = {
    /*serve homepage*/
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
    
    /*serve and parse data for the orders page*/
    "order": function(request, response){
        let pathArgs = request.url.match(pathArgsRegX);
        if(request.method === "GET" && pathArgs.length === 1){ //serve the html for the order page
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
        }else if(request.method === "POST"){ //parse and store submitted order data
            let query = new URLSearchParams(pathArgs[pathArgs.length-1]);
            let orderData = "";
            request.on("data", (chunk)=>{ //extract all data from POST request
                orderData+= chunk.toString();
            });
            request.on("end", ()=>{ //aggregate data into orderStats
                if(pathArgs[1] === "submit"){
                    let restaurantName = query.get("restaurant");
                    orderData = JSON.parse(orderData); //convert json string to object
                    if(orderStats[restaurantName] === undefined){ //if DNE initialize a new restaurant object
                        orderStats[restaurantName] = {
                            name: restaurantName,
                            orderCount: 0,
                            totalsSum: 0,
                            avgOrder: 0,
                            favItem: "None Yet",
                            itemsOrdered: {}
                        }
                    }
                    let restaurant = orderStats[restaurantName];
                    restaurant.totalsSum += parseFloat(query.get("total")); //increase sum of order totals
                    restaurant.orderCount++; //increment order counter
                    restaurant.avgOrder = (restaurant.totalsSum / restaurant.orderCount).toFixed(2)
                    for(let i=0; i<orderData.length; i++){ //add each item's count to orderStats
                        restaurant.itemsOrdered[orderData[i].item] === undefined ?
                            restaurant.itemsOrdered[orderData[i].item] = orderData[i].amount :
                            restaurant.itemsOrdered[orderData[i].item] += orderData[i].amount;
                    }

                    //update most purchased item
                    restaurant.favItem = Object.getOwnPropertyNames(restaurant.itemsOrdered).reduce((acc, cur, ind, arr)=>{
                        return restaurant.itemsOrdered[cur] > restaurant.itemsOrdered[acc] ? cur : acc;
                    });
                    response.statusCode = 200;
                    response.end(JSON.stringify({orderID: restaurant.orderCount}));
                }
            });
        }
    },
    
    /*serve JSON data of restaurant information*/
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
    
    /*serve the stats page*/
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
responses["index"] = responses[""];

/* =====| Code execution begins here |===== */
init();
const server = http.createServer((request, response)=>{
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