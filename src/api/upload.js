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

export function uploadCourseCover(data) {
  return request({
    url: '/adm/course/upload',
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

export function uploadMedal(data) {
  return request({
    url: '/adm/medal/upload',
    method: 'post',
    data
  })
}

export function uploadPlateIcon(data) {
  return request({
    url: '/adm/plate/upload',
    method: 'post',
    data
  })
}

export function uploadCourseVideo(data) {
  return request({
    url: '/adm/course/upload/video/merge',
    method: 'post',
    data
  })
}

export function uploadRotation(data) {
  return request({
    url: '/adm/rotation/upload',
    method: 'post',
    data
  })
}

export function uploadRotations(data) {
  return request({
    url: '/adm/rotations/upload',
    method: 'post',
    data
  })
}
