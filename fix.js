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
        } else if(variable == "NONE") {
            return "None"
        } else return variable
    },
        fixTier: (variable) => {
            if(variable == "NONE"){
                return "None"
            } else {
                let words = variable.split("_")
                let combined = []
                for(j=0; j<words.length; j++){
                    let word = words[j].toLowerCase()
                    combined.push(word[0].toUpperCase()+word.substring(1))
                }
                return combined.join(" ")
            }
    },
        fixVanity: (variable) => {
            if(variable == null){
                return "None"
            } else{
                return `[discord.gg/${variable}](https://discord.gg/${variable})`
            }
        }
}