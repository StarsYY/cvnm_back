import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/adm/report',
    method: 'get',
    params: query
  })
}

export function deleteReport(data) {
  return request({
    url: '/adm/report/delete',
    method: 'post',
    data
  })
}
