import request from '@/utils/request'

export function uploadUserPortrait(data) {
  return request({
    url: '/adm/user/upload',
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

export function uploadAdminAvatar(data) {
  return request({
    url: '/adm/admin/upload',
    method: 'post',
    data
  })
}
