const helpers = {};


helpers.profesor = function(user){
    if (user == "profesor") {
    
        return true;
    }
    else {
        
        return false;
    }
}

helpers.alumno = function(user){
    if (user == "alumno") {
    
        return true;
    }
    else {
        
        return false;
    }
}

helpers.coordinador = function(user){
    if (user == "coordinador") {
    
        return true;
    }
    else {
        
        return false;
    }
}



module.exports = helpers;