import { IUserDocument } from './src/models/user.model'

declare global {
  namespace Express {
    export interface Request {
      profile: IUserDocument
    }
  }
}
