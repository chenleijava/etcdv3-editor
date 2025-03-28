import { Footer } from '@/components';
import { login } from '@/services/etcd-web-tool/login';

import { getFakeCaptcha } from '@/services/ant-design-pro/login';
import {
  AlipayCircleOutlined,
  LockOutlined,
  MobileOutlined,
  TaobaoCircleOutlined,
  UserOutlined,
  WeiboCircleOutlined,
} from '@ant-design/icons';
import {
  LoginForm,
  ProFormCaptcha,
  ProFormCheckbox,
  ProFormText,
} from '@ant-design/pro-components';
import { FormattedMessage, Helmet, history, SelectLang, useIntl, useModel } from '@umijs/max';
import { Alert, message, Tabs, theme } from 'antd';
import { createStyles } from 'antd-style';
import React, { useState } from 'react';
import ProLayoutDefaultSettings from '../../../../config/defaultSettings';

import { flushSync } from 'react-dom';

const useStyles = createStyles(({ token }) => {
  return {
    action: {
      marginLeft: '8px',
      color: 'rgba(0, 0, 0, 0.2)',
      fontSize: '24px',
      verticalAlign: 'middle',
      cursor: 'pointer',
      transition: 'color 0.3s',
      '&:hover': {
        color: token.colorPrimaryActive,
      },
    },
    lang: {
      width: 42,
      height: 42,
      lineHeight: '42px',
      position: 'fixed',
      right: 16,
      borderRadius: token.borderRadius,
      ':hover': {
        backgroundColor: token.colorBgTextHover,
      },
    },
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      overflow: 'auto',
      background: '#241d1d', // 暗黑渐变背景
      margin: '0 auto',
      transition: 'all 0.3s',
      color: '#ffffff', // 文字颜色调整为白色以适应暗黑主题
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.5)', // 添加阴影增强层次感
      padding: '20px', // 内边距让内容更舒适
    },
  };
});

//  登录方式 对应 icon 组件
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ActionIcons = () => {
  const { styles } = useStyles();

  return (
    <>
      <AlipayCircleOutlined key="AlipayCircleOutlined" className={styles.action} />
      <TaobaoCircleOutlined key="TaobaoCircleOutlined" className={styles.action} />
      <WeiboCircleOutlined key="WeiboCircleOutlined" className={styles.action} />
    </>
  );
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Lang = () => {
  const { styles } = useStyles();
  return (
    <div className={styles.lang} data-lang>
      {SelectLang && <SelectLang />}
    </div>
  );
};

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => {
  return (
    <Alert
      style={{
        marginBottom: 24,
      }}
      message={content}
      type="error"
      showIcon
    />
  );
};

const Login: React.FC = () => {
  const [userLoginState, setUserLoginState] = useState<API.LoginResult>({});

  const { token } = theme.useToken();

  //用户登录类型
  const [type, setType] = useState<string>('account');
  const { styles } = useStyles(token);

  const intl = useIntl();

  const { initialState, setInitialState } = useModel('@@initialState');

  //处理登录
  const handleSubmit = async (values: any) => {
    try {
      //返回 token 及用户相关信息
      const data = await login(values);
      if (data.token) {
        //登录成功，处理用户状态
        //fetchUserInfo 测试 全局获取能力 userInfo
        let userInfo = await initialState?.fetchUserInfo?.();
        if (userInfo) {
          flushSync(() => {
            localStorage.setItem('token', data.token);
            setInitialState((s: any) => ({
              ...s,
              currentUser: {
                name: values.username,
                avatar: userInfo.avatar,
              },
            }));
          });
        }

        const urlParams = new URL(window.location.href).searchParams;
        const redirect = urlParams.get('redirect');
        /**
         实现了登录成功后的页面跳转逻辑。首先从URL中获取redirect参数，
         如果redirect参数存在且不是指向登录页面（不以'/user/login'开头），
         则使用history.push跳转到redirect指定的页面；否则，跳转到默认的'/dashboard/etcd'页面。
         这种设计可以支持从其他页面重定向到登录页面，登录成功后自动返回原页面的功能。
         */
        const loginPath = initialState?.loginPath;
        if (redirect && !redirect.startsWith(loginPath as string)) {
          history.push(redirect);
        } else {
          // 登录成功，跳转到指定页面
          history.push('/etcd');
        }
      }
    } catch (error) {
      // 错误已经在响应拦截器中处理
      console.error('Login failed:', error);
    }
  };

  //
  const { status, type: loginType } = userLoginState;

  return (
    <div className={styles.container}>
      <Helmet>
        <title>
          {intl.formatMessage({
            id: 'menu.login',
            defaultMessage: '登录页',
          })}
          - {ProLayoutDefaultSettings.title}
        </title>
      </Helmet>

      {/*<Lang />*/}

      <div
        style={{
          flex: '1',
          padding: '32px 0',
        }}
      >
        <LoginForm
          contentStyle={{
            maxWidth: '75vw',
            padding: '24px',
            backgroundColor: '#262222',
            border: `1px solid ${token.colorBorder}`,
            borderRadius: token.borderRadius,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
          }}
          logo={
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <img
                src="/etcd.svg"
                alt="ETCD Logo"
                style={{
                  width: '160px',  // 固定宽度
                  height: 'auto',
                  margin: '1rem auto',
                  objectFit: 'contain',
                }}
              />
            </div>
          }
          title={
            <div
              style={{
                fontSize: 'clamp(24px, 3vw, 32px)',
                color: '#edf1f2',
                fontWeight: 600,
                textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
                letterSpacing: '1px',
              }}
            >
              Etcd V3 Editor
            </div>
          }
          // subTitle={intl.formatMessage({id: 'pages.layouts.userLayout.title'})}

          subTitle={
            <div
              style={{
                fontSize: 'clamp(16px, 3vw,16px)',
                color: '#edf1f2',
                fontWeight: 500,
                textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
                letterSpacing: '1px',
              }}
            >
              Etcd V3 可视化编辑工具
            </div>
          }
          initialValues={{
            autoLogin: true,
          }}
          // actions={[
          //   <FormattedMessage
          //     key="loginWith"
          //     id="pages.login.loginWith"
          //     defaultMessage="其他登录方式"
          //   />,
          //   <ActionIcons key="icons" />,
          // ]}
          onFinish={async (values) => {
            await handleSubmit(values as API.LoginParams);
          }}
        >
          <Tabs
            activeKey={type}
            onChange={setType}
            centered
            // items={[
            //   {
            //     key: 'account',
            //     label: intl.formatMessage({
            //       id: 'pages.login.accountLogin.tab',
            //       defaultMessage: '账户密码登录',
            //     }),
            //   },
            //   {
            //     key: 'mobile',
            //     label: intl.formatMessage({
            //       id: 'pages.login.phoneLogin.tab',
            //       defaultMessage: '手机号登录',
            //     }),
            //   },
            // ]}
          />

          {status === 'error' && loginType === 'account' && (
            <LoginMessage
              content={intl.formatMessage({
                id: 'pages.login.accountLogin.errorMessage',
                defaultMessage: '账户或密码错误',
              })}
            />
          )}
          {type === 'account' && (
            <>
              <ProFormText
                name="username"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined style={{ color: token.colorTextSecondary }} />,
                }}
                placeholder={intl.formatMessage({
                  id: 'pages.login.username.placeholder',
                  defaultMessage: '用户名',
                })}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.username.required"
                        defaultMessage="请输入用户名!"
                      />
                    ),
                  },
                ]}
              />
              <ProFormText.Password
                name="password"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined style={{ color: token.colorTextSecondary }} />,
                }}
                placeholder={intl.formatMessage({
                  id: 'pages.login.password.placeholder',
                  defaultMessage: '密码',
                })}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.password.required"
                        defaultMessage="请输入密码！"
                      />
                    ),
                  },
                ]}
              />
            </>
          )}

          {status === 'error' && loginType === 'mobile' && <LoginMessage content="验证码错误" />}

          {type === 'mobile' && (
            <>
              <ProFormText
                fieldProps={{
                  size: 'large',
                  prefix: <MobileOutlined />,
                }}
                name="mobile"
                placeholder={intl.formatMessage({
                  id: 'pages.login.phoneNumber.placeholder',
                  defaultMessage: '手机号',
                })}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.phoneNumber.required"
                        defaultMessage="请输入手机号！"
                      />
                    ),
                  },
                  {
                    pattern: /^1\d{10}$/,
                    message: (
                      <FormattedMessage
                        id="pages.login.phoneNumber.invalid"
                        defaultMessage="手机号格式错误！"
                      />
                    ),
                  },
                ]}
              />
              <ProFormCaptcha
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined />,
                }}
                captchaProps={{
                  size: 'large',
                }}
                placeholder={intl.formatMessage({
                  id: 'pages.login.captcha.placeholder',
                  defaultMessage: '请输入验证码',
                })}
                captchaTextRender={(timing, count) => {
                  if (timing) {
                    return `${count} ${intl.formatMessage({
                      id: 'pages.getCaptchaSecondText',
                      defaultMessage: '获取验证码',
                    })}`;
                  }
                  return intl.formatMessage({
                    id: 'pages.login.phoneLogin.getVerificationCode',
                    defaultMessage: '获取验证码',
                  });
                }}
                name="captcha"
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.captcha.required"
                        defaultMessage="请输入验证码！"
                      />
                    ),
                  },
                ]}
                onGetCaptcha={async (phone) => {
                  const result = await getFakeCaptcha({
                    phone,
                  });
                  if (!result) {
                    return;
                  }
                  message.success('获取验证码成功！验证码为：1234');
                }}
              />
            </>
          )}
          <div
            style={{
              marginBottom: 24,
            }}
          >
            <ProFormCheckbox noStyle name="autoLogin">
              <div
                style={{
                  fontWeight: 'bold',
                  color: '#edf1f2',
                }}
              >
                <FormattedMessage id="pages.login.rememberMe" defaultMessage="自动登录" />
              </div>
            </ProFormCheckbox>
            <a
              style={{
                float: 'right',
              }}
            >
              <div
                style={{
                  fontWeight: 'bold',
                  color: '#edf1f2',
                }}
              >
                <FormattedMessage id="pages.login.forgotPassword" defaultMessage="忘记密码" />
              </div>
            </a>
          </div>
        </LoginForm>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
