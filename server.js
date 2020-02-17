//TODO: write batch script to run server automatically

const fs = require("fs");
const http = require("http");

class ResourceError extends Error{
    constructor(resource){
        super(`${resource} is not a valid resource`);
        this.name = "ResourceError"
    }
}

const contentTypes = { //TODO: put into JSON file
    ".html": "text/html",
    ".css": "text/css",
    ".js": "text/javascript",
    ".png": "image/png",
    ".json": "application/json",
    ".txt": "text/plain"
};

let restaurants = [];

const pathArgsRegX = /(?<=\/)[^\/]*/g; //matches to individual segments of a path string
const fileExt = /\.[^\/\.]+$/; //matches the file extension of a file or file path

function init(){
    let restaurantFiles = fs.readdirSync("restaurants/");
    for(let index = 0; index < restaurantFiles.length; index++){
        fs.readFile(`restaurants/${restaurantFiles[index]}`, (up, data)=>{
            restaurants.push(JSON.parse(data));
        });
    }
}


init();
setTimeout(()=>{console.log(restaurants, JSON.stringify(restaurants, ["name"]))}, 2500);
const server = http.createServer((request, response)=>{
    const responses = { //server instructions for specific cases
        "": function(request, response){ //TODO: index.html
            response.statusCode = 200;
            response.end("Success");
        },

        "order": function(request, response){ //serve the html for the order page
            fs.readFile("order.html", (up, data)=>{
               if(up){
                   response.statusCode = 500;
                   response.end("Internal Server Error");
                   return
               }
                response.statusCode = 200;
                response.setHeader("Content-Type", contentTypes[".html"]);
                response.end(data);
            });
        },

        "restaurants": function(request, response){
            let pathArgs = request.url.match(pathArgsRegX);
            if(pathArgs[1] === "names.json"){
                response.statusCode = 200;
                response.contentType = contentTypes[".json"];
                response.end(JSON.stringify(restaurants, ["name"]));
            }
        }
    };
    responses["index"] = responses[""];

    console.log(`${request.method} request for ${request.url}`);
    let pathArgs = request.url.match(pathArgsRegX);
    try {
        fs.readFile(/(?<=^\/)(.*)/.exec(request.url)[1], (up, data)=>{
            const filetype = fileExt.exec(request.url);
            if(up){ //on an error...
                if (up.code === "ENOENT") { //if file DNE, try a special response case
                    responses[pathArgs[0]](request, response);
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
    }catch(up){//If no matches, 404
        if(up instanceof TypeError && up.message === "responses[match[0]] is not a function" || up instanceof ResourceError){
            response.statusCode = 404; //TODO: Improve 404 page
            response.end("Unknown resource.");
            console.log(`Unknown resource ${request.url}\n`)
        }else{
            throw up;
        }
    }
});
server.listen(3000);