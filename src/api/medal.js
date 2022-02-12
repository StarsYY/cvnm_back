import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/adm/medal',
    method: 'get',
    params: query
  })
}

export function createMedal(data) {
  return request({
    url: '/adm/medal/add',
    method: 'post',
    data
  })
}

export function updateMedal(data) {
  return request({
    url: '/adm/medal/update',
    method: 'post',
    data
  })
}

export function deleteMedal(data) {
  return request({
    url: '/adm/medal/delete',
    method: 'post',
    data
  })
}
