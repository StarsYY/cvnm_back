import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/adm/video',
    method: 'get',
    params: query
  })
}

export function deleteVideo(data) {
  return request({
    url: '/adm/video/delete',
    method: 'post',
    data
  })
}
