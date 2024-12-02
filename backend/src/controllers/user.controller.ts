import { Request, Response, NextFunction } from 'express'
import extend from 'lodash/extend'
import formidable from 'formidable'
import fs from 'fs'
import path from 'path'
import User from '../models/user.model'
import errorHandler from '../utils/dbErrorHandler'

const create = async (req: Request, res: Response) => {
  const user = new User(req.body)

  try {
    await user.save()

    return res.status(201).json({
      message: 'Succesfully signed up'
    })
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const list = async (_req: Request, res: Response) => {
  try {
    const users = await User.find()
      .select('name email created updated photo.contentType about following followers')
      .lean()

    res.json(users)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const userById = async (req: Request, res: Response, next: NextFunction, id: string) => {
  try {
    const user = await User.findById(id)
      .select('-salt -hashed_password')
      .populate('following', '_id name email about followers following')
      .populate('followers', '_id name email about followers following')
      .exec()

    if (!user) {
      return res.status(400).json({
        error: 'User not found'
      })
    }

    req.profile = user
    next()
  } catch (err) {
    return res.status(400).json({
      error: 'Could not retrieve the user'
    })
  }
}

const read = (req: Request, res: Response) => {
  req.profile.photo.data = null
  return res.json(req.profile)
}

const update = async (req: Request, res: Response) => {
  const form = formidable({ keepExtensions: true })

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: 'Photo could not be uploaded'
      })
    }

    let user = req.profile

    user = extend(user, {
      name: fields.name?.toString() || '',
      email: fields.email?.toString() || '',
      password: fields.password?.toString() || '',
      about: fields.about?.toString() || ''
    })

    user.updated = Date.now()

    if (files.photo) {
      user = extend(user, {
        photo: {
          data: fs.readFileSync(files.photo[0].filepath),
          contentType: files.photo[0].mimetype
        }
      })
    }

    try {
      await user.save()

      user.hashed_password = undefined
      user.salt = undefined

      res.json(user)
    } catch (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
  })
}

const remove = async (req: Request, res: Response) => {
  try {
    const user = req.profile
    const deletedUser = await user.deleteOne()
    deletedUser.hashed_password = undefined
    deletedUser.salt = undefined
    res.json(deletedUser)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const photo = async (req: Request, res: Response, next: NextFunction) => {
  if (req.profile.photo.data) {
    res.set('Cross-Origin-Resource-Policy', 'false')
    res.set('Content-Type', req.profile.photo.contentType)

    return res.send(req.profile.photo.data)
  }
  next()
}

const defaultPhoto = (req: Request, res: Response) => {
  res.set('Cross-Origin-Resource-Policy', 'false')

  return res.sendFile(path.join(__dirname, '../images/user-profile-default.png'))
}

const addFollowing = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await User.findByIdAndUpdate(req.body.userId, {
      $push: { following: req.body.followId }
    }).select('_id')

    next()
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const addFollower = async (req: Request, res: Response) => {
  try {
    const result = await User.findByIdAndUpdate(
      req.body.followId,
      { $push: { followers: req.body.userId } },
      { new: true }
    ).select('name')

    res.json(result)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const removeFollowing = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await User.findByIdAndUpdate(req.body.userId, {
      $pull: { following: req.body.unfollowId }
    }).select('_id')

    next()
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const removeFollower = async (req: Request, res: Response) => {
  try {
    const result = await User.findByIdAndUpdate(
      req.body.unfollowId,
      { $pull: { followers: req.body.userId } },
      { new: true }
    ).select('name')

    res.json(result)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const findPeople = async (req: Request, res: Response) => {
  const following = [...req.profile.following, req.profile._id]

  try {
    const users = await User.find({ _id: { $nin: following } })
      .select('name email')
      .lean()

    res.json(users)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const getBookmarkedPosts = async (req: Request, res: Response) => {
  const { id } = req.params

  try {
    const user = await User.findById(id)
      .select('bookmarkedPosts')
      .populate({
        path: 'bookmarkedPosts',
        select: '-photo.data',
        populate: {
          path: 'postedBy',
          select: '_id name email followers'
        }
      })
      .lean()
      .exec()

    res.json(user)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const getBookmarkedPostsIds = async (req: Request, res: Response) => {
  const { id } = req.params

  try {
    const user = await User.findById(id).select('bookmarkedPosts').populate('_id').lean().exec()

    res.json(user.bookmarkedPosts)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const addBookmark = async (req: Request, res: Response) => {
  const { id } = req.params

  try {
    await User.findByIdAndUpdate(id, {
      $push: { bookmarkedPosts: req.body.post }
    })

    res.json({
      message: 'Post successfully added to bookmarks'
    })
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const removeBookmark = async (req: Request, res: Response) => {
  const { id } = req.params

  try {
    await User.findByIdAndUpdate(id, {
      $pull: { bookmarkedPosts: req.body.post._id }
    })

    res.json({
      message: 'Post successfully removed from bookmarks'
    })
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

export default {
  create,
  list,
  update,
  userById,
  read,
  remove,
  photo,
  defaultPhoto,
  addFollowing,
  addFollower,
  removeFollowing,
  removeFollower,
  findPeople,
  getBookmarkedPosts,
  getBookmarkedPostsIds,
  addBookmark,
  removeBookmark
}
