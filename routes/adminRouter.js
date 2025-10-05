import express from 'express'
import jwtMiddleware from '../middlewares/jwtMiddleware.js'
import { allClaimsController, allUserController, contactController, userController, warningController } from '../controllers/adminController.js'
// import { adminAllClaimsController } from '../controllers/claimController.js'

const adminRouter=express.Router()


adminRouter.get('/all-claims',jwtMiddleware,allClaimsController)
adminRouter.get('/all-users',jwtMiddleware,allUserController)
adminRouter.put('/user/:id',jwtMiddleware,userController)
adminRouter.post('/warning',jwtMiddleware,warningController)
adminRouter.post('/contact',contactController)

export default adminRouter