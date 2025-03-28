import { DefaultFooter } from '@ant-design/pro-components';
import React from 'react';

const Footer: React.FC = () => {
  return (
    <DefaultFooter
      style={{
        background: 'none',
      }}
      copyright="写代码只是爱好"
      links={[
        {
          key: 'Ethan',
          title: 'Ethan 业余编程爱好者,',
          href: 'https://my.oschina.net/chenleijava',
          blankTarget: true,
        },
        {
          key: 'Etcd V3 Editor',
          title: 'Etcd V3 Editor,',
          href: 'https://github.com/ant-design/ant-design-pro',
          blankTarget: true,
        },
        {
          key: 'Ant Design Pro',
          title: 'Ant Design Pro,',
          href: 'https://pro.ant.design/zh-CN/docs/getting-started',
          blankTarget: true,
        },
        {
          key: 'UMI MAX',
          title: 'UMI MAX',
          href: 'https://umijs.org/docs/max/introduce',
          blankTarget: true,
        },
      ]}
    />
  );
};

export default Footer;
