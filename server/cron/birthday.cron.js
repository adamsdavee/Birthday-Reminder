const cron = require("node-schedule")
const User = require("../models/user.model")
const transporter = require("../config/mailer")
const { birthdayTemplate } = require("../utils/emailTemplate")

cron.scheduleJob("*/10 * * * * *", async () => {
   console.log("Running birthday cron...")

   const today = new Date()
   const month = today.getMonth()
   const day = today.getDate()

   try {
      const users = await User.find()

      console.log(users)

      const celebrants = users.filter((user) => {
         const dob = new Date(user.dateOfBirth)
         return dob.getMonth() === month && dob.getDate() === day
      })

      for (let user of celebrants) {
         await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: "🎉 Happy Birthday!",
            html: birthdayTemplate(user.username),
         })

         console.log(`Email sent to ${user.email}`)
      }
   } catch (err) {
      console.error("Cron error:", err)
   }
})
