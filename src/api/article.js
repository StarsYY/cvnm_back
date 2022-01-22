import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/adm/article',
    method: 'get',
    params: query
  })
}

export function fetchLabel(query) {
  return request({
    url: '/adm/article/label',
    method: 'get',
    params: query
  })
}

export function createArticle(data) {
  return request({
    url: '/adm/article/add',
    method: 'post',
    data
  })
}

export function fetchArticle(query) {
  return request({
    url: '/adm/article/details?id=' + query,
    method: 'get',
    params: query
  })
}

export function updateArticle(data) {
  return request({
    url: '/adm/article/update',
    method: 'post',
    data
  })
}

export function changeStatus(data) {
  return request({
    url: '/adm/article/change',
    method: 'post',
    data
  })
}

export function changeTag(data) {
  return request({
    url: '/adm/article/changeTag',
    method: 'post',
    data
  })
}

export function changeRTag(data) {
  return request({
    url: '/adm/article/changeRTag',
    method: 'post',
    data
  })
}

export function deleteArticle(data) {
  return request({
    url: '/adm/article/delete',
    method: 'post',
    data
  })
}

export function deleteArticleR(data) {
  return request({
    url: '/adm/article/deleteR',
    method: 'post',
    data
  })
}
