const express = require('express')

const app= express()
app.use(express.json())
app.get('/',(req,res)=>{
    res.send("App Running ")
})

// Previous API Routes 
const apiRoutes =require("./routes/api.routes");

app.use("/api", apiRoutes);


// Weather Routes 
const weatherRoutes = require("./routes/weather.routes");
app.use("/api/weather", weatherRoutes)


module.exports=app