import { Navigate, Outlet, Route, useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import authStore from "../../store/auth.store";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { Button, Flex, FloatButton, Layout, Modal, theme } from "antd";
import styles from "./../../App.module.css";
import { FullscreenExitOutlined, FullscreenOutlined, MenuOutlined, SettingOutlined } from "@ant-design/icons";
import { Content, Header } from "antd/es/layout/layout";
import React, { useEffect, useState } from "react";
import TextTabs from "../../pages/TextTabs";
import { TextModelForReadEdit } from "../../models/Text";
import TextService from "../../api/text.api";
import Typography from "antd/es/typography/Typography";
import { CONST_TRAINS } from "../../utils/constants";

interface Props {
  children: JSX.Element;
}
const TrainWrapper = ({ children }: Props) => {
  const [optionsInput, setOptionsInput] = useState<{ key: string, defaultValue?: number, label: string, input: (onSelect: (value: number) => void, parent: () => HTMLElement) => React.ReactNode }[]>([]);
  const [options, setOptions] = useState<{ [key: string]: any }>({});
  const {
    token: { colorBgContainer, borderRadiusLG, colorInfoBg, colorBgBase, colorBgContainerDisabled },
  } = theme.useToken();

  useEffect(() => {
    let key = window.location.href.split(window.location.origin)[1].split('/')[1]
    console.log(key)
    if (CONST_TRAINS[key]) {
      const options = CONST_TRAINS[key].options
      if (options){
        setOptionsInput(options)
        options.forEach(option => {
          if (option.defaultValue)
            setOptions({ ...options, [option.key]: option.defaultValue })
        })
      }
    }
  }, [])
  return <div style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
    <Layout
      style={{ height: '100%', overflow: 'auto', width: '100%', display: 'flex', flexDirection: 'column', flex: 1 }}
    >
      <Header style={{
        padding: 0,
        background: colorBgContainerDisabled,
        borderRadius: borderRadiusLG,
        // margin: '12px 8px',
        height: 'max-content',
        marginBottom: '12px',
      }}>
        <Flex
          id='popap-container'
          justify='left'
          align='center'
          style={{
            placeItems: 'baseline',
            lineHeight: '100%',
          }}
          gap={10}
        >
          {/* <Button disabled={true} icon={<SettingOutlined />}>Настройки</Button> */}
          {optionsInput.map(option => {
            return option.input((value) => setOptions({ ...options, [option.key]: value }),
              () => {
                let cont = document.getElementById('popap-container')
                if (cont)
                  return cont
                else return document.body
              })
          })}
        </Flex>
      </Header>
      <Content
        style={{
          display: 'flex',
          flexDirection: 'column',
          overflow: 'auto',
          height: '100%',
          flex: 1
        }}
      >
        {React.cloneElement(children, { options })}
      </Content>
    </Layout>
  </div>
};

export default TrainWrapper;