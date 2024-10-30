const baseUrl = 'https://social-media-app-69re.onrender.com'

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
    return await response.json()
  } catch (err) {
    console.log(err)
  }
}

const signout = async () => {
  try {
    const response = await fetch(baseUrl + '/auth/signout', { method: 'GET' })
    return await response.json()
  } catch (err) {
    console.log(err)
  }
}

export { signin, signout }
