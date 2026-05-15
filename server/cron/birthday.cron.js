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

      const now = new Date()

      const celebrants = users.filter((user) => {
         const dob = new Date(user.dateOfBirth)

         return (
            dob.getUTCMonth() === now.getUTCMonth() &&
            dob.getUTCDate() === now.getUTCDate()
         )
      })

      console.log("Celebrants:", celebrants)
      console.log("Count:", celebrants.length)

      for (let user of celebrants) {
         try {
            console.log("Sending to:", user.email)

            const info = await transporter.sendMail({
               from: process.env.EMAIL_USER,
               to: user.email,
               subject: "🎉 Happy Birthday!",
               html: birthdayTemplate(user.username),
            })

            console.log("Email sent:", user.email)
            console.log("Message ID:", info.messageId)
         } catch (err) {
            console.error("EMAIL FAILED:", user.email)
            console.error(err)
         }
      }
   } catch (err) {
      console.error("Cron error:", err)
   }
})
