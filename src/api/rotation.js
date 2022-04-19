import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/adm/rotation',
    method: 'get',
    params: query
  })
}

export function createRotation(data) {
  return request({
    url: '/adm/rotation/add',
    method: 'post',
    data
  })
}

export function updateRotation(data) {
  return request({
    url: '/adm/rotation/update',
    method: 'post',
    data
  })
}

export function deleteRotation(data) {
  return request({
    url: '/adm/rotation/delete',
    method: 'post',
    data
  })
}
