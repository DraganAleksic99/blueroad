import { baseUrl } from '../config/config'
import { TComment, TPost } from '../routes/NewsFeed'

const listNewsFeed = async (userId: string, token: string) => {
  try {
    const response = await fetch(baseUrl + '/api/posts/feed/' + userId, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      }
    })

    if (!response.ok) {
      throw new Error(`Something went wrong. Please try again.`)
    }

    return await response.json()
  } catch (err) {
    throw new Error('Something went wrong. Try again.')
  }
}

const loadPost = async (userId: string, token: string): Promise<TPost> => {
  try {
    const response = await fetch(baseUrl + '/api/post/by/' + userId, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      }
    })

    if (!response.ok) {
      throw new Error(`Something went wrong. Please try again.`)
    }

    return await response.json()
  } catch (err) {
    throw new Error('Something went wrong. Try again.')
  }
}

const loadPosts = async (userId: string, token: string) => {
  try {
    const response = await fetch(baseUrl + '/api/posts/by/' + userId, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      }
    })

    if (!response.ok) {
      throw new Error(`Something went wrong. Please try again.`)
    }

    return await response.json()
  } catch (err) {
    throw new Error('Something went wrong. Try again.')
  }
}

const createPost = async (userId: string, token: string, post: FormData) => {
  try {
    const response = await fetch(baseUrl + '/api/posts/new/' + userId, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + token
      },
      body: post
    })

    if (!response.ok) {
      throw new Error(`Something went wrong. Please try again.`)
    }

    return await response.json()
  } catch (err) {
    throw new Error('Something went wrong. Try again.')
  }
}

const removePost = async (postId: string, token: string) => {
  try {
    const response = await fetch(baseUrl + '/api/posts/delete/' + postId, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      }
    })

    if (!response.ok) {
      throw new Error(`Something went wrong. Please try again.`)
    }

    return await response.json()
  } catch (err) {
    throw new Error('Something went wrong. Try again.')
  }
}

const likePost = async (userId: string, token: string, postId: string): Promise<string[]> => {
  try {
    const response = await fetch(baseUrl + '/api/posts/like', {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      },
      body: JSON.stringify({ userId, postId })
    })

    if (!response.ok) {
      throw new Error(`Something went wrong. Please try again.`)
    }

    return await response.json()
  } catch (err) {
    throw new Error('Something went wrong. Try again.')
  }
}

const unlikePost = async (userId: string, token: string, postId: string): Promise<string[]> => {
  try {
    const response = await fetch(baseUrl + '/api/posts/unlike', {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      },
      body: JSON.stringify({ userId, postId })
    })

    if (!response.ok) {
      throw new Error(`Something went wrong. Please try again.`)
    }

    return await response.json()
  } catch (err) {
    throw new Error('Something went wrong. Try again.')
  }
}

const comment = async (
  userId: string,
  token: string,
  postId: string,
  comment: TComment
): Promise<{
  _id: string
  comments: TComment[]
}> => {
  try {
    const response = await fetch(baseUrl + '/api/posts/comment/' + userId, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      },
      body: JSON.stringify({ postId, comment })
    })

    if (!response.ok) {
      throw new Error(`Something went wrong. Please try again.`)
    }

    return await response.json()
  } catch (err) {
    throw new Error('Something went wrong. Try again.')
  }
}

const uncomment = async (
  userId: string,
  token: string,
  postId: string,
  comment: TComment
): Promise<{
  message: string
}> => {
  try {
    const response = await fetch(baseUrl + '/api/posts/uncomment', {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      },
      body: JSON.stringify({ userId, postId, comment })
    })

    if (!response.ok) {
      throw new Error(`Something went wrong. Please try again.`)
    }

    return await response.json()
  } catch (err) {
    throw new Error('Something went wrong. Try again.')
  }
}

export {
  listNewsFeed,
  loadPost,
  loadPosts,
  createPost,
  removePost,
  likePost,
  unlikePost,
  comment,
  uncomment
}
