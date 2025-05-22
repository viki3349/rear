import express from 'express'

import { userOrders, updateStatus, allOrders, placeOrder, placeOrderStripe, verifyStripe, cancelOrder, } from '../controllers/orderController.js'
import { protectAdminRoute, protectRoute } from '../middleware/auth.middleware.js';
import authUser from '../middleware/auth.js';
const orderRouter = express.Router();

orderRouter.post('/list', protectRoute, protectAdminRoute, allOrders)
orderRouter.post('/status', protectRoute, protectAdminRoute, updateStatus)
orderRouter.post('/place', authUser, placeOrder);
orderRouter.post('/stripe', authUser, placeOrderStripe);
orderRouter.post('/verifyStripe', authUser, verifyStripe);
orderRouter.post('/userorders', authUser, userOrders);
orderRouter.post('/cancelOrder', authUser, cancelOrder);
export default orderRouter;
