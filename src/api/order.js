import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/adm/order',
    method: 'get',
    params: query
  })
}

export function deleteOrder(data) {
  return request({
    url: '/adm/order/delete',
    method: 'post',
    data
  })
}
