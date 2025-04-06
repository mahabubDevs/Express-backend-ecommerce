const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const { generateToken } = require('../utils/config/jwtToken');
const validateMongoDbId = require('../utils/validateMongoDBId');
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
        findUser.refreshToken = refreshToken;
        await findUser.save();
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



// admin login --------------------------------------------------
const adminLogin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const findAdmin = await User.findOne({ email });
    if (findAdmin.role !== 'admin') {
        res.status(401);
        throw new Error('Not an Authorized');
    }
    if (findAdmin && (await findAdmin.isCorrectPassword(password))) {
        //refresh token
        const refreshToken = await generateRefreshToken(findAdmin?._id);
        const updateUser = await User.findByIdAndUpdate(
            findAdmin?._id,
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
            _id: findAdmin?._id,
            firstname: findAdmin?.firstname,
            lastname: findAdmin?.lastname,
            email: findAdmin?.email,
            mobile: findAdmin?.mobile,
            token: generateToken(findAdmin?._id),
        });
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
});

//handle refresh token -----------------------------------------------
const handleRefreshToken = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    if (!cookie?.refreshToken) {
        res.status(401);
        throw new Error('No refresh token in cookies');
    }
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken });
    if (!user) {
        res.status(403);
        throw new Error('Refresh token not matched');
    }
    //check jwt token
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
        if (err || user.id !== decoded.id) {
            res.status(403);
            throw new Error('Refresh token not matched');
        }
        const accessToken = generateToken(user?._id);
        res.json({ accessToken });
    });
});

// logout functionality -----------------------------------------
const logout = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    if (!cookie?.refreshToken) {
        res.status(204).json({ message: "No cookie found" });
    }
;
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken });
    if (!user) {
        res.clearCookie("refreshToken",
            { httpOnly: true, sameSite: "strict" }
        );
        return res.sendStatus(204);
    }
    await User.findOneAndUpdate({refreshToken}, {
        refreshToken: "",
    });
    res.clearCookie("refreshToken",
        { httpOnly: true, sameSite: "strict" }
    );
    res.sendStatus(204);
});

// update a user not working ----------------------------------------
const updateUser = asyncHandler(async (req, res) => {
    const { _id } = req.params;
    validateMongoDbId(_id);

    try {
        const updatedUser = await User.findByIdAndUpdate(
            _id,
            {
                firstname: req?.body?.firstname,
                lastname: req?.body?.lastname,
                email: req?.body?.email,
                mobile: req?.body?.mobile,
            },
            {
                new: true,
            }
        );
        res.json(updatedUser);
    } catch (error) {
        next(error);
    }
});






module.exports = {
    createUser,
    loginUser,
    adminLogin,
    handleRefreshToken,
    logout,
    updateUser,
};



