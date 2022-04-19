import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/adm/learning',
    method: 'get',
    params: query
  })
}

export function deleteLearning(data) {
  return request({
    url: '/adm/learning/delete',
    method: 'post',
    data
  })
}
