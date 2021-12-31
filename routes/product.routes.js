const path = require( "path" );
const dotenv = require( "dotenv" );
dotenv.config();
const mongoose = require( "mongoose" );
const crypto = require( "crypto" );
const router = require( "express" ).Router();
const productControllers = require( "../controllers/product.controllers" );
const Product = require( "../models/product.models" );
const verifyToken = require( "../utils/verifyToken" );
const isFarmer = require( "../utils/isFarmer" );
const multer = require( "multer" );
const GridFsStorage = require( "multer-gridfs-storage" );
const Grid = require( "gridfs-stream" );
// const upload = multer( { dest: "uploads/" } );

const conn = mongoose.createConnection( process.env.MONGO_URI);
// Init gfs
let gfs;

conn.once( "open", () => {
	// Init stream
	gfs = Grid( conn.db, mongoose.mongo );
	gfs.collection( "uploads" );
} );
const storage = new GridFsStorage( {
	url: process.env.MONGO_URI,
	file: ( req, file ) => {
		return new Promise( ( resolve, reject ) => {
			crypto.randomBytes( 16, ( err, buf ) => {
				if ( err ) {
					return reject( err );
				}
				const filename = buf.toString( "hex" ) + path.extname( file.originalname );
				const fileInfo = {
					filename: filename,
					bucketName: "uploads"
				};

				resolve( fileInfo );
			} );
		} );
	}
} );
const upload = multer( { storage } );
//Image upload setting
// preload story object on routes with ':story'
router.param( "product", async( req, res,next, id )=>{
	try{
		const product = await Product.findOne( { _id:id } ).populate( { path: "farmer", select:"_id" } );

		if( !product ) return res.sendStatus( 404 );
		req.product = product;
		return next();

	}catch( err ){
		res.json( { err_message : err } );
	}

} );

// Product routing
router.get( "/", productControllers.getProducts );

router.get( "/:product", productControllers.getProduct );

router.post( "/searchproduct", async( req, res )=>{
	const toSearch = req.body.productName;
	toSearch.replace( /[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&" );
	const product = await Product.find( { productName: new RegExp( toSearch, "gi" ) } );
	if( !product ) return res.json( { err: "Not found" } );
	res.json( product );
} );

router.post( "/create", upload.single( "productImage" ),verifyToken,isFarmer, productControllers.createProduct );

router.put( "/:product/update", upload.single( "productImage" ),verifyToken,isFarmer, productControllers.updateProduct );

router.delete( "/:product/delete",verifyToken,isFarmer, productControllers.deleteProduct );
router.get( "/image/:filename", ( req, res ) => {
	gfs.files.findOne( { filename: req.params.filename }, ( err, file ) => {
	// Check if file
		if ( !file || file.length === 0 ) {
			return res.status( 404 ).json( {
				err: "No file exists"
			} );
		}
  
		// Check if image
		if ( file.contentType === "image/jpeg" || file.contentType === "image/png" ) {
		// Read output to browser
			const readstream = gfs.createReadStream( file.filename );
			readstream.pipe( res );
		} else {
			res.status( 404 ).json( {
				err: "Not an image"
			} );
		}
	} );
} );
module.exports = router;