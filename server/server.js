require("dotenv").config()
const { connectToMongoDB } = require("./config/db")
const app = require("./app")

// start cron
require("./cron/birthday.cron")

connectToMongoDB()

app.listen(3000, () => {
   console.log("Server running on port 3000")
})
