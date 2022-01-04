import request from '@/utils/request'

export function uploadUserPortrait(data) {
  return request({
    url: '/adm/user/upload',
    method: 'post',
    data
  })
}

export function uploadLabelIcon(data) {
  return request({
    url: '/adm/label/upload',
    method: 'post',
    data
  })
}

export function uploadArticleCover(data) {
  return request({
    url: '/adm/article/upload',
    method: 'post',
    data
  })
}
