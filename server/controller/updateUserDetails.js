const getUserDetailsFromToken = require("../helpers/getUserDetailsFromToken.js");
const UserModel = require("../model/UserModel.js");

async function updateUserDetails(request, response) {
  try {
    const token = request.cookies.token || "";

    const user = await getUserDetailsFromToken(token);

    const { name, profile_pic } = request.body;

    const updateUser = await UserModel.updateOne(
      { _id: user._id },
      {
        name,
        profile_pic,
      }
    );

    const userInformation = await UserModel.findById(user._id);
    return response.status(200).json({
      message: "User Updated SuccessFull",
      data: userInformation,
      success: true,
    });
  } catch (error) {
    return response
      .status(400)
      .json({ message: error.message || error, error: true });
  }
}

module.exports = updateUserDetails;
