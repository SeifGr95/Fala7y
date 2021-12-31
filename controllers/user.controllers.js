const User = require( "../models/user.models" );

const getUsers = async( req, res )=>{

	try {
		const users = await User.find();
		users.forEach( ( user )=>{return res.json( user.authToJSON() );} );
	} catch ( err ) {
		return res.json( err );
	}
};
const getUser = async( req, res )=>{

	const id = req.body.id;

	try {
		const user = await User.findById( id );
		return res.json( user.authToJSON() );
	} catch ( err ) {
		return res.json( err );
	}
};

const updateUser = async( req, res )=>{
	const id = req.body.id;
	try {
		const dataToUpdate = req.body;
		const { ...updateData } = dataToUpdate;
		const updateUser = await User.findOneAndUpdate( id, updateData, { new :true } );
		return res.json( updateUser );
	} catch ( err ) {
		return res.json( err );
	}
};

const deleteUser = async( req, res )=>{
	const id = req.body.id;

	try {
		const deleteUser = await User.findByIdAndDelete( id );
		return res.json( deleteUser );
	} catch ( err ) {
		return res.json( err );
	}
};
module.exports.getUser = getUser;
module.exports.getUsers = getUsers;
module.exports.updateUser = updateUser;
module.exports.deleteUser = deleteUser;