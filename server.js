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
let orderStats = {
    orderCount: 0,
    totalsSum: 0,
    itemsOrdered: {}
};

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

/* =====| Code execution begins here |===== */
init();
const server = http.createServer((request, response)=>{
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
                })
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
                           response.statusCode = 500;
                           response.end("Internal Server Error");
                           console.log(up);
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
                    if(pathArgs[1] === "submit"){
                        let restaurant = query.get("restaurant");
                        orderData = JSON.parse(orderData); //convert json string to object
                        orderStats.totalsSum = parseFloat(parseFloat(orderStats.totalsSum)+parseFloat(query.get("total"))).toFixed(2);
                        orderStats.orderCount++;
                        orderStats.itemsOrdered[restaurant] === undefined ? orderStats.itemsOrdered[restaurant] = {}: true;
                        for(let i=0; i<orderData.length; i++){ //add each item's count to orderStats
                            orderStats.itemsOrdered[restaurant][orderData[i].item] === undefined ?
                                orderStats.itemsOrdered[restaurant][orderData[i].item] = orderData[i].amount :
                                orderStats.itemsOrdered[restaurant][orderData[i].item] += orderData[i].amount;
                        }
                        console.log(orderStats);
                    }
                    response.statusCode = 200;
                    response.end(JSON.stringify({orderID: orderStats.orderCount}));
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
        }
    };
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
                        console.log(up);
                    }
                }
                return
            }
            //if other error, respond 500
            response.statusCode = 500;
            response.end("Internal Server Error");
            console.log(up);
            return
        }
        response.statusCode = 200;
        response.setHeader("Content-Type", contentTypes[filetype]);
        response.end(data);
    });

});
server.listen(3000);