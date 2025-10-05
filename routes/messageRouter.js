import express from 'express'
import { addDismissMessageController, addDonationMessageController, addMessageController, getUserMessageController, messageCountController, updateMessageToSeenController } from '../controllers/messageController.js'
import jwtMiddleware from '../middlewares/jwtMiddleware.js'

const messageRouter=express.Router()

messageRouter.post('/',jwtMiddleware,addMessageController)
messageRouter.get('/',jwtMiddleware,getUserMessageController)
messageRouter.put('/:id',jwtMiddleware,updateMessageToSeenController)
messageRouter.post('/donation',jwtMiddleware,addDonationMessageController)
messageRouter.post('/dismiss',jwtMiddleware,addDismissMessageController)
messageRouter.post('/count',jwtMiddleware,messageCountController)

export default messageRouter   