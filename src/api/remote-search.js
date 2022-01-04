import request from '@/utils/request'

export function searchUser(name) {
  return request({
    url: '/adm/article/searchUser',
    method: 'get',
    params: { name }
  })
}

export function transactionList(query) {
  return request({
    url: '/adm/user',
    method: 'get',
    params: query
  })
}
