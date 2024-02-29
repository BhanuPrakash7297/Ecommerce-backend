import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import dotenv from 'dotenv';


// protected routes

export const requireSignIn = async (req, res, next) => {
    try {
        console.log(req.headers.authorization);
        // const bearerHeader = req.headers.authorization;
        // var parts = bearerHeader.split(' ');
        const decode = jwt.verify(req.headers.authorization, process.env.JWT_SECRET_KEY);
        req.user = decode;
        next();
    } catch (err) {
        console.log(err);
    }
}



export const isAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);

        if (user.role != 1) {
            return res.status(401).send({
                success: false,
                message: 'unAuthorized Access'
            });
        }

        else {
            next();
        }
    }

    catch (err) {
        console.log(err);

        res.status(401).send({
            success: false,
            err,
            message: "Error in admin middelware",
        });
    }
}


export const isValidNumber = async (req, res, next) => {
    try {

        const { phone } = req.body;
        console.log(phone)
        const user = await User.findOne({ phone });
        if (!user) {
            return res.status(401).send({
                success: false,
                message: 'Please Enter Correct Number'
            })
        }

        req.user = user;
        next();
    }

    catch (err) {
        console.log(err);
        res.status(500).send({
            success: false,
            err,
            message: "Error in admin middelware",
        });
    }
}


export const verifyOtp = async (req, res, next) => {
    try {
        console.log("phone code", phone, code);
        const code = req.code;
        const number = res.number;


        const { status } = await client.
            verify.
            v2.
            services(serviceId)
            .verificationChecks
            .create({
                to: `+91${number}`,
                code: code
            });

        if (status === 'pending') {
            return res.status(400).send({
                success: false,
                message: 'valid otp here'
            })
        }

        next();

    }


    catch (err) {
        console.log(err);
        res.status(500).send({
            success: false,
            message: 'error'
        });
    }

}