import { Router } from 'express'
import authCtrl from '../controllers/auth.controller'
import userCtrl from '../controllers/user.controller'
import postCtrl from '../controllers/post.controller'

const router = Router()

router.route('/api/posts/feed/:userId').get(authCtrl.requireSignIn, postCtrl.listNewsFeed)
router.route('/api/post/by/:userId').get(authCtrl.requireSignIn, postCtrl.listByUser)
router.route('/api/posts/new/:userId').post(authCtrl.requireSignIn, postCtrl.create)
router.route('/api/posts/photo/:postId').get(postCtrl.photo)

router.param('userId', userCtrl.userById)
router.param('postId', postCtrl.postById)

export default router
