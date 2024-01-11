import { Credentials } from './userService'
import { TComment } from '../views/post/NewsFeed'

type Params = {
  postId?: string
  userId?: string
}

const baseUrl = 'http://localhost:3500'

const listNewsFeed = async (params: Params, credentials: Credentials, signal: AbortSignal) => {
  try {
    const response = await fetch(baseUrl + '/api/posts/feed/' + params.userId, {
      method: 'GET',
      signal: signal,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + credentials.t
      }
    })
    return await response.json()
  } catch (err) {
    console.log(err)
  }
}

const comment = async (
  params: Params,
  credentials: Credentials,
  postId: string,
  comment: TComment
) => {
  try {
    const response = await fetch(baseUrl + '/api/posts/comment/' + params.userId, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + credentials.t
      },
      body: JSON.stringify({ postId: postId, comment: comment })
    })
    return await response.json()
  } catch (err) {
    console.log(err)
  }
}

const uncomment = async (
  params: Params,
  credentials: Credentials,
  postId: string,
  comment: TComment
) => {
  try {
    const response = await fetch(baseUrl + '/api/posts/uncomment', {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + credentials.t
      },
      body: JSON.stringify({ userId: params.userId, postId: postId, comment: comment })
    })
    return await response.json()
  } catch (err) {
    console.log(err)
  }
}

export { listNewsFeed, comment, uncomment }
