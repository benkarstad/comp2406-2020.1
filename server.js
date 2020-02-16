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

const pathArgs = /(?<=\/)[^\/]*/g; //matches to individual segments of a path string
const fileExt = /\.[^\/]+$/;

const server = http.createServer((request, response)=>{
    const responses = { //server instructions for various cases
        "": function(request, response){ //TODO: index.html
            response.statusCode = 200;
            response.end("Success");
        },

        "order": function(request, response){
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
        }
    };
    console.log(`${request.method} request for ${request.url}`);
    let match = request.url.match(pathArgs);
    try {
        if(fileExt.test(request.url) || fs.existsSync(request.url))
        {
            fs.readFile(/(?<=^\/)(.*)/.exec(request.url)[1], (up, data)=>{
                const filetype = fileExt.exec(request.url);
                if(up){
                    response.statusCode = 500;
                    response.end("Internal Server Error");
                    return
                }
                response.statusCode = 200;
                response.setHeader("Content-Type", contentTypes[filetype]);
                response.end(data);
            });
        }else{
            responses[match[0]](request, response);
        }
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