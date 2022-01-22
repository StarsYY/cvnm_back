import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/adm/login',
    method: 'post',
    params: { ...data }
  })
}

export function getInfo(token) {
  return request({
    url: '/adm/info',
    method: 'get',
    params: { token }
  })
}

export function logout(name) {
  return request({
    url: '/adm/logout',
    method: 'post',
    params: { name }
  })
}
