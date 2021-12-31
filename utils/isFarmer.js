module.exports = function ( req, res, next ){
	const user = req.user;
	if( user.isFarmer )
		next();
	else{
		res.status( 403 ).json( { message: "Forbidden access" } );
	}
};