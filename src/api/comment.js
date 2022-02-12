import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/adm/comment',
    method: 'get',
    params: query
  })
}

export function changeStatus(data) {
  return request({
    url: '/adm/comment/change',
    method: 'post',
    data
  })
}

export function deleteComment(data) {
  return request({
    url: '/adm/comment/delete',
    method: 'post',
    data
  })
}
