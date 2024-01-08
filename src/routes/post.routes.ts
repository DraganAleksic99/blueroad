import { Router } from 'express'
import authCtrl from '../controllers/auth.controller'
import userCtrl from '../controllers/user.controller'
import postCtrl from '../controllers/post.controller'

const router = Router()

router.route('/api/posts/feed/:userId').get(authCtrl.requireSignIn, postCtrl.listNewsFeed)
router.route('/api/post/by/:userId').get(authCtrl.requireSignIn, postCtrl.listByUser)

router.param('userId', userCtrl.userById)

export default router
