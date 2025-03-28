import { AvatarDropdown, AvatarName, Footer, Question, SelectLang } from '@/components';
import { LinkOutlined } from '@ant-design/icons';
import type { Settings as LayoutSettings } from '@ant-design/pro-components';
import { SettingDrawer } from '@ant-design/pro-components';

import type { RequestConfig, RunTimeLayoutConfig } from '@umijs/max';
import { history, Link } from '@umijs/max';

// 布局基础配置
import type { RequestOptions } from '@@/plugin-request/request';
import { message } from 'antd';
import proLayoutDefaultSettings from '../config/defaultSettings';
import { JSXElementConstructor, ReactElement, ReactNode, ReactPortal } from 'react';

// 是否是开发环境
const { REACT_APP_ENV = 'dev' } = process.env;
const isDev: boolean = REACT_APP_ENV == 'dev';

//登录页面
const loginPath: string = '/user/login';

/**
 * @name 全局初始化数据配置，用于 Layout 用户信息和权限初始化
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>; // 布局基础配置
  currentUser?: API.CurrentUser;
  loading?: boolean;
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
  loginPath?: string | undefined;
}> {
  // 初始化获取用户状态 Ant Design Pro中用于用户认证和状态管理的重要部分
  // 在实际应用中，它会在用户登录后或需要刷新用户信息时被调用。
  const fetchUserInfo = async () => {
    // try {
    //   const msg = await queryCurrentUser({
    //     skipErrorHandler: true,
    //   });
    //   return msg.data;
    // } catch (error) {
    //   history.push(loginPath);
    // }
    return {
      name: 'ETCD V3 Editor',
      avatar: '',
    };
  };

  // 如果不是登录页面，执行
  // const {location} = history;
  // if (![loginPath, '/user/register', '/user/register-result'].includes(location.pathname)) {
  //   const currentUser = await fetchUserInfo();
  //   return {
  //     fetchUserInfo,
  //     currentUser,
  //     settings: proLayoutDefaultSettings as Partial<LayoutSettings>,
  //   };
  // }

  return {
    fetchUserInfo: fetchUserInfo,
    currentUser: {
      name: 'ETCD V3 Editor',
      avatar: '',
    },
    // https://umijs.org/docs/max/layout-menu
    settings: proLayoutDefaultSettings as Partial<LayoutSettings>,
    loginPath: loginPath,
    loading: true,
  };
}

// 运行时布局配置
// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState }) => {
  return {
    //右上角 下拉模块 语言选择
    actionsRender: () => [<Question key="doc" />, <SelectLang key="SelectLang" />],

    //右上角 用户初始信息
    avatarProps: {
      src: initialState?.currentUser?.avatar,
      title: <AvatarName />,
      render: (
        _: any,
        avatarChildren:
          | string
          | number
          | boolean
          | ReactElement<any, string | JSXElementConstructor<any>>
          | Iterable<ReactNode>
          | ReactPortal
          | null
          | undefined,
      ) => {
        return <AvatarDropdown>{avatarChildren}</AvatarDropdown>;
      },
    },

    //水印
    waterMarkProps: {
      //content: initialState?.currentUser?.name,
    },

    // 底部 copyright
    footerRender: () => <Footer />,

    //这段代码实现了路由守卫功能，主要用于控制用户访问权限。具体来说，每当页面发生变化时（onPageChange），
    //会检查localStorage中是否存在token。如果token不存在且当前访问的路径不是登录页面（loginPath），则会自动重定向到登录页面。
    //这是一个典型的前端权限控制机制，确保未登录用户只能访问登录页面，其他页面都需要登录后才能访问。
    onPageChange: () => {
      const token = localStorage.getItem('token');
      // @ts-ignore
      const { location } = history;
      if (!token && location.pathname !== loginPath) {
        history.push(loginPath);
      }
    },

    bgLayoutImgList: [
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/D2LWSqNny4sAAAAAAAAAAAAAFl94AQBr',
        left: 85,
        bottom: 100,
        height: '303px',
      },
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/C2TWRpJpiC0AAAAAAAAAAAAAFl94AQBr',
        bottom: -68,
        right: -45,
        height: '303px',
      },
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/F6vSTbj8KpYAAAAAAAAAAAAAFl94AQBr',
        bottom: 0,
        left: 0,
        width: '331px',
      },
    ],



    menuHeaderRender: undefined,

    //Pro 中默认会读取 config/config.tsx 中的 routes 配置作为 ProLayout 的菜单数据来生成菜单，
    // 并且配合 plugin-access 还可以很方便的进行菜单的权限管理。这个模式可以满足大部分需求，但是业务的复杂度总是在的，有些时候就需要一些高级的用法。
    //https://beta-pro.ant.design/docs/advanced-menu-cn
    menu: undefined,


    // 左下角 链接
    links: [
      <a
        key="etcd-editor"
        href="https://github.com/chenleijava/etcdv3-editor"
        target="_blank"
        rel="noopener noreferrer"
        style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
      >
        <LinkOutlined />
        <span>etcd-editor</span>
      </a>,
    ],

 

    // SettingDrawer配置
    childrenRender: (children) => {
      //if (initialState?.loading) return <PageLoading />;
      return (
        <>
          {children}
          {
            <SettingDrawer
              disableUrlParams
              enableDarkTheme
              settings={initialState?.settings}
              onSettingChange={(settings) => {
                setInitialState((preInitialState) => ({
                  ...preInitialState,
                  settings,
                }));
              }}
              hideHintAlert={true} // 隐藏底部提示
              hideCopyButton={true} // 隐藏拷贝配置按钮
            />
          }
        </>
      );
    },
    ...initialState?.settings,
  };
};

// 与后端约定的响应数据格式
interface ResponseStructure {
  code: number;
  msg: string;
  data: any;
}

/**
 * 根据构建环境 获取链接服务 URL
 *
 * @param env
 */
function getBaseURLByAppEnv(env: string): string {
  switch (env) {
    case 'docker':
      return 'http://etcd-web-tool:8888';
    case 'dev':
      return 'http://127.0.0.1:8888';
    case 'spa': //内嵌环境
      return 'http://127.0.0.1:8888';
    case 'mock':
      return 'https://proapi.azurewebsites.net';
    default:
      return 'http://127.0.0.1:8888';
  }
}

/**
 * 运行时 网络配置
 * @name request 配置，可以配置错误处理
 * 它基于 axios 和 ahooks 的 useRequest 提供了一套统一的网络请求和错误处理方案。
 * @doc https://umijs.org/docs/max/request#配置
 * 运行时配置示例: https://umijs.org/docs/max/request#%E8%BF%90%E8%A1%8C%E6%97%B6%E9%85%8D%E7%BD%AE%E7%A4%BA%E4%BE%8B
 */
export const request: RequestConfig = {
  //超时设定
  // @ts-ignore
  timeout: 1000,

  //https://proapi.azurewebsites.net
  baseURL: getBaseURLByAppEnv(REACT_APP_ENV),

  // 错误处理： umi@3 的错误处理方案。
  errorConfig: {
    // 错误抛出
    errorThrower: (res) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { code, msg, data } = res as unknown as ResponseStructure;
      if (code !== 0) {
        const error: any = new Error(msg);
        error.name = 'BizError';
        error.info = msg;
        throw error; // 抛出自制的错误
      }
    },

    // 错误接收及处理
    errorHandler: (error: any, opts: any) => {
      if (opts?.skipErrorHandler) throw error;
      // 我们的 errorThrower 抛出的错误。
      if (error.name === 'BizError') {
        const errorInfo: ResponseStructure | undefined = error.info;
        //@ts-ignore
        message.error(errorInfo);
      } else if (error.response) {
        // Axios 的错误
        // 请求成功发出且服务器也响应了状态码，但状态代码超出了 2xx 的范围
        let status = error.response.status;
        //JWT过期，跳转登录页面
        if (status == 401) {
          message.info(`授权过期，请重新登录`);
          history.push(loginPath);
        } else {
          message.error(`Response status:${status}`);
        }
      } else if (error.request) {
        // 请求已经成功发起，但没有收到响应
        // \`error.request\` 在浏览器中是 XMLHttpRequest 的实例，
        // 而在node.js中是 http.ClientRequest 的实例
        message.error('None response! Please retry.');
      } else {
        // 发送请求时出了点问题
        message.error(`${error}`);
      }
    },
  },

  // 请求拦截器
  requestInterceptors: [
    //头部添加 token，基于 JWT对称签名和验证
    (config: RequestOptions) => {
      const token: string | null = localStorage.getItem('token');
      if (token) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token}`,
        };
      }
      return { ...config };
    },
  ],

  // 响应拦截器
  responseInterceptors: [
    // @ts-ignore
    (response) => {
      const { config, status } = response;
      // @ts-ignore
      const { code, msg } = response.data;

      if (code !== 0) {
        let errorMsg = `请求错误 [${status}] ${config.url} 详情: ${msg}`;
        // message.error(errorMsg);
        return Promise.reject(new Error(errorMsg));
      }
      return {
        //response.data 服务端返回的数据 {code:0,msg:'',data:{ token: 'xxx',}}
        //只返回 Response 里面的业务数据
        // @ts-ignore
        data: response.data.data,
      };
    },
  ],
};
