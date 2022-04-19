import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/adm/rotations',
    method: 'get',
    params: query
  })
}

export function createRotations(data) {
  return request({
    url: '/adm/rotations/add',
    method: 'post',
    data
  })
}

export function updateRotations(data) {
  return request({
    url: '/adm/rotations/update',
    method: 'post',
    data
  })
}

export function deleteRotations(data) {
  return request({
    url: '/adm/rotations/delete',
    method: 'post',
    data
  })
}
