import { IUserDocument } from './src/models/user.model'
import { IPostDocument } from './src/models/post.model'

declare global {
  namespace Express {
    export interface Request {
      profile: IUserDocument
      auth: {
        _id: string
      }
      post: IPostDocument
    }
  }
}
