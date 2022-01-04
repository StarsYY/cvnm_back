import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/adm/consumer',
    method: 'get',
    params: query
  })
}

export function createConsumer(data) {
  return request({
    url: '/adm/consumer/add',
    method: 'post',
    data
  })
}

export function fetchConsumer(query) {
  return request({
    url: '/adm/consumer/details?id=' + query,
    method: 'get',
    params: query
  })
}

export function updateConsumer(data) {
  return request({
    url: '/adm/consumer/update',
    method: 'post',
    data
  })
}

export function changeStatus(data) {
  return request({
    url: '/adm/consumer/change',
    method: 'post',
    data
  })
}

export function deleteConsumer(data) {
  return request({
    url: '/adm/consumer/delete',
    method: 'post',
    data
  })
}
