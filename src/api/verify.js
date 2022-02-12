import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/adm/verify',
    method: 'get',
    params: query
  })
}

export function changeStatus(data) {
  return request({
    url: '/adm/verify/change',
    method: 'post',
    data
  })
}

export function deleteVerify(data) {
  return request({
    url: '/adm/verify/delete',
    method: 'post',
    data
  })
}
