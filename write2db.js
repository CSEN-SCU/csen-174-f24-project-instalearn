const { writeCard, readData } = require("./database/firebase.js");
const { translateAndT2S } = require("./translator.js");

async function write2db() {
    try{
        const english = "child";
        const [portuguese, audio] = await translateAndT2S(english);
        await writeCard(english, english, portuguese, "idk", audio);
    }
    catch (err) {
        console.error("Error in writing to db:", err);
    }
    
}

write2db();
module.exports = { write2db };