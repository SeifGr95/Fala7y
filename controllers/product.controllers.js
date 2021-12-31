const Product = require( "../models/product.models" );

const createProduct = async ( req, res )=>{

	const product = new Product( {
		productName: req.body.productName,
		description: req.body.description,
		price: req.body.price,
		quantity: req.body.quantity,
		type: req.body.type,
		unit: req.body.unit,
		productImage: req.file.filename,
		farmer: req.body.farmer
	} );
	
	try {
		const savedProduct = await product.save();
		return res.json( savedProduct );
	} catch ( err ) {
		return res.json( { err_message: err } );
	}
};

//Get all stories
const getProducts = async ( req, res ) => {
	try{
		const products = await Product.find().populate( { path: "farmer", select:"_id" } );
		return res.json( { products: products } );
	}catch( err ){
		throw res.json( { err_message: err } );
	}
};
//Get single story
const getProduct = async( req, res )=> {

	const product = req.product;

	try{
		return res.json( { product: product } );

	}catch( err ){
		res.json( { err_message: err } );
	}
};
//update story
const updateProduct = async( req, res )=>{

	const product = req.product;
	let updateData = {};
	try {
		if( req.file !== undefined ){
			updateData = {
				productName: req.body.productName,
				description: req.body.description,
				price: req.body.price,
				quantity: req.body.quantity,
				type: req.body.type,
				unit: req.body.unit,
				productImage: req.file.filename,
				farmer: req.body.farmer
			};
		}else{
			updateData = {
				productName: req.body.productName,
				description: req.body.description,
				price: req.body.price,
				quantity: req.body.quantity,
				type: req.body.type,
				unit: req.body.unit,
				farmer: req.body.farmer
			};
		}
		const updateProduct = await Product.findByIdAndUpdate( product._id, updateData, { new: true } );
		return res.json( updateProduct );
	} catch ( err ) {
		res.json( err );
	}
};
//Get delete story
const deleteProduct = async( req, res )=>{
	try {
		const product = req.product;
		const deleteProduct = await Product.findByIdAndDelete( product._id );
		return res.json( deleteProduct );
	} catch ( err ) {
		res.json( { err_message: err } );
	}
};

module.exports.createProduct = createProduct;
module.exports.getProduct = getProduct;
module.exports.getProducts = getProducts;
module.exports.updateProduct = updateProduct;
module.exports.deleteProduct = deleteProduct;