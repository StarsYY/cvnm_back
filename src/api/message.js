import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/adm/message',
    method: 'get',
    params: query
  })
}

export function deleteMessage(data) {
  return request({
    url: '/adm/message/delete',
    method: 'post',
    data
  })
}
