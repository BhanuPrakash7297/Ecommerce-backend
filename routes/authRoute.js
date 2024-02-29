
import express from 'express';
import { registerConteroller, loginController, testController, forgotPasswordController, updateProfileController, getOrdersController, getAllOrdersController, orderStatusController, sendOtpController, verifyOtpController, orderNotificationController, loginControllerByOtp } from '../controllers/authController.js';
import { isAdmin, requireSignIn, isValidNumber, verifyOtp } from '../middlewares/authMiddleware.js';
// import { verify } from 'jsonwebtoken';
const router = express.Router();

router.post('/register', registerConteroller);

router.post('/login', loginController);

//login using otp

router.post('/login/sendOtp', isValidNumber, sendOtpController);

router.post('/login/verifyOtp', verifyOtpController, loginControllerByOtp);

// router.post('/getconfirm', orderNotificationController);
//protected route

router.get('/user-auth', requireSignIn, (req, res) => {
    res.status(200).send({ ok: true });
});
router.get('/admin-auth', requireSignIn, isAdmin, (req, res) => {
    res.status(200).send({ ok: true });
});

// use profilce

router.put("/profile", requireSignIn, updateProfileController);

router.post("/forgot-password", forgotPasswordController);

router.get('/test', requireSignIn, isAdmin, testController);


//orders

router.get("/orders", requireSignIn, getOrdersController);

//all orders

router.get("/all-orders", requireSignIn, isAdmin, getAllOrdersController);

// order status update

router.put(
    "/order-status/:orderId",
    requireSignIn,
    isAdmin,
    orderStatusController
);

export default router;





