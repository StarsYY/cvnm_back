import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/adm/usermedal',
    method: 'get',
    params: query
  })
}

export function deleteUserMedal(data) {
  return request({
    url: '/adm/usermedal/delete',
    method: 'post',
    data
  })
}
