import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/adm/plate',
    method: 'get',
    params: query
  })
}

export function createPlate(data) {
  return request({
    url: '/adm/plate/add',
    method: 'post',
    data
  })
}

export function updatePlate(data) {
  return request({
    url: '/adm/plate/update',
    method: 'post',
    data
  })
}

export function deletePlate(data) {
  return request({
    url: '/adm/plate/delete',
    method: 'post',
    data
  })
}
