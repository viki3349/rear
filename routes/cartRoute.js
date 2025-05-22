import express from 'express'
import { addtoCart,updateCart,getUserCart } from '../controllers/cartContoller.js'
import authUser from '../middleware/auth.js';

const cartRouter = express.Router();

cartRouter.post('/get', authUser, getUserCart)
cartRouter.post('/add', authUser, addtoCart)
cartRouter.post('/update', authUser, updateCart)

export default cartRouter;