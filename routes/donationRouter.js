import express from 'express'
import { createOrderController, failedController, getAllDonationController, verifyController } from '../controllers/donationController.js'
import jwtMiddleware from '../middlewares/jwtMiddleware.js'

const donationRouter=express.Router()

donationRouter.post('/create-order',jwtMiddleware,createOrderController)
donationRouter.post('/verify',jwtMiddleware,verifyController)
donationRouter.post('/failed',jwtMiddleware,failedController)
donationRouter.get('/',jwtMiddleware,getAllDonationController)
export default donationRouter