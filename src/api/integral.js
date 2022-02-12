import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/adm/integral',
    method: 'get',
    params: query
  })
}

export function deleteIntegral(data) {
  return request({
    url: '/adm/integral/delete',
    method: 'post',
    data
  })
}
