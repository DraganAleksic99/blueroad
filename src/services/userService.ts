import { TUser } from '../views/Profile'

const baseUrl = 'https://social-media-app-backend-production-909f.up.railway.app'

export type Params = {
  userId: string
}

export type Credentials = {
  t: string
}

const create = async (user: TUser) => {
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
    console.log(err)
  }
}

const list = async (signal: AbortSignal) => {
  try {
    const response = await fetch(baseUrl + '/api/users/', {
      method: 'GET',
      signal: signal
    })
    return await response.json()
  } catch (err) {
    console.log(err)
  }
}

const read = async (params: Params, credentials: Credentials, signal: AbortSignal) => {
  try {
    const response = await fetch(baseUrl + '/api/users/' + params.userId, {
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

const update = async (params: Params, credentials: Credentials, user: FormData) => {
  try {
    const response = await fetch(baseUrl + '/api/users/' + params.userId, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + credentials.t
      },
      body: user
    })
    return await response.json()
  } catch (err) {
    console.log(err)
  }
}

const remove = async (params: Params, credentials: Credentials) => {
  try {
    const response = await fetch(baseUrl + '/api/users/' + params.userId, {
      method: 'DELETE',
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

const follow = async (params: Params, credentials: Credentials, followId: string) => {
  try {
    const response = await fetch(baseUrl + '/api/follow', {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + credentials.t
      },
      body: JSON.stringify({ userId: params.userId, followId: followId })
    })
    return await response.json()
  } catch (err) {
    console.log(err)
  }
}

const unfollow = async (params: Params, credentials: Credentials, unfollowId: string) => {
  try {
    const response = await fetch(baseUrl + '/api/unfollow', {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + credentials.t
      },
      body: JSON.stringify({ userId: params.userId, unfollowId: unfollowId })
    })
    return await response.json()
  } catch (err) {
    console.log(err)
  }
}

const findPeople = async (params: Params, credentials: Credentials, signal: AbortSignal) => {
  try {
    const response = await fetch(baseUrl + '/api/users/findpeople/' + params.userId, {
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

export { create, list, read, update, remove, follow, unfollow, findPeople }
