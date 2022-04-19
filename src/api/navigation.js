import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/adm/navigation',
    method: 'get',
    params: query
  })
}

export function createNavigation(data) {
  return request({
    url: '/adm/navigation/add',
    method: 'post',
    data
  })
}

export function updateNavigation(data) {
  return request({
    url: '/adm/navigation/update',
    method: 'post',
    data
  })
}

export function deleteNavigation(data) {
  return request({
    url: '/adm/navigation/delete',
    method: 'post',
    data
  })
}
