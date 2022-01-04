import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/adm/category',
    method: 'get',
    params: query
  })
}

export function createCategory(data) {
  return request({
    url: '/adm/category/add',
    method: 'post',
    data
  })
}

export function updateCategory(data) {
  return request({
    url: '/adm/category/update',
    method: 'post',
    data
  })
}

export function deleteCategory(data) {
  return request({
    url: '/adm/category/delete',
    method: 'post',
    data
  })
}
