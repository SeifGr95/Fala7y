const dotenv = require( "dotenv" );
dotenv.config();
const router = require( "express" ).Router();
const jwt = require( "jsonwebtoken" );
const bcrypt = require( "bcryptjs" );
const User = require( "../models/user.models" );
const Cart = require( "../models/cart.models" );
router.post( "/register", async ( req, res )=> {
	//Validating the data we parse in body
	//Checking if the email is validation
	const existEmail = await User.findOne( { email: req.body.email } );
	if ( existEmail ) return res.send( { err: "Email already exist" } );
	//Hashing the password
	const salt = await bcrypt.genSalt( 16 );
	const hashedPassword = await bcrypt.hash( req.body.password, salt );
	//Creating new user
	const user = new User( {
		firstName: req.body.firstname,
		lastName: req.body.lastname,
		userName: req.body.username,
		email: req.body.email,
		phoneNumber: req.body.phonenumber,
		address: req.body.address,
		// isFarmer: req.body.isfarmer,
		password: hashedPassword
	} );
	try{
		await user.save();
		const newCart = new Cart( {
			owner:user._id
		} );

		await newCart.save();
		let result=	await User.findByIdAndUpdate( user._id,{ cart:newCart._id },{ new: true } );

		res.json( { user : result.authToJSON() } );
	}catch( err ){
		res.status( 400 ).json( { err: "There's a problem in the server" } );
	}
} );
router.post( "/login", async ( req, res )=> {
	//Validating the data
	//Checking if email is valid
	const user = await User.findOne( { email: req.body.email } );
	if ( !user ) return res.send( { err: "Adresse mail ou mot de passe incorrect." } );
	//Validate password
	const validPass = await bcrypt.compare( req.body.password, user.password );
	if ( !validPass ) return res.send( { err: "Adresse mail ou mot de passe incorrect." } );
	//Generating Token
	const token = jwt.sign( { _id: user._id, isFarmer: user.isFarmer, role: user.isAdmin }, process.env.TOKEN_KEY, { expiresIn: "2 days" } );
	res.header( "access_token", token ).json( { message: "login valid", token: token, user: user.authToJSON() } );
} );
module.exports = router;
