const router = require( "express" ).Router();
const cartControllers = require( "../controllers/cart.controllers" );
const Cart = require( "../models/cart.models" );
const User = require( "../models/user.models" );
const verifyToken = require( "../utils/verifyToken" );
const isCartOwner = require( "../utils/isCartOwner" );
router.param( "cart", async( req, res,next, id )=>{
	try{
		const cart = await Cart.findOne( { _id: id } ).populate( { path: "owner", select:"_id" } ).populate( { path: "items.item", select:[ "productName","description", "productImage", "quantity" ] } );
		if( !cart ) return res.sendStatus( 404 );
		req.cart = cart;
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


router.put( "/:owner/:cart/additem", verifyToken,isCartOwner, async( req, res )=>{

	const items = {
		item: req.body.item,
		quantity: req.body.quantity,
		price: req.body.price,
	} ;
	const currentItem=req.cart.items;
	const itemIndex=currentItem.findIndex( ( elm )=>elm.item._id==req.body.item ) ;
	if( itemIndex==-1 )
	{
		await req.cart.items.push( items );
		await req.cart.save();
		return res.json( { msg: "item added successfully" } );
	}else{
		currentItem[itemIndex].quantity+=req.body.quantity;
		const newItems=currentItem;
		await Cart.findByIdAndUpdate( req.cart._id,{ items:newItems }, { new: true } ) ;
		res.json( { msg: "item added successfully" } );
	}
} );
router.put( "/:owner/:cart/removeitem", verifyToken,isCartOwner, async( req, res )=>{

	const item = req.body.item;
	const cart = req.cart;
	await Cart.findByIdAndUpdate( cart._id, { $pull: { "items": {  item: item } } }, { new : true } );
	await req.cart.save();
	return res.json( { msg: "item deleted successfully" } );
} );
router.put( "/:owner/:cart/updatequantity", verifyToken,isCartOwner, async( req, res )=>{

	const total = req.body.total;
	let currentItem=req.cart.items;
	let itemIndex=currentItem.findIndex( ( elm )=>elm.item._id==req.body.item ) ;
	if( itemIndex==-1 )
	{
		res.json( { msg: "Item Not Found" } );
	}else{
		currentItem[itemIndex].quantity=req.body.quantity;
		const newItems=currentItem;
		await Cart.findByIdAndUpdate( req.cart._id,{ items:newItems, total:total }, { new: true } ) ;
		res.json( { msg: "Quantity updated successfully" } );
	}
	
} );
router.get( "/:owner/:cart/countitem", verifyToken, isCartOwner, async ( req, res )=>{

	const items = req.cart.items;
	const count = items.length;
	res.json( { cartItemCount: count } );
} );
router.get( "/:owner/:cart",verifyToken,isCartOwner, cartControllers.getCart );

router.put( "/:owner/:cart/update", verifyToken,isCartOwner, cartControllers.updateCart );
router.put( "/:owner/:cart/delete", verifyToken,isCartOwner, cartControllers.deleteCart );
module.exports = router;
