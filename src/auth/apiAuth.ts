const baseUrl = 'http://localhost:3500'

const signin = async user => {
  try {
    const response = await fetch(baseUrl + '/auth/signin/', {
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
    const response = await fetch(baseUrl + '/auth/signout/', { method: 'GET' })
    return await response.json()
  } catch (err) {
    console.log(err)
  }
}

export { signin, signout }
