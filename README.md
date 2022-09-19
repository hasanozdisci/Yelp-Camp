# Yelp Camp

## Description
- YelpCamp is a website where users can create and review campgrounds. In order to review or create a campground, you must have an account.

## Demo
- You can see a complete working example [here](https://infinite-waters-74087.herokuapp.com). Or you can run the demo on your local machine, please follow the instructions in [Getting Started](#getting-started).

##  Technologies
|Front-End	|Back-End	|Database	|Deployment		
| ------- 	| ------ 	| ------ 	| --------		
|HTML5	 	|Node.js 	|Mongoose	|Heroku	  		
|CSS3	 	|ExpressJS	|MongoDB	|MongoDB Atlas	
|Bootstrap 5|EJS	  	|.		    |Git	
|Javascript	|.		  	|.		    |.	      	

##  Features
-	Login, sign-up, Admin role
-	RESTful routes (Create, Read, Update, Delete) for campgrounds, comments, and reviews
-	Create and Update forms have both client-side and server-side validation
-	Create routes have authentication
-	Update, and Delete routes have authentication and authorization
-	[Google Maps API](https://developers.google.com/maps/documentation)

## Getting Started

Follow the instructions below to set up the environment and run this project on your local machine.

1. Clone this repository.

```bash
# Clone repository
$ git clone https://github.com/hasanozdisci/Yelp-Camp
```

1. Install dependencies via NPM 

```bash
# Install dependencies via npm
$ npm install

```

3. Run the server with [nodemon](https://nodemon.io/) and open a browser to visit [http://localhost:3000/](http://localhost:3000/).

```bash
# Run server
$ npm start

