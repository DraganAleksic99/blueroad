import { Router } from 'express'
import userCtrl from '../controllers/user.controller'
import authCtrl from '../controllers/auth.controller'

const router = Router()

router.route('/api/users').get(userCtrl.list).post(userCtrl.create)

router
  .route('/api/users/:userId')
  .get(authCtrl.requireSignIn, userCtrl.read)
  .put(authCtrl.requireSignIn, authCtrl.hasAuthorization, userCtrl.update)
  .delete(authCtrl.requireSignIn, authCtrl.hasAuthorization, userCtrl.remove)

router.param('userId', userCtrl.userById)

router.route('/api/users/photo/:userId').get(userCtrl.photo, userCtrl.defaultPhoto)
router.route('/api/defaultPhoto').get(userCtrl.defaultPhoto)

router.route('/api/follow').put(authCtrl.requireSignIn, userCtrl.addFollowing, userCtrl.addFollower)
router
  .route('/api/unfollow')
  .put(authCtrl.requireSignIn, userCtrl.removeFollowing, userCtrl.removeFollower)

router.route('/api/users/findpeople/:userId').get(authCtrl.requireSignIn, userCtrl.findPeople)

router.route('/api/bookmarks/:id').get(authCtrl.requireSignIn, userCtrl.getBookmarkedPosts)
router.route('/api/bookmarks/ids/:id').get(authCtrl.requireSignIn, userCtrl.getBookmarkedPostsIds)

router.route('/api/bookmarks/add/:id').put(authCtrl.requireSignIn, userCtrl.addBookmark)
router.route('/api/bookmarks/remove/:id').put(authCtrl.requireSignIn, userCtrl.removeBookmark)

export default router
