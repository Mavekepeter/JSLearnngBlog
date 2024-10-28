import express from 'express'
const router = express.Router()
import {verifyToken} from '../utils/verifyUser.js'
import {createComment,getPostComments,likeComment,editComment,deleteComment,getComments} from '../controllers/comment.js'
router.post('/create',verifyToken,createComment)
router.get('/getpostComments/:postId',getPostComments)
router.put('/likeComment/:commentId',verifyToken,likeComment);
router.put('/editComment/:commentId',verifyToken,editComment);
router.delete('/deleteComment/:commentId',verifyToken,deleteComment);
router.get('/getcomments',verifyToken,getComments)


export default router