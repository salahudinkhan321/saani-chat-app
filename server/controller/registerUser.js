const UserModel = require('../model/UserModel.js')
const bcryptjs = require('bcryptjs')


async function registerUser(request, response){
    try {
        
        const {name , email, password, profile_pic} = request.body;

        const checkEmail = await UserModel.findOne({email})

        if(checkEmail){
            return response.status(400).json({message: "User Already Exist", error: true})
        }

        // Salt is a random value added to a Password so to not result same 
        const salt = await bcryptjs.genSalt(10)
        const hashPassword = await bcryptjs.hash(password, salt)

        const payload = {
            name,
            email,
            password: hashPassword,
            profile_pic
        }

        const user = new UserModel(payload)
        const userSave = await user.save()

        return response.status(200).json({
            message: "User Created SuccessFully", 
            data: userSave,
            success: true
        })

    } catch (error) {
      return response.status(400).json({
        message: error.message || error ,
        error: true
      })
    }
}


module.exports = registerUser;