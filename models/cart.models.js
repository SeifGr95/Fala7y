
var mongoose = require( "mongoose" );
var Schema = mongoose.Schema;

var CartSchema = new Schema( {
	owner: { type: Schema.Types.ObjectId, ref: "User" },
	total: { type: Number, default: 0 },
	items: [ {
		item: { type: Schema.Types.ObjectId, ref: "Product" },
		quantity: { type: Number, default: 1 },
		price: { type: Number, default: 0 },
	} ],
	deliveryPrice: { type: Number, default: 5 }
} ,{ timestamps: true } );

CartSchema.methods.emptyCart = function(){
	this.total = 0;
	this.items = [];
	return this.save();
};
module.exports = mongoose.model( "Cart", CartSchema ) || mongoose.models.Cart;