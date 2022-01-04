import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/adm/label',
    method: 'get',
    params: query
  })
}

export function fetchCategory(query) {
  return request({
    url: '/adm/label/category',
    method: 'get',
    params: query
  })
}

export function createLabel(data) {
  return request({
    url: '/adm/label/add',
    method: 'post',
    data
  })
}

export function fetchLabel(query) {
  return request({
    url: '/adm/label/details?id=' + query,
    method: 'get',
    params: query
  })
}

export function updateLabel(data) {
  return request({
    url: '/adm/label/update',
    method: 'post',
    data
  })
}

export function deleteLabel(data) {
  return request({
    url: '/adm/label/delete',
    method: 'post',
    data
  })
}
