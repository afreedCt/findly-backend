import multer from 'multer'
const storage=multer.diskStorage({
    destination:(req,files,callback)=>{
        callback(null,'./uploads')
    },
    filename:(req,files,callback)=>{
        callback(null,`findly-image-${Date.now()}-${files.originalname}`)
    }
})

const multerMiddleware=multer({storage})
export default multerMiddleware 