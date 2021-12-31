const mongoose = require( "mongoose" );
const uniqueValidator = require( "mongoose-unique-validator" );
const Schema = mongoose.Schema;

const ProductSchema = new Schema( {

	productName:{ type: String, min: 6, max: 255, index: true, required: true },
	description:{ type: String, },
	price: { type: Number, required: true, default:0 },
	productImage: { type: String, default: "", required: true },
	quantity: { type: Number, required: true, default:0 },
	type: { type: String, required:true },
	unit: { type: String, required:true },
	farmer: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
},{ timestamps: true } );

ProductSchema.plugin( uniqueValidator, { message: "is already taken." } );

module.exports = mongoose.model( "Product", ProductSchema ) || mongoose.models.Product;