/*
 * @Date: 2025-03-28 18:09:58
 * @LastEditors: Ethan chenleijava@gmail.com
 * @LastEditTime: 2025-03-28 19:57:38
 * @FilePath: /etcd-editor/frontend/src/components/Footer/index.tsx
 */
import { DefaultFooter } from '@ant-design/pro-components';
import React from 'react';

const Footer: React.FC = () => {
  return (
    <DefaultFooter
      style={{
        background: 'none',
      }}
      // @ts-ignore
      copyright={<span style={{ color: '#ffffff' }}>写代码只是爱好</span>}
      links={[
        {
          key: 'Ethan',
          title: <span style={{ color: '#ffffff' }}>Ethan业余编程爱好者,</span>,
          href: 'https://my.oschina.net/chenleijava',
          blankTarget: true,
        },
        {
          key: 'Etcd V3 Editor',
          title: <span style={{ color: '#ffffff' }}>Etcd V3 Editor,</span>,
          href: 'https://github.com/ant-design/ant-design-pro',
          blankTarget: true,
        },
        {
          key: 'Ant Design Pro',
          title: <span style={{ color: '#ffffff' }}>Ant Design Pro,</span>,
          href: 'https://pro.ant.design/zh-CN/docs/getting-started',
          blankTarget: true,
        },
        {
          key: 'UMI MAX',
          title: <span style={{ color: '#ffffff' }}>UMI MAX</span>,
          href: 'https://umijs.org/docs/max/introduce',
          blankTarget: true,
        },
      ]}
    />
  );
};

export default Footer;
