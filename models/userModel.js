const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { type } = require("os");

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: [true, "Please provide your first name"],
        trim: true,
        maxlength: [20, "First name cannot be more than 20 characters"],
        minlength: [3, "First name cannot be less than 3 characters"],
    },
    lastname: {
        type: String,
        required: [true, "Please provide your last name"],
        trim: true,
        maxlength: [20, "Last name cannot be more than 20 characters"],
        minlength: [3, "Last name cannot be less than 3 characters"],
    },
    email: {
        type: String,
        required: [true, "Please provide your email"],
        unique: true,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "Please provide a valid email",
        ],
    },
    mobile: {
        type: String,
        required: [true, "Please provide your mobile number"],
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
        minlength: 6,
        select: false,
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },
    cart: {
        type: Array,
        default: [],
    },
    address: {
        type: String,
        default: "",
    },
    wishlist: {
        type: [{type: mongoose.Schema.Types.ObjectId, ref: "Product"}],
    },
    passwordChangedAt: Date,

    resetPasswordToken: String,
    resetPasswordExpire: Date,

    verificationToken: String,
    verificationTokenExpire: Date,


},
{
    timestamps: true,
    });


// Hash password before saving to database
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Compare password
userSchema.methods.isCorrectPassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};


//JWT token generation
userSchema.methods.getJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_TIME,
    });
};

// Generate password reset token
userSchema.methods.getResetPasswordToken = function () {
    // Generate token
    const resetToken = crypto.randomBytes(20).toString("hex");
    // Hash token and set to resetPasswordToken field
    this.resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
    this.resetPasswordExpire = Date.now() + 30 * 60 * 1000; // 30 minutes
    return resetToken;
};

//Email verification token
userSchema.methods.getVerificationToken = function () {
    // Generate token
    const verificationToken = crypto.randomBytes(20).toString("hex");
    // Hash token and set to verificationToken field
    this.verificationToken = crypto
        .createHash("sha256")
        .update(verificationToken)
        .digest("hex");
    this.verificationTokenExpire = Date.now() + 30 * 60 * 1000; // 30 minutes
    return verificationToken;
};


module.exports = mongoose.model("User", userSchema);

// // Check if user is blocked
// userSchema.methods.isBlocked = function () {
//     return this.isBlocked;
// };
// // Check if user is admin
// userSchema.methods.isAdmin = function () {
//     return this.role === "admin";
// };

// // Check if user is in cart
// userSchema.methods.isInCart = function (productId) {
//     return this.cart.some((item) => item.product.toString() === productId.toString());
// };
// // Check if user is in wishlist
// userSchema.methods.isInWishlist = function (productId) {
//     return this.wishlist.some((item) => item.toString() === productId.toString());
// };

