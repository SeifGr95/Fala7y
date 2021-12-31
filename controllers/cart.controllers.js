const Cart = require( "../models/cart.models" );


//Get Cart
const getCart = async( req, res )=> {

	const cart = req.cart;

	try{
		return res.json( { cart: cart } );

	}catch( err ){
		res.json( { err_message: err } );
	}
};
//update cart
const updateCart = async( req, res )=>{

	const cart = req.cart;
	try {

		const dataToUpdate = req.body;
		const { ...updateData } = dataToUpdate;
		const updateCart = await Cart.findByIdAndUpdate( cart._id, updateData, { new: true } );
		return res.json( updateCart );
	} catch ( err ) {
		res.json( err );
	}
};
//Get delete story
const deleteCart = async( req, res )=>{
	try {
		const cart = req.cart;
		const deleteCart = await Cart.findByIdAndDelete( cart._id );
		return res.json( deleteCart );
	} catch ( err ) {
		res.json( err );
	}
};

module.exports.getCart = getCart;
module.exports.updateCart = updateCart;
module.exports.deleteCart = deleteCart;