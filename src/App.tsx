import React, {useState} from 'react';
import {MenuFoldOutlined, MenuUnfoldOutlined,} from '@ant-design/icons';
import {Button, Layout, Menu, theme} from 'antd';
import {BrowserRouter as Router, Link, Route, Routes} from 'react-router-dom';
import './App.css'
import navConfig, {NavItem} from './navConfig';
import './config/websocket'

const {Header, Sider, Content} = Layout;

const renderMenuItems = (items: NavItem[]): React.ReactNode => {
  return items.map((item) => {
    if (item.children) {
      return (
        <Menu.SubMenu key={item.key} icon={item.icon} title={item.name}>
          {renderMenuItems(item.children)}
        </Menu.SubMenu>
      );
    }
    return (
      <Menu.Item key={item.key} icon={item.icon}>
        <Link to={item.path}>{item.name}</Link>
      </Menu.Item>
    );
  });
};

const renderRoutes = (items: NavItem[]): React.ReactNode => {
  return items.flatMap((item) => {
    if (item.children) {
      return (
        <Route key={item.key} path={item.path} element={item.element}>
          {renderRoutes(item.children)}
        </Route>
      );
    }
    return item.element ? <Route key={item.key} path={item.path} element={item.element} /> : [];
  });
};


const App: React.FC = () => {
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: {colorBgContainer, borderRadiusLG},
    } = theme.useToken();

    return (
        <Router>
            <Layout style={{height: '100vh'}}>
            <Sider trigger={null} collapsible collapsed={collapsed}>
                <div className="logo-vertical">
                    <h1>辅助智能系统</h1>
                </div>
                <Menu
                    theme="dark"
                    mode="inline"
                >
                    {renderMenuItems(navConfig)}
                </Menu>
            </Sider>
            <Layout>
                <Header style={{padding: 0, background: colorBgContainer}}>
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
                            {renderRoutes(navConfig)}
                        </Routes>
                    </div>
                </Content>
            </Layout>
        </Layout>
        </Router>
    );
};

export default App;
