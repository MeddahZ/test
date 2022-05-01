const express = require('express')
require('./db/mongoose')
//const { update } = require('./models/user')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
const port = process.env.PORT

// app.use((req, res, next) => {
//     res.status(503).send('server under maintenance.')
// })

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)


app.listen(port , () => {
    console.log('server is up on port '+ port)
})


// const multer = require('multer')

// const upload = multer({
//     dest: 'images',
//     limits: {
//         fileSize: 1000000
//     },
//     fileFilter(req, file, cb) {
//         if (!file.originalname.match(/\.(doc|docx)$/)) {
//             return cb(new Error('File must be a word document'))
//         }
//         cb(undefined, true)

//     }
// })

// app.post('/upload', upload.single('upload'), (req,res) => {
//     res.send()
// })
