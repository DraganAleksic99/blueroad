import { baseUrl } from '../config/config'
import { TPost } from '../routes/NewsFeed'
import { TUser } from '../routes/Profile'

const create = async (user: { name: string; email: string; password: string }) => {
  try {
    const response = await fetch(baseUrl + '/api/users/', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    })

    return await response.json()
  } catch (err) {
    throw new Error('Something went wrong. Try again.')
  }
}

const getUsers = async (): Promise<TUser[]> => {
  try {
    const response = await fetch(baseUrl + '/api/users/', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
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

const getUser = async (userId: string, token: string): Promise<TUser> => {
  try {
    const response = await fetch(baseUrl + '/api/users/' + userId, {
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

const update = async (userId: string, token: string, user: FormData) => {
  try {
    const response = await fetch(baseUrl + '/api/users/' + userId, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + token
      },
      body: user
    })

    return await response.json()
  } catch (err) {
    throw new Error('Something went wrong. Try again.')
  }
}

const remove = async (userId: string, token: string) => {
  try {
    const response = await fetch(baseUrl + '/api/users/' + userId, {
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

const followUser = async (userId: string, token: string, followId: string): Promise<TUser> => {
  try {
    const response = await fetch(baseUrl + '/api/follow', {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      },
      body: JSON.stringify({ userId, followId })
    })

    if (!response.ok) {
      throw new Error(`Something went wrong. Please try again.`)
    }

    return await response.json()
  } catch (err) {
    throw new Error('Something went wrong. Please try again.')
  }
}

const unfollowUser = async (userId: string, token: string, unfollowId: string): Promise<TUser> => {
  try {
    const response = await fetch(baseUrl + '/api/unfollow', {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      },
      body: JSON.stringify({ userId, unfollowId })
    })

    if (!response.ok) {
      throw new Error(`Something went wrong. Please try again.`)
    }

    return await response.json()
  } catch (err) {
    throw new Error(`Something went wrong. Please try again.`)
  }
}

const getUsersToFollow = async (userId: string, token: string): Promise<TUser[]> => {
  try {
    const response = await fetch(baseUrl + '/api/users/findpeople/' + userId, {
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

const getBookmarks = async (userId: string, token: string): Promise<TUser> => {
  try {
    const response = await fetch(baseUrl + '/api/bookmarks/' + userId, {
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

const getBookmarksIds = async (userId: string, token: string): Promise<string[]> => {
  try {
    const response = await fetch(baseUrl + '/api/bookmarks/ids/' + userId, {
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

const addBookmark = async (userId: string, token: string, post: TPost): Promise<string> => {
  try {
    const response = await fetch(baseUrl + '/api/bookmarks/add/' + userId, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      },
      body: JSON.stringify({ post })
    })

    if (!response.ok) {
      throw new Error(`Something went wrong. Please try again.`)
    }

    return await response.json()
  } catch (err) {
    throw new Error('Something went wrong. Try again.')
  }
}

const removeBookmark = async (userId: string, token: string, post: TPost): Promise<string> => {
  try {
    const response = await fetch(baseUrl + '/api/bookmarks/remove/' + userId, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      },
      body: JSON.stringify({ post })
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
  create,
  getUsers,
  getUser,
  update,
  remove,
  followUser,
  unfollowUser,
  getUsersToFollow,
  getBookmarks,
  getBookmarksIds,
  addBookmark,
  removeBookmark
}
