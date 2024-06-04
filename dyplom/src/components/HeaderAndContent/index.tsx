import { Button, Flex, Layout, Menu, Result, Typography, theme } from 'antd';
import 'react-reflex/styles.css';
import { observer } from 'mobx-react-lite';
import { useLocation, useNavigate } from 'react-router-dom';
import { Content, Header } from 'antd/es/layout/layout';
import Sider from 'antd/es/layout/Sider';
import styles from '../../App.module.css'
import { EyeOutlined, FileSyncOutlined, FileTextOutlined, HomeOutlined, LoginOutlined, LogoutOutlined, MenuFoldOutlined, MenuOutlined, MenuUnfoldOutlined, ReadOutlined, SignatureOutlined, SyncOutlined, TableOutlined, UploadOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import authStore from '../../store/auth.store';
import a from '../../icons/logo500x500.png'
import { MenuInfo } from 'rc-menu/lib/interface';
import { ItemType, MenuItemType } from 'antd/es/menu/hooks/useItems';
import { title } from 'process';
import { set } from 'mobx';
/**
 * Renders the main component of the application.
 * 
 * @returns {JSX.Element} The rendered component.
 */
interface Props {
  children: React.ReactNode;
}
function getTitlesFromItems(items: ItemType<MenuItemType>[]): { key: string, title: string }[] {
  let titles = [] as { key: string, title: string }[]
  items.map((item: any) => {
    if (item?.children) {
      titles.push(...getTitlesFromItems(item.children))
    }
    titles.push({
      key: item.key,
      title: item.title
    })
  })
  return titles
}
function HeaderAndContent(props: Props) {
  const [collapsed, setCollapsed] = useState(true);
  const [title, setTitle] = useState('');
  const path = useLocation();
  const navigate = useNavigate()

  const items = [
    {
      key: 'main',
      icon: <HomeOutlined />,
      label: 'Главная',
      title: 'Главная',
      onClick: (info) => navigateTo(info, '/main'),
    },
    {
      key: 'list',
      icon: <MenuOutlined />,
      label: 'Тексты',
      title: 'Тексты',
      onClick: (info) => navigateTo(info, '/list')
    },
    {
      key: 'train',
      icon: <ReadOutlined />,
      label: 'Тренажеры',
      title: 'Тренажеры',
      // onClick: (info) => { navigateTo(info, '') },
      children: [
        {
          key: 'text',
          icon: <FileTextOutlined />,
          label: 'С текстом',
          title: 'С текстом',
          popupOffset: [0, 0],
          type: collapsed ? 'group' : undefined,
          children: [
            {
              key: 'shuffle',
              icon: <SyncOutlined />,
              label: 'Перемешанные',
              title: 'Перемешанные буквы',
              onClick: (info) => navigateTo(info, '/shuffle')
            },
            {
              key: 'clip',
              icon: <VideoCameraOutlined />,
              label: 'RSPV',
              title: 'RSPV',
              onClick: (info) => navigateTo(info, '/clip')

            },
            {
              key: 'reverse',
              icon: <FileSyncOutlined />,
              label: 'Перевёрнутый',
              title: 'Перевёрнутый текст',
              onClick: (info) => navigateTo(info, '/reverse')
            },
          ]
        },
        {
          key: 'perifery',
          icon: <EyeOutlined />,
          label: 'Периферия',
          title: 'Периферия',
          type: collapsed ? 'group' : undefined,
          // onClick: (info) => { navigateTo(info, '') },
          children: [
            {
              key: 'shulte',
              icon: <TableOutlined />,
              label: 'Шульте',
              title: 'Таблица Шульте',
              onClick: (info) => navigateTo(info, '/shulte')
            },
          ]
        },
      ]
    },
    {
      key: 'exit',
      label: authStore.isAuth ? 'Выход' : 'Войти',
      style: {
        position: 'absolute', bottom: '0px'
      },
      icon: authStore.isAuth ? <LogoutOutlined /> : <LoginOutlined />,
      onClick: () => {
        if (authStore.isAuth)
          authStore.logout()
        else navigate('/login')
      }
    }

  ] as ItemType<MenuItemType>[]

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    let title = getTitlesFromItems(items).find(t => t.key === path.pathname.split('/')[1])?.title
    let newTitle = title ? title : 'Читай быстрее'
    setTitle(newTitle)
    document.title = newTitle
  }, [path.pathname])

  const navigateTo = (info: MenuInfo, path: string) => {
    info.domEvent.stopPropagation();
    info.domEvent.preventDefault();
    if (path !== '') {
      navigate(path)
    }
  }

  return (
    <div className="App">
      <div className={styles.container}>
        <Layout>
          <Sider trigger={null} collapsible collapsed={collapsed}>
            <img src={a} onClick={() => setCollapsed(!collapsed)} width={50} height={50} style={{ margin: '9px', borderRadius: '8px' }} color='black' />
            <Menu
              theme="dark"
              mode="inline"
              selectedKeys={[path.pathname.split('/')[1]== '' ? 'main' : path.pathname.split('/')[1]] }
              items={items}
            />
          </Sider>
          <Layout
            style={{ height: '100%', overflow: 'auto', width: '100%', display: 'flex', flexDirection: 'column' }}
          >
            <Header style={{
              padding: 0,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
              // margin: '12px 8px',
            }}>
              <Flex
                justify='left'
                align='center'
                style={{
                  placeItems: 'baseline',
                }}
              >
                <Button
                  type="text"
                  icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                  onClick={() => setCollapsed(!collapsed)}
                  style={{
                    fontSize: '24px',
                    width: 'auto',
                    height: 64,
                    marginRight: 16
                  }}
                >{title}</Button>

              </Flex>
            </Header>
            <Content
              style={{
                margin: '12px 8px',
                padding: 12,
                minHeight: 280,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'auto',
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
              }}
            >
              {props.children}
            </Content>
          </Layout>
        </Layout>
      </div>
    </div>
  )
}

export default observer(HeaderAndContent);
