const User = require("../models/user.model")
const { schema } = require("../utils/validation")

exports.createUser = async (req, res) => {
   try {
      const { error } = schema.validate(req.body)
      if (error) {
         return res.status(400).json(error.details)
      }

      const user = await User.create(req.body)

      res.status(201).json({
         message: "User added successfully",
         user,
      })
   } catch (err) {
      if (err.code === 11000) {
         return res.status(400).json({
            message: "Email already exists",
         })
      }

      res.status(500).json({ error: err.message })
   }
}
