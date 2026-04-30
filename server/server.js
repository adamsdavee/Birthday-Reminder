require("dotenv").config()
const connectDB = require("./config/db")
const app = require("./app")
const { birthday_job } = require("./cron/birthday.cron")

// start cron
birthday_job()

connectDB()

app.listen(5000, () => {
   console.log("Server running on port 5000")
})
