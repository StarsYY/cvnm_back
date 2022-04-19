import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/adm/sign',
    method: 'get',
    params: query
  })
}

export function deleteSign(data) {
  return request({
    url: '/adm/sign/delete',
    method: 'post',
    data
  })
}
