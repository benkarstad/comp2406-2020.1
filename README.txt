COMP 2406A assignment 1 Submission:
    Included Files:
        README.txt
        package.json
        package-lock.json
        server.js
        order.js
        contentTypes.json
        index.njk
        order.njk
	    stats.njk
        styles.css
        add.png
        remove.png

        templated_components/*.njk
        restaurants/*.json

    Execution Instructions:
        commands:
            npm install
            node server.js
        navigate to "localhost:3000/" in the Google Chrome browser

    Notes/Additional Features:
        Implemented Order page from assignment 2
        Searchable restaurant dropdown
        Dynamically load data by category instead of linking between page locations
        *.njk files are Nunjucks templates (https://mozilla.github.io/nunjucks/)

    Design Changes:
        My page for each restaurant doesn't show the ID's of each menu item, this is because I changed my data model, and it no longer has unique ID's for each item
        Requesting JSON from "/restaurants" gives the the id's and names (not just id's) of each restaurant, this is necessary for my order page to work.
