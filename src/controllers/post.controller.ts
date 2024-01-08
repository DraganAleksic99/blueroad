import { Request, Response } from 'express'
import Post from '../models/post.model'
import dbErrorHandler from '../utils/dbErrorHandler'

const listNewsFeed = async (req: Request, res: Response) => {
  const following = req.profile.following
  following.push(req.profile._id)
  try {
    const posts = await Post.find({ postedBy: { $in: req.profile.following } })
      .populate('comments.postedBy', '_id name')
      .populate('postedBy', '_id name')
      .sort('-created')
      .exec()
    res.json(posts)
  } catch (err) {
    return res.status(400).json({
      error: dbErrorHandler.getErrorMessage(err)
    })
  }
}

const listByUser = async (req: Request, res: Response) => {
  try {
    const posts = await Post.find({ postedBy: req.profile._id })
      .populate('comments.postedBy', '_id name')
      .populate('postedBy', '_id name')
      .sort('-created')
      .exec()
    res.json(posts)
  } catch (err) {
    return res.status(400).json({
      error: dbErrorHandler.getErrorMessage(err)
    })
  }
}

export default {
  listNewsFeed,
  listByUser
}
