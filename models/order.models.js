
var mongoose = require( "mongoose" );
var Schema = mongoose.Schema;
const uniqueValidator = require( "mongoose-unique-validator" );

var OrderSchema = new Schema( {
	owner: { type: Schema.Types.ObjectId, ref: "User" },
	total: { type: Number, default: 0 },
	items: [ {
		item: { type: Schema.Types.ObjectId, ref: "Product" },
		quantity: { type: Number, default: 1 },
		price: { type: Number, default: 0 },
	} ],
	address: String,
	orderDate: { type: Date, default: Date.now() },
	paymentType: { type: String, default: "Paiement à la livraison" },
	isOrderCompleted: { type: Number, default: 2 }, // 0 canceled, 1 completed , 2 pending
	isOrderPaid : { type: Boolean, default:false },
	orderNumber: { type: Number, index: true, unique: true }
} ,{ timestamps: true } );
OrderSchema.plugin( uniqueValidator, { message: "is already taken." } );

OrderSchema.pre( "validate", function( next ){
	if( !this.orderNumber )  {
		this.orderNumber = Math.floor( Math.random() * Math.pow( 36, 6 ) | 0 );
	}
	next();
} );
module.exports = mongoose.model( "Order", OrderSchema ) || mongoose.models.Order;