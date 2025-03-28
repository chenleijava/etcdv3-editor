import {ProLayoutProps} from '@ant-design/pro-components';

/**
 * 页面基础布局
 * @name
 */
const proLayoutDefaultSettings: ProLayoutProps & {
  pwa?: boolean;
  logo?: string;
} = {
  title: 'ETCD V3', //显示在布局左上角的产品名，默认值为包名
  navTheme: 'realDark',
  colorPrimary: '#a72109',
  layout: 'mix',
  contentWidth: 'Fixed',
  fixedHeader: false,
  fixSiderbar: true,
  colorWeak: false,
  pwa: true,
  logo: '/etcd.svg',
  token: {
    // 参见ts声明，demo 见文档，通过token 修改样式
    //https://procomponents.ant.design/components/layout#%E9%80%9A%E8%BF%87-token-%E4%BF%AE%E6%94%B9%E6%A0%B7%E5%BC%8F
  },
};
export default proLayoutDefaultSettings;
