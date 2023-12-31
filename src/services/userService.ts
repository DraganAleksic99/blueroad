const baseUrl = 'http://localhost:3500'

type Params = {
  userId: string
}

type Credentials = {
  t: string
}

type User = {
  name: string
  email: string
  password: string
}

const create = async (user: User) => {
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

export { create, list, read, update, remove }
