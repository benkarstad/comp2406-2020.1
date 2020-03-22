COMP 2406A assignment 3 Submission: TODO: Update README and redo file tree before submitting A4
    Included Files:
    .
    │   addrestaurant_router.js
    │   config.json
    │   contentTypes.json
    │   index_router.js
    │   order_router.js
    │   package-lock.json
    │   package.json
    │   README.txt
    │   restaurants_router.js
    │   server.js
    │   stats_router.js
    │
    ├───public
    │   ├───images
    │   │       add.png
    │   │       remove.png
    │   │
    │   ├───scripts
    │   │       addrestaurant.js
    │   │       editRestaurant.js
    │   │       order.js
    │   │
    │   └───stylesheets
    │           editRestaurant.css
    │           order.css
    │           restaurant.css
    │           styles.css
    │
    ├───restaurants
    │       aragorn.json
    │       frodo.json
    │       legolas.json
    │
    └───views
        │   addrestaurant.njk
        │   editRestaurant.njk
        │   error.njk
        │   index.njk
        │   order.njk
        │   restaurant.njk
        │   restaurantNames.njk
        │   stats.njk
        │
        └───templated_components
                _footer.njk
                _header.njk
                _skeleton.njk

    Execution Instructions:
        commands:
            npm install
            ./init.bat
        two command prompts will open, for the database and server respectively
        navigate to "localhost:3000/" in the Google Chrome browser

    Notes/Additional Features:
        Project makes use of Google's Material Icons Library (https://www.google.com/design/icons/)
        *.njk files are Nunjucks templates (https://mozilla.github.io/nunjucks/)

    Design Changes:
        My page for each restaurant doesn't show the ID's of each menu item, this is because I changed my data model, and it no longer has unique ID's for each item
        Requesting JSON from "/restaurants" gives the the id's and names (not just id's) of each restaurant, this is necessary for my order page to work.
        Instead of editing the restaurant in /restaurants/:id, the user does so in /restaruants/:id/edit