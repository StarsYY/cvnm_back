import request from '@/utils/request'

export function searchUser(name) {
  return request({
    url: '/adm/article/searchUser',
    method: 'get',
    params: { name }
  })
}

export function searchUserCourse(name) {
  return request({
    url: '/adm/course/searchUser',
    method: 'get',
    params: { name }
  })
}

export function transactionList(query) {
  return request({
    url: '/adm/dashboard/order',
    method: 'get',
    params: query
  })
}

export function panelGroup(query) {
  return request({
    url: '/adm/dashboard/panel',
    method: 'get',
    params: query
  })
}

export function fetchLineChartData(query) {
  return request({
    url: '/adm/dashboard/chart',
    method: 'get',
    params: query
  })
}
