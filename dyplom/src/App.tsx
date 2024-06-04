import React, { useEffect, useState } from 'react';
// import logo from './icons/logo500x500.png';
import './App.css';
import { Route, Routes, BrowserRouter, useNavigate, Navigate } from "react-router-dom";
import { Button, ConfigProvider, Flex, Layout, Menu, Result, theme } from 'antd';
import ru_RU from 'antd/locale/ru_RU';
import ShowText from './pages/ShowText';
import { Content, Footer, Header } from 'antd/es/layout/layout';
import { observer } from "mobx-react-lite";
import styles from './App.module.css';

import Login from './pages/Login';
import authStore from './store/auth.store';
import PrivateRoute from './components/PrivateRoute';
import NotFound from './pages/NotFound';
import Sider from 'antd/es/layout/Sider';
import { LoadingOutlined, LogoutOutlined, MenuFoldOutlined, MenuOutlined, MenuUnfoldOutlined, UploadOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons';
import HeaderAndContent from './components/HeaderAndContent';
import Main from './pages/Main';
import FullScreenWrapper from './components/FullScreenWrapper';
import TextList from './pages/TextTabs';
import Shuffle from './pages/Shuffle';
import Shulte from './pages/Shulte';
import ReverseText from './pages/ReverseText';
import TextTrainWrapper from './components/TextTrainWrapper';
import TrainWrapper from './components/TrainWrapper';

/**
 * Renders the main component of the application.
 * 
 * @returns {JSX.Element} The rendered component.
 */
const App = observer(() => {
  const [spin, setSpin] = useState(true)
  let disableSpinner = () => {
    const spinner = document.getElementById("spinner");
    if (spinner) {
      setTimeout(() => {
        spinner.style.display = 'hidden'
        setSpin(false)
      }, 2000);
    }
  }

  useEffect(() => {
    authStore.checkAuth().then(disableSpinner);
  }, []);

  const getFullScreenWrapper = (children: JSX.Element) => {
    return <FullScreenWrapper>
      {children}
    </FullScreenWrapper>
  }
  const getHeaderAndContentWrapped = (children: JSX.Element, options?: { fullscreen?: boolean, text: boolean, train?: boolean }) => {
    let { fullscreen, text } = options || { fullscreen: false, text: false }
    let child = children
    if (text)
      child = <TextTrainWrapper >{children}</TextTrainWrapper>
    if (options?.train)
      child = <TrainWrapper >{child}</TrainWrapper>
    if (fullscreen)
      child = getFullScreenWrapper(child)
    return <HeaderAndContent>
      {child}
    </HeaderAndContent>
  }
  return (!spin) ? <ConfigProvider locale={ru_RU}>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={getHeaderAndContentWrapped(<Main />)} />
        <Route path="/main" element={getHeaderAndContentWrapped(<Main />)} />

        <Route path="/list/*" element={<PrivateRoute child={getHeaderAndContentWrapped(<TextList />)}/>}>
          {/* <Route element={getHeaderAndContentWrapped(<TextList />)} /> */}
        </Route>
        <Route path="/shuffle/*" element={<PrivateRoute child={getHeaderAndContentWrapped(<Shuffle />, { fullscreen: true, text: true })}/>}>
          {/* <Route element={getHeaderAndContentWrapped(<Shuffle />, { fullscreen: true, text: true })} /> */}
        </Route>
        <Route path="/shulte" element={<PrivateRoute  child={getHeaderAndContentWrapped(<Shulte />, { fullscreen: true, text: false, train: true })}/>}>
          {/* <Route element={getHeaderAndContentWrapped(<Shulte />, { fullscreen: true, text: false, train: true })} /> */}
        </Route>
        <Route path="/reverse/*" element={<PrivateRoute  child={getHeaderAndContentWrapped(<ReverseText />, { fullscreen: true, text: true })}/>}>
          {/* <Route element={getHeaderAndContentWrapped(<ReverseText />, { fullscreen: true, text: true })} /> */}
        </Route>
        <Route path="/clip/*" element={<PrivateRoute  child={getHeaderAndContentWrapped(<ShowText />, { fullscreen: true, text: true })}/>}>
          {/* <Route element={getHeaderAndContentWrapped(<ShowText />, { fullscreen: true, text: true })} /> */}
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </ConfigProvider> : <div id="spinner" className="container">
    <LoadingOutlined style={{ fontSize: '100px', color: 'darkblue' }} />
  </div>

})

export default App;
