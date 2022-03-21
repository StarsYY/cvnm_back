import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/adm/discuss',
    method: 'get',
    params: query
  })
}

export function changeStatus(data) {
  return request({
    url: '/adm/discuss/change',
    method: 'post',
    data
  })
}

export function deleteDiscuss(data) {
  return request({
    url: '/adm/discuss/delete',
    method: 'post',
    data
  })
}
