const mongoose = require( "mongoose" );
const uniqueValidator = require( "mongoose-unique-validator" );
const Schema = mongoose.Schema;

const UserSchema = new Schema( {
	userName: { type: String, unique: true, required: true, index:true, min: 6, max: 128 },
	firstName: { type: String, max: 64 },
	lastName: { type:String, max: 64 },
	email: { type: String, required:[ true, "can't be blank" ], index:true, lowercase: true, unique: true, },
	password: { type: String, required: [ true, "can't be blank" ], max: 1024 },
	phoneNumber: { type: Number },
	address: { type: String },
	isFarmer: { type: Boolean, default: false },
	isAdmin:{ type: Boolean, default: false },
	cart: { type: mongoose.Schema.Types.ObjectId, ref: "Cart" }
}, { timestamps: true } );

UserSchema.plugin( uniqueValidator, { message: "is already taken." } );

UserSchema.methods.profileToJSON = function(){

	return {
		username: this.username,
		firstName: this.firstName,
		lastName: this.lastName,
		phoneNumber: this.phoneNumber,
		address: this.address
	};
};


UserSchema.methods.authToJSON = function(){
	return {
		_id : this._id,
		username: this.username,
		email: this.email,
		isFarmer: this.isFarmer,
		cart:this.cart,
		address: this.address,
		firstName: this.firstName,
		lastName: this.lastName
	};
};

module.exports = mongoose.model( "User", UserSchema ) || mongoose.models.User;