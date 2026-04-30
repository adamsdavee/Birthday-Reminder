const cron = require("node-schedule")
const User = require("../models/User")
const transporter = require("../config/mailer")
const { birthdayTemplate } = require("../utils/emailTemplate")

// runs at 7:00 AM every day
const birthday_job = cron.schedule("0 7 * * *", async () => {
   console.log("Running birthday cron...")

   const today = new Date()
   const month = today.getMonth()
   const day = today.getDate()

   try {
      const users = await User.find()

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

module.exports = { birthday_job }
