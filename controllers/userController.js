const User = require('../models/userModel');

const asyncHandler = require('express-async-handler');


// Create a User --------------------------------------------
const createUser = asyncHandler(async (req, res) => {
    //TODO:Get the email from req.body
    const email = req.body.email;
//TODO : with the help of email find the user exists or not
    const findUser = await User.findOne({ email });
    
    if (!findUser) {
        const newUser = await User.create(req.body);
        res.json(newUser);
    } else {
        throw new Error('User already exists');
    }

});

//TODO: Create a login user function --------------------------------------
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    
    // Check if user exists
    const findUser = await User.findOne({ email });
    if (findUser && (await findUser.isCorrectPassword(password))) {
        res.json({
            _id: findUser?._id,
            firstname: findUser?.firstname,
            lastname: findUser?.lastname,
            email: findUser?.email,
            mobile: findUser?.mobile,
            token: findUser?.generateToken(findUser?._id),
        });
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
});




module.exports = {
    createUser,
    loginUser,
};



