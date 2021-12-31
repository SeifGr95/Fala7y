const Order = require( "../models/order.models" );
const Cart = require( "../models/cart.models" );
const createOrder = async( req, res )=>{

	const order = new Order( {
		owner: req.body.owner,
		items: req.body.items,
		address: req.body.address,
		total: req.body.total
	} );
	try {
		const savedOrder = await order.save();
		const cartEmpty = await Cart.findOne( { owner: savedOrder.owner } );
		cartEmpty.emptyCart();
		return res.json( savedOrder );
	} catch ( err ) {
		return res.json( err );
	}
};

const getOrder = async( req, res )=>{

	const order = req.order;

	try{
		return res.json( order );

	}catch( err ){
		res.json( { err_message: err } );
	}
};


const getOrders = async ( req, res ) => {
	const owner = req.owner;

	const pagination = req.query.pagination ? parseInt( req.query.pagination ) : 100;
	const page = req.query.page ? parseInt( req.query.page ) : 1 ;
	try{
		const count = await Order.find( { owner: owner._id } ).countDocuments();
		const pages = ( pagination > 0 ) ? ( Math.ceil( count / pagination ) || 1 ) : null;
		const hasNextPage = ( page < pages ) ? true : false;
		const hasPreviousPage = ( page > 1 ) ? true: false;
		const nextPage = ( hasNextPage ) ? page + 1 : null;
		const previousPage = ( hasPreviousPage ) ? page - 1 : null;
		const orders = await Order.find( { owner: owner._id } ).skip( ( page - 1 ) * pagination ).limit( pagination ).populate( { path: "owner", select:[ "firstName", "lastName", "phoneNumber" ] } );
		return res.json( { orders: orders, count: count, nextPage: nextPage, previousPage: previousPage, hasNextPage: hasNextPage, hasPreviousPage: hasPreviousPage, pages: pages, page: page } );
	}catch( err ){
		throw res.json( { err_message: err } );
	}
};

const getAllOrders = async ( req, res ) => {
	const pagination = req.query.pagination ? parseInt( req.query.pagination ) : 100;
	const page = req.query.page ? parseInt( req.query.page ) : 1 ;
	try{
		const count = await Order.find().countDocuments();
		const pages = ( pagination > 0 ) ? ( Math.ceil( count / pagination ) || 1 ) : null;
		const hasNextPage = ( page < pages ) ? true : false;
		const hasPreviousPage = ( page > 1 ) ? true: false;
		const nextPage = ( hasNextPage ) ? page + 1 : null;
		const previousPage = ( hasPreviousPage ) ? page - 1 : null;
		const orders = await Order.find().populate(
			{ path: "owner", select:[ "firstName", "lastName" ] } ).skip( ( page - 1 ) * pagination ).limit( pagination ).populate( "items.item" );
		return res.json( { orders: orders, count: count, nextPage: nextPage, previousPage: previousPage, hasNextPage: hasNextPage, hasPreviousPage: hasPreviousPage, pages: pages, page: page } );
	}catch( err ){
		throw res.json( { err_message: err } );
	}
};

const getOrderById = async( req, res )=>{

	const order = req.order;
	try{
		const orders = await Order.findById( order._id ).populate(
			{ path: "owner", select:[ "firstName", "lastName", "phoneNumber" ] } ).populate( { path: "items.item", select:[ "productName", "description", "productImage", "quantity", "unit" ] } );
		return res.json( orders );
	}catch( err ){
		throw res.json( { err_message: err } );
	}
};
module.exports.getOrderById = getOrderById;
module.exports.getAllOrders = getAllOrders;
module.exports.createOrder = createOrder;
module.exports.getOrder = getOrder;
module.exports.getOrders = getOrders;