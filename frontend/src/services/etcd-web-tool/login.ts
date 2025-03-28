import {request} from '@umijs/max';

/**
 *  登录
 * @param data
 */
export async function login(data: any) {
  return request('/api/login', {
    method: 'POST',
    data: data,
  });
}

export async function save(data: any) {
  return request('/api/etcd/put', {
    method: 'POST',
    data: data,
  });
}

/**
 * 写入数据
 * @param data
 */
export async function put(data: any) {
  return save(data);
}

/**
 * 加载数据
 * @param data
 */
export async function lists(data: any) {
  return request('/api/etcd/list', data);
}

/**
 *  删除数据
 * @param data
 */
export async function del(data: any) {
  return request('/api/etcd/delete', {
    method: 'DELETE',
    params: data,
  });
}
