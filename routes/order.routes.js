const router = require( "express" ).Router();
const orderControllers = require( "../controllers/order.controllers" );
const Order = require( "../models/order.models" );
const User = require( "../models/user.models" );
const Product = require( "../models/product.models" );
const verifyToken = require( "../utils/verifyToken" );
const isOrderOwner = require( "../utils/isOrderOwner" );
const isFarmer = require( "../utils/isFarmer" );
router.param( "order", async( req, res,next, id )=>{
	try{
		const order = await Order.findOne( { _id: id } ).populate(
			{ path: "owner", select:[ "firstName", "lastName", "phoneNumber", "_id" ] } ).populate( "items.item" );
		if( !order ) return res.sendStatus( 404 );
		req.order = order;
		return next();

	}catch( err ){
		res.json( { err_message : err } );
	}
} );

router.param( "owner", async( req, res,next, id )=>{
	try{
		const owner = await User.findOne( { _id: id } );
		if( !owner ) return res.sendStatus( 404 );
		req.owner = owner;
		return next();

	}catch( err ){
		res.json( { err_message : err } );
	}
} );

router.put( "/:order/pay", verifyToken, isFarmer, async( req, res )=>{
	const order = req.order;
	const isOrderPaid = req.body.isOrderPaid;
	try {
		await Order.findByIdAndUpdate( order._id, { isOrderPaid: isOrderPaid }, { new: true } );
		return res.json( { msg: "Order payed" } );
	} catch ( err ) {
		return res.json( { err: "error" } );
	}
} );
router.put( "/:order/cancel", verifyToken, isFarmer, async( req, res )=>{
	const order = req.order;
	const isOrderCompleted = req.body.isOrderCompleted;
	
	try {
		await Order.findByIdAndUpdate( order._id, { isOrderCompleted: isOrderCompleted }, { new: true } );
		res.json( { msg: "Order canceled" } );
	} catch ( err ) {
		res.json( { err: "error" } );
	}
} );
router.put( "/:order/confirm", verifyToken, isFarmer, async( req, res ) => {

	const order = req.order;
	const items = order.items;
	const isOrderCompleted = req.body.isOrderCompleted;
	let validQuantity = true;
	try {
		
		for( let i = 0; i < items.length; i++ ){

			const itemID = items[i].item;
			const quantity = items[i].quantity;
			const product = await Product.findOne( { _id: itemID } );
			const itemQuantity = product.quantity;
			const newQuantity = itemQuantity - quantity;
			if ( newQuantity < 0 ){
				validQuantity = false;
				break;
				
			}else{
				await Product.findByIdAndUpdate( product._id, { quantity: newQuantity }, { new: true } );
			}
		}
		
		if( !validQuantity ){
			res.json( { err: "Invalid Quantity in the stock" } );
		}else{
			await Order.findByIdAndUpdate( order._id, { isOrderCompleted: isOrderCompleted }, { new: true } );
			res.json( { msg: "Order confirmed" } );
		}
		

	
	} catch ( err ) {
		res.json( { err: "error" } );
	}

} );
router.get( "/:order", verifyToken, isFarmer, orderControllers.getOrderById );

router.get( "/",verifyToken , isFarmer, orderControllers.getAllOrders );

router.get( "/:owner/orders",verifyToken , orderControllers.getOrders );

router.get( "/:owner/:order",verifyToken,isOrderOwner , orderControllers.getOrder );

router.post( "/:owner/create",verifyToken, orderControllers.createOrder );

module.exports = router;