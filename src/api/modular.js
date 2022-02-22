import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/adm/modular',
    method: 'get',
    params: query
  })
}

export function createModular(data) {
  return request({
    url: '/adm/modular/add',
    method: 'post',
    data
  })
}

export function updateModular(data) {
  return request({
    url: '/adm/modular/update',
    method: 'post',
    data
  })
}

export function deleteModular(data) {
  return request({
    url: '/adm/modular/delete',
    method: 'post',
    data
  })
}
