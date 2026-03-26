import "dotenv/config"
import app from "./app.js";
import dns from  "dns"
import connectDB from "./database/database.js";

dns.setServers(['8.8.8.8', '1.1.1.1']);

connectDB()
.then( async () => {

	app.on("error", (error)=>{
		console.log(`An error occured: ${error}`);
	})

	app.listen(process.env.PORT, ()=>{
        console.log(`started on ${process.env.PORT}`)
    })
}


)