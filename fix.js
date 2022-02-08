module.exports = {
        Fix: (variable) => {
        if(variable == true){
            return "Yes"
        } else if(variable == false){
            return "No"
        } else if(variable == undefined || variable == null){
            return "None"
        } else if(variable == '#000000' || variable == '#0'){
            return "None"
        }else return variable
    }
}