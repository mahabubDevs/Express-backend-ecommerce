const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    shippingInfo: {
        firstname: {
            type: String,
            required: true
        },
        lastname: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true
        },
        pinCode: {
            type: Number,
            required: true
        },
        phoneNo: {
            type: Number,
            required: true
        },
        other: {
            type: String,
            default: ''
        }
    },
    paymentInfo: {
        orderId: {
            type: String,
            required: true
        },
        paymentId: {
            type: String,
            required: true
        },
    },
    orderItems: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            color: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Color',
                required: true
            },
            quantity: {
                type: Number,
                required: true
            },
            size: {
                type: String,
                required: true
            },
            price: {
                type: Number,
                required: true
            },

        }
    ],
    paidAt: {
        type: Date,
        default: Date.now
    },
    month: {
        type: Number,
        default: new Date().getMonth() + 1
    },
    totalPrice: {
        type: Number,
        required: true
    },
    totalPriceAfterDiscount: {
        type: Number,
        default: 0
    },
    orderStatus: {
        type: String,
        default: 'Processing',
        enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled']
    },

},
    { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);