import express from 'express'
import jwtMiddleware from '../middlewares/jwtMiddleware.js'
import { addClaimController, getAllClaimsController, updateClaimController } from '../controllers/claimController.js'

const claimRouter=express.Router()

claimRouter.post('/add-claim',jwtMiddleware,addClaimController)
claimRouter.get('/all-claims',jwtMiddleware,getAllClaimsController)
claimRouter.put('/update-claim/:id',jwtMiddleware,updateClaimController)

export default claimRouter