async function logout(request, response) {
    try {
        const cookieOptions = {
            http : true,
            secure : true
        }
        return response.status(200).cookie('token', cookieOptions).json({message: 'Session Out', success: true})
    } catch (error) {
        return response.status(400).json({message: error.message || error, error: true})
    }
}

module.exports = logout
