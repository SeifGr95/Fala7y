module.exports = function ( req, res, next ){
	const user = req.user;
	if( user.role )
		next();
	else{
		res.status( 403 ).json( { message: "Forbidden access, only Admin" } );
	}
};