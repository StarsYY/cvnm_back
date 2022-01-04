import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/adm/user',
    method: 'get',
    params: query
  })
}

export function createUser(data) {
  return request({
    url: '/adm/user/add',
    method: 'post',
    data
  })
}

export function fetchUser(query) {
  return request({
    url: '/adm/user/details?id=' + query,
    method: 'get',
    params: query
  })
}

export function updateUser(data) {
  return request({
    url: '/adm/user/update',
    method: 'post',
    data
  })
}

export function changeStatus(data) {
  return request({
    url: '/adm/user/change',
    method: 'post',
    data
  })
}

export function deleteUser(data) {
  return request({
    url: '/adm/user/delete',
    method: 'post',
    data
  })
}
