
const jwt = require('jsonwebtoken');
module.exports.checkMe = (token) => {
    var check=false;
    jwt.verify(token, 'thatsmimo', function(err, decoded) {
        if (err){
            check= false;
            
        }else{
            check= true;
        } 
       
    });
    return check;
}
