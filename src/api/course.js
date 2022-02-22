import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/adm/course',
    method: 'get',
    params: query
  })
}

export function fetchLabel(query) {
  return request({
    url: '/adm/course/label',
    method: 'get',
    params: query
  })
}

export function createCourse(data) {
  return request({
    url: '/adm/course/add',
    method: 'post',
    data
  })
}

export function fetchCourse(query) {
  return request({
    url: '/adm/course/details?id=' + query,
    method: 'get',
    params: query
  })
}

export function updateCourse(data) {
  return request({
    url: '/adm/course/update',
    method: 'post',
    data
  })
}

export function changeStatus(data) {
  return request({
    url: '/adm/course/change',
    method: 'post',
    data
  })
}

export function deleteCourse(data) {
  return request({
    url: '/adm/course/delete',
    method: 'post',
    data
  })
}
