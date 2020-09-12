# COMP 2406A assignment 3 Submission:
```
    Included Files:
    .
    │   database-initializer.js
    │   init.bat
    │   package-lock.json
    │   package.json
    │   README.txt
    │   resetPasswords.js
    │   restaurants.json
    │   secretKey
    │   server.bat
    │   server.js
    │   serverconfig.json
    │   users.json
    │
    │
    ├───public
    │   ├───scripts
    │   │       addrestaurant.js
    │   │       editRestaurant.js
    │   │       order.js
    │   │       register.js
    │   │       userProfile.js
    │   │       users.js
    │   │       _userAuthForm.js
    │   │
    │   └───stylesheets
    │           dropdown.css
    │           header.css
    │           order.css
    │           userProfile.css
    │
    ├───routers
    │       addrestaurant_router.js
    │       index_router.js
    │       login_router.js
    │       logout_router.js
    │       orders_router.js
    │       order_router.js
    │       register_router.js
    │       restaurants_router.js
    │       stats_router.js
    │       users_router.js
    │
    ├───scripts
    │       auth.js
    │       status.js
    │       utils.js
    │
    └───views
        │   addrestaurant.njk
        │   editRestaurant.njk
        │   error.njk
        │   index.njk
        │   login.njk
        │   order.njk
        │   orderPage.njk
        │   register.njk
        │   restaurant.njk
        │   restaurantNames.njk
        │   stats.njk
        │   userProfile.njk
        │   users.njk
        │
        └───templated_components
                _footer.njk
                _header.njk
                _skeleton.njk
                _userAuthForm.njk
```

#### Execution Instructions:
1) Ensure the .db property in serverconfig.json is correct
2) Ensure that the database has the following collections:
    * users
    * restaurants
    * orders
    * sessions

3) commands:
    
    `./init.bat` first time set-up
    
    `./server.bat` starts a server instance

    a new command prompt will open for the server instance,
    navigate to "localhost:3000/" in the Google Chrome browser

    **NOTE:** If init.bat is not functioning, try importing the data manually from
            users.json and restaurants.json, then running "node resetPasswords.js"


#### Notes/Additional Features:
User passwords are stored salted and hashed,
and salts are encrypted with a master secretKey

Sessions are established and validated with JSON Web Tokens
(https://www.npmjs.com/package/jsonwebtoken)

Project makes use of Google's Material Icons Library
(https://www.google.com/design/icons/)

*.njk files are Nunjucks templates
(https://mozilla.github.io/nunjucks/)

**WARNING:** Project may behave unpredictably
when resources are manually removed from the database


#### Design Changes:
Users can set their privacy value on registration

Orders are submitted by posting to "/order/submit"
to be consistent with the path to the order form: "/order"