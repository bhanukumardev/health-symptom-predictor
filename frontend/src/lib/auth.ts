export const getToken = () => (typeof window !== 'undefined' ? localStorage.getItem('token') : null)
export const setToken = (t: string) => localStorage.setItem('token', t)
export const removeToken = () => localStorage.removeItem('token')
export const isAuthenticated = () => !!getToken()
