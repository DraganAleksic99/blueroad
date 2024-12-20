import { baseUrl } from '../config/config'

const signin = async (user: { email: string; password: string }) => {
  try {
    const response = await fetch(baseUrl + '/auth/signin', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(user)
    })

    if (!response.ok) {
      throw new Error(`Something went wrong. Please try again.`)
    }

    return await response.json()
  } catch (err) {
    throw new Error(`Something went wrong. Please try again.`)
  }
}

const signout = async () => {
  try {
    const response = await fetch(baseUrl + '/auth/signout', { method: 'GET' })

    if (!response.ok) {
      throw new Error(`Something went wrong. Please try again.`)
    }

    return await response.json()
  } catch (err) {
    throw new Error(`Something went wrong. Please try again.`)
  }
}

export { signin, signout }
