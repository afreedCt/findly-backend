import express from 'express'
import { addPostReportController, addUserReportController, dismissController, getAllReportsController, updateReportController } from '../controllers/reportController.js'
import jwtMiddleware from '../middlewares/jwtMiddleware.js'

const reportRouter=express.Router()

reportRouter.post('/post',jwtMiddleware,addPostReportController)
reportRouter.post('/user',jwtMiddleware,addUserReportController)
reportRouter.get('/',jwtMiddleware,getAllReportsController)
reportRouter.put('/dismiss/:id',jwtMiddleware,dismissController)
reportRouter.put('/update/:id',jwtMiddleware,updateReportController)
export default reportRouter