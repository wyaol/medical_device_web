import React, {useState} from 'react';
import {MenuFoldOutlined, MenuUnfoldOutlined,} from '@ant-design/icons';
import {Button, Layout, Menu, theme} from 'antd';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import './App.css'
import items from './navConfig';
import './config/websocket'
import routeConfig from "./routes";

const {Header, Sider, Content} = Layout;


const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: {colorBgContainer, borderRadiusLG},
  } = theme.useToken();

  return (
    <Router>
      <Layout>
        <Sider style={{height: '100vh'}} trigger={null} collapsible collapsed={collapsed}
               className={'rr-block'}>
          <div className="logo-vertical">
            <h1>辅助智能系统</h1>
          </div>
          <Menu mode="inline" items={items} theme="dark"/>
        </Sider>
        <Layout>
          <Header style={{padding: 0, background: colorBgContainer}} className={'rr-block'}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined/> : <MenuFoldOutlined/>}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: '16px',
                width: 64,
                height: 64,
              }}
            />
          </Header>
          <Content
            style={{
              margin: '24px 16px',
              padding: 24,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <div className="site-layout-content">
              <Routes>
                {routeConfig.map((route) => (
                  <Route key={route.path} path={route.path} element={route.element}/>
                ))}
              </Routes>
            </div>
          </Content>
        </Layout>
      </Layout>
    </Router>
  );
};

export default App;
