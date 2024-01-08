import { Request, Response, NextFunction } from 'express'
import fs from 'fs'
import Post from '../models/post.model'
import dbErrorHandler from '../utils/dbErrorHandler'
import formidable from 'formidable'

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

const create = (req: Request, res: Response) => {
  const form = formidable({ keepExtensions: true })

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({ error: 'Image could not be uploaded' })
    }
    const post = new Post({ text: fields.text?.toString() || '' })
    post.postedBy = req.profile

    if (files.photo) {
      post.photo.data = fs.readFileSync(files.photo[0].filepath)
      post.photo.contentType = files.photo[0].mimetype
    }
    try {
      const result = await post.save()
      res.json(result)
    } catch (err) {
      return res.status(400).json({
        error: dbErrorHandler.getErrorMessage(err)
      })
    }
  })
}

const photo = (req: Request, res: Response) => {
  res.set('Cross-Origin-Resource-Policy', 'false')
  res.set('Content-Type', req.post.photo.contentType)
  return res.send(req.post.photo.data)
}

const postById = async (req: Request, res: Response, next: NextFunction, id: string) => {
  try {
    const post = await Post.findById(id).populate('postedBy', '_id name').exec()
    if (!post)
      return res.status(400).json({
        error: 'Post not found'
      })
    req.post = post
    next()
  } catch (err) {
    return res.status(400).json({
      error: 'Could not retrieve the post'
    })
  }
}

export default {
  listNewsFeed,
  listByUser,
  create,
  photo,
  postById
}
