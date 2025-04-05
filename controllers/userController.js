const User = require('../models/userModel');

const asyncHandler = require('express-async-handler');
const { generateToken } = require('../utils/config/jwtToken');
const { generateRefreshToken } = require('../utils/config/refreshToken');


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
        //refresh token
        const refreshToken = await generateRefreshToken(findUser?._id);
        const updateUser = await User.findByIdAndUpdate(
            findUser?._id,
            { refreshToken: refreshToken },
            { new: true, runValidators: true }
        );
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000, // 3 days
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        });
        res.json({
            _id: findUser?._id,
            firstname: findUser?.firstname,
            lastname: findUser?.lastname,
            email: findUser?.email,
            mobile: findUser?.mobile,
            token: generateToken(findUser?._id),
        });
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
});

//check cookies
const cookies = (req, res) => {
    const cookies = req.cookies;
    console.log(cookies);
    res.json(cookies);
};




module.exports = {
    createUser,
    loginUser,
    cookies,
};



