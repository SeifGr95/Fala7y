const path = require( "path" );
const express = require( "express" );
const app = express();
const dotenv = require( "dotenv" );
const mongoose = require( "mongoose" );
const bodyparser = require( "body-parser" );
const cors = require( "cors" );


//cors Config
// const corsOptions = {
// 	origin: "http://localhost:4200",
// 	optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
// 	credentials: true
// };
//Dotenv Config
dotenv.config();
//Connect to database
mongoose.set( "useNewUrlParser", true );
mongoose.set( "useFindAndModify", false );
mongoose.set( "useCreateIndex", true );
mongoose.set( "useUnifiedTopology", true );
mongoose.connect( process.env.MONGO_URI );
mongoose.connection.on( "connected", () => {console.log( "Connected" );} );
mongoose.connection.on( "error", ( err ) => console.log( "Connection failed with - ",err ) );
//Importe routes
const productRoute = require( "./routes/product.routes" );
const authRoute = require( "./routes/auth.routes" );
const orderRoute = require( "./routes/order.routes" );
const cartRoute = require( "./routes/cart.routes" );

//cors
//Middleware
app.use( bodyparser.json() );
app.use( bodyparser.urlencoded( { extended: true } ) );
app.use( cors() );
//Route Middleware
app.use( "/product", productRoute );
app.use( "/auth", authRoute );
app.use( "/orders", orderRoute );
app.use( "/cart", cartRoute );

// Serve static assets if in production
if( process.env.NODE_ENV === "production" ){
	app.use( express.static( __dirname + "/client/dist/elFalleh" ) );

	app.use( "*", ( req, res ) => {
		res.sendFile( path.join( __dirname+"/client/dist/elFalleh/index.html" ) );
	} );
	
}

//Server Run
const port = process.env.PORT || 8000;
app.listen( port, () => {
	console.log( "Server is up and running on port number " + port );
} );