import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'
const Name = 'Admin-Name'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getName() {
  return Cookies.get(Name)
}

export function setName(token) {
  return Cookies.set(Name, token)
}

export function removeName() {
  return Cookies.remove(Name)
}
