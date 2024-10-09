const UserModel = require("../model/UserModel");

async function searchUser(request, response) {
    try {
        const { search } = request.body;
        
        // Create a regular expression for searching
        const query = new RegExp(search, "i", "g");

        // Execute the query and await the result
        const users = await UserModel.find({
            "$or": [
                { name: query },
                { email: query }
            ]
        }).select("-password")

        // Return the results in the response
        return response.json({ message: "All Users", data: users, success: true });

    } catch (error) {
        // Return an error response if something goes wrong
        return response.status(400).json({ message: error.message || error, error: true });
    }
}

module.exports = searchUser;
