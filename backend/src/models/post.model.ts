import { Schema, Document, model, Types } from 'mongoose'
import { IUserDocument } from './user.model'

type TComment = {
  text: string
  created: Date
  postedBy: Types.ObjectId
}

export interface IPost {
  text: string
  photo: {
    data: Buffer
    contentType: string
  }
  postedBy: IUserDocument
  created: Date
  likes: IUserDocument[]
  comments: TComment[]
}

export interface IPostDocument extends IPost, Document {}

const PostSchema = new Schema<IPostDocument>({
  text: {
    type: String,
    required: [true, 'Text is required']
  },
  photo: {
    data: Buffer,
    contentType: String
  },
  postedBy: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  created: {
    type: Date,
    default: Date.now
  },
  likes: [{ type: Schema.ObjectId, ref: 'User' }],
  comments: [
    {
      text: String,
      created: { type: Date, default: Date.now },
      postedBy: { type: Schema.ObjectId, ref: 'User' }
    }
  ]
})

export default model<IPostDocument>('Post', PostSchema)
