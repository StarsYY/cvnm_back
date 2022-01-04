import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/adm/root',
    method: 'get',
    params: query
  })
}

export function createRoot(data) {
  return request({
    url: '/adm/root/add',
    method: 'post',
    data
  })
}

export function updateRoot(data) {
  return request({
    url: '/adm/root/update',
    method: 'post',
    data
  })
}

export function deleteRoot(data) {
  return request({
    url: '/adm/root/delete',
    method: 'post',
    data
  })
}
