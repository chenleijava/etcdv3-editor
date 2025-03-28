import { LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { history, useModel } from '@umijs/max';
import { Spin } from 'antd';
import { createStyles } from 'antd-style';
import { stringify } from 'querystring';
import React, { useCallback } from 'react';
import { flushSync } from 'react-dom';
import HeaderDropdown from '../HeaderDropdown';

export type GlobalHeaderRightProps = {
  menu?: boolean;
  children?: React.ReactNode;
};

// 右上角 Avatar 设置
export const AvatarName = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  return <span className="anticon">{currentUser?.name}</span>;
};

const useStyles = createStyles(({ token }) => {
  return {
    action: {
      display: 'flex',
      height: '48px',
      marginLeft: 'auto',
      overflow: 'hidden',
      alignItems: 'center',
      padding: '0 8px',
      cursor: 'pointer',
      borderRadius: token.borderRadius,
      '&:hover': {
        backgroundColor: token.colorBgTextHover,
      },
    },
  };
});

/**
 * 退出登录，并且将当前的 url 保存
 */
export const AvatarDropdown: React.FC<GlobalHeaderRightProps> = ({ menu, children }) => {
  //获取全局状态管理
  const { initialState, setInitialState } = useModel('@@initialState');

  //登录退出
  const loginOut = async () => {
    //网络请求，用户登出
    //await outLogin();

    //强制同步更新用户状态
    flushSync(() => {
      //清空用户状态,展开 s 对象的其他属性，同时将 currentUser 属性设置为 undefined
      setInitialState((s) => ({ ...s, currentUser: undefined }));
      //清理本地 token
      localStorage.removeItem('token');
    });

    //跳转到登录界面
    const { search, pathname } = window.location;
    const urlParams = new URL(window.location.href).searchParams;

    /** 此方法会跳转到 redirect 参数所在的位置 */
    const redirect = urlParams.get('redirect');
    // Note: There may be security issues, please note
    if (window.location.pathname !== '/user/login' && !redirect) {
      history.replace({
        pathname: '/user/login',
        search: stringify({
          redirect: pathname + search,
        }),
      });
    }
  };

  const onMenuClick = useCallback(async (event: any) => {
    const { key } = event;
    if (key === 'logout') {
      try {
        await loginOut();
      } catch (error) {
        console.error('登出失败:', error);
      }
      return;
    }
    history.push(`/account/${key}`);
  }, []);

  //loading
  const { styles } = useStyles();
  const loading = (
    <span className={styles.action}>
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    </span>
  );

  if (!initialState) {
    return loading;
  }
  const { currentUser } = initialState;
  if (!currentUser || !currentUser.name) {
    return loading;
  }

  let menuItems = [
    ...(menu
      ? [
          {
            key: 'center',
            icon: <UserOutlined />,
            label: '个人中心',
          },
          {
            key: 'settings',
            icon: <SettingOutlined />,
            label: '个人设置',
          },
          {
            type: 'divider' as const,
          },
        ]
      : []),
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
    },
  ];
  return (
    <HeaderDropdown
      menu={{
        selectedKeys: [],
        onClick: onMenuClick,
        items: menuItems,
      }}
    >
      {children}
    </HeaderDropdown>
  );
};
