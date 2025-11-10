export const setSession = (isLoggedIn: boolean) => {
  localStorage.setItem('session', isLoggedIn.toString())
}

export const getSession = (): boolean => {
  if (typeof window === 'undefined') return false
  return localStorage.getItem('session') === 'true'
}

export const clearSession = () => {
  localStorage.removeItem('session')
  localStorage.removeItem('jwt_token')
}

export const isUserLoggedIn = (): boolean => {
  return getSession() && !!localStorage.getItem('jwt_token')
}
