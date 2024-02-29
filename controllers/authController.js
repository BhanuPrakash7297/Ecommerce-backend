
import { comparePassword, hashPassword } from '../helpers/authHelper.js';
import User from '../models/userModel.js';
import jwt from 'jsonwebtoken'
import orderModel from '../models/orderModel.js';
import twilio from 'twilio';
// import '../config.env'
// import '../config'
import dotenv from 'dotenv';
import { query } from 'express';
dotenv.config({ path: './config.env' });

import io from '../server.js'

// socket io implementation here

import { Server as socketIo } from 'socket.io'


console.log(process.env.TWILIO_ACCOUNT_ID);
const client = twilio(process.env.TWILIO_ACCOUNT_ID, process.env.TWILIO_AUTH_TOKEN);

const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceId = process.env.TWILIO_SERVICE_ID;
const accountId = process.env.TWILIO_ACCOUNT_ID;

export const registerConteroller = async (req, res) => {
    try {
        console.log(req.body);
        console.log("hello");
        const { name, email, password, phone, address, answer } = req.body;
        console.log(password);
        //validation 
        if (!name) {
            res.send({ message: "Name is required" });
        }
        if (!email) {
            res.send({ message: "Email is required" });
        }
        if (!password) {
            res.send({ message: "Password is required" });
        }
        if (!phone) {
            res.send({ message: "Phone number is required" });
        }
        if (!address) {
            res.send({ message: "address is required" });
        }
        if (!answer) {
            res.send({ message: "answer is required" });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(200).send({
                success: 'false',
                message: 'Already Registerd Please Login'
            })
        }

        const hashedPassword = await hashPassword(password);

        const user = await new User({
            name,
            email,
            password: hashedPassword,
            phone,
            address,
            answer
        }).save();


        res.status(201).send({
            success: true,
            message: 'Registerd Succesfully',
            user
        })
    }


    catch (err) {
        console.log(err);
        res.status(500).send({
            succuss: false,
            message: 'Error in Registration',
            err
        })
    }
};



export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(404).send({
                success: false,
                message: 'Invalid email or password'
            })
        }

        const user = await User.findOne({ email });
        console.log('user', user)

        if (!user) {
            return res.status(404).send({
                success: false,
                message: "Email is not registered"
            })
        }

        const match = await comparePassword(password, user.password);

        if (!match) {
            return res.status(200).send({
                success: false,
                message: 'Invalid Password'
            })
        }

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET_KEY, {
            expiresIn: '7d'
        });

        // console.log(token)
        res.status(200).send({
            success: true,
            message: 'Logged in succesfully',
            user: {
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role,
                id: user._id
            },
            token
        })
    }

    catch (err) {
        res.status(500).send({
            success: false,
            message: 'error in login',
            err
        });
    }
}


export const loginControllerByOtp = async (req, res) => {

    try {
        // console.log("numberererer", req.query.number)
        const number = req.number;

        // if (!email || !password) {
        //     return res.status(404).send({
        //         success: false,
        //         message: 'Invalid email or password'
        //     })
        // }

        const user = await User.findOne({ phone: number });
        console.log('user', user)
        // if (!user) {
        //     return res.status(404).send({
        //         success: false,
        //         message: "Email is not registered"
        //     })
        // }

        // const match = await comparePassword(password, user.password);

        // if (!match) {
        //     return res.status(200).send({
        //         success: false,
        //         message: 'Invalid Password'
        //     })
        // }

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET_KEY, {
            expiresIn: '7d'
        });

        // console.log(token)
        res.status(200).send({
            success: true,
            message: 'Logged in succesfully',
            user: {
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role
            },
            token
        })
    }

    catch (err) {
        res.status(500).send({
            success: false,
            message: 'error in login',
            err
        });
    }
}


export const testController = (req, res) => {
    res.send('protected route');
}


export const forgotPasswordController = async (req, res) => {
    try {
        console.log(req.body);
        const { email, newPassword, answer } = req.body;

        if (!email) {
            res.status(400).send({ message: 'Email is required !' });
        }
        if (!newPassword) {
            res.status(400).send({ message: 'newPassword is required !' });
        }
        if (!answer) {
            res.status(400).send({ message: 'answer is required !' });
        }

        const user = await User.findOne({ email, answer });

        if (!user) {
            return res.status(404).send({
                success: false,
                message: 'Wrong Email Or Password'
            });
        }

        const hashed = await hashPassword(newPassword);
        await User.findByIdAndUpdate(user._id, { password: hashed });

        res.status(200).send({
            success: true,
            message: 'Password reset succesfully'
        })
    }
    catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Something went wrong",
            error,
        });
    }

}


// user profile
export const updateProfileController = async (req, res) => {
    try {
        const { name, email, password, address, phone } = req.body;
        const user = await User.findById(req.user._id);
        //password
        if (password && password.length < 6) {
            return res.json({ error: "Passsword is required and 6 character long" });
        }
        const hashedPassword = password ? await hashPassword(password) : undefined;
        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            {
                name: name || user.name,
                password: hashedPassword || user.password,
                phone: phone || user.phone,
                address: address || user.address,
            },
            { new: true }
        );
        res.status(200).send({
            success: true,
            message: "Profile Updated SUccessfully",
            updatedUser,
        });
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: "Error WHile Update profile",
            error,
        });
    }
};







// orders

//orders
export const getOrdersController = async (req, res) => {
    try {
        const orders = await orderModel
            .find({ buyer: req.user._id })
            .populate("products", "-photo")
            .populate("buyer", "name");

        res.json(orders);
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error WHile Geting Orders",
            error,
        });
    }
};
//orders
export const getAllOrdersController = async (req, res) => {
    try {
        const orders = await orderModel
            .find({})
            .populate("products", "-photo")
            .populate("buyer", "name")
            .sort({ createdAt: "-1" });
        res.json(orders);
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error WHile Geting Orders",
            error,
        });
    }
};

//order status
export const orderStatusController = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status, userId, id } = req.body;
        const orders = await orderModel.findByIdAndUpdate(
            orderId,
            { status },
            { new: true }
        );

        const AllOrders = await orderModel.find();
        // io.emit("orderStatusUpdate", [orders]);

        res.json(AllOrders);
        console.log("All orders", AllOrders);
        req?.users[userId].emit("orderStatusUpdate", AllOrders);

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error While Updateing Order",
            error,
        });
    }
};



export const sendOtpController = async (req, res) => {

    try {
        console.log(req.user);
        const { phone } = req.user;

        const data = await client.
            verify.
            v2.
            services(serviceId)
            .verifications.create({
                to: `+91${phone}`,
                channel: "sms"
            })

        res.status(200).send({
            message: "otp has been send successfully",
            phone,
            user: data
        })
    }

    catch (err) {
        console.log(err);
        res.status(500).send({
            success: false,
            message: "Error While Updateing Order",
            err,
        });
    }

}



export const verifyOtpController = async (req, res, next) => {

    try {
        // const { code, phone } = req.body;
        const { code, phone } = req.query;

        console.log("code phone *********", code, phone);


        const { status } = await client.
            verify.
            v2.
            services(serviceId)
            .verificationChecks
            .create({
                to: `+91${phone}`,
                code: code
            });


        if (status === 'pending') {
            return res.status(400).send({
                success: false,
                message: 'Wrong Otp'
            })
        }
        req.number = phone;
        next();

    }

    catch (err) {
        console.log("verigy congroller error r", err);
        res.status(500).send({
            success: false,
            message: 'error'
        });
    }

}


export const orderNotificationController = async (req, res) => {
    try {

        const { number } = req.body;

        const data = await client.messages
            .create({
                body: 'you have rented a bike from here to here. Details: http://www.yummycupcakes.com/',
                from: `whatsapp:+14155238886`,
                to: `whatsapp:+91${number}`
            });

        res.status(200).send({
            message: 'booking successful',
            data
        })
    }

    catch (err) {
        console.log(err);
        res.status(500).send({
            success: false,
            message: 'error'
        })
    }
}






































































































































































































































































