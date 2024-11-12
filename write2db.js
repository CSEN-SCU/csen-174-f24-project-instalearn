import { writeCard } from "./databaseServices.js";
import { translateAndT2S } from "./public/translator.js";

export async function write2db(word) {
    try{
        const english = word;
        const [portuguese, audio] = await translateAndT2S(english);
        await writeCard(english, english, portuguese, "idk", audio);
    }
    catch (err) {
        console.error("Error in writing to db:", err);
    }
}

//write2db("apple");
//write2db("orange");