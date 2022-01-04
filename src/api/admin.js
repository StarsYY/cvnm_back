import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/adm/admin',
    method: 'get',
    params: query
  })
}

export function createAdmin(data) {
  return request({
    url: '/adm/admin/add',
    method: 'post',
    data
  })
}

export function fetchAdmin(query) {
  return request({
    url: '/adm/admin/details?id=' + query,
    method: 'get',
    params: query
  })
}

export function updateAdmin(data) {
  return request({
    url: '/adm/admin/update',
    method: 'post',
    data
  })
}

export function changeStatus(data) {
  return request({
    url: '/adm/admin/change',
    method: 'post',
    data
  })
}

export function deleteAdmin(data) {
  return request({
    url: '/adm/admin/delete',
    method: 'post',
    data
  })
}
