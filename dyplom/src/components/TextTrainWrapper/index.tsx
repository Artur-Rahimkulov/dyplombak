import { Navigate, Outlet, Route, useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import authStore from "../../store/auth.store";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { Button, Flex, FloatButton, Layout, Modal, Tooltip, message, theme } from "antd";
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
const TextTrainWrapper = ({ children }: Props) => {
  const [selectText, setSelectText] = useState<boolean>(false);
  const [text, setText] = useState<TextModelForReadEdit | null>(null);
  const [optionsInput, setOptionsInput] = useState<{ key: string, label: string, input: (onSelect: (value: number) => void, parent: () => HTMLElement) => React.ReactNode }[]>([]);
  const [options, setOptions] = useState<{ [key: string]: any }>({});
  const navigate = useNavigate()
  const {
    token: { colorBgContainer, borderRadiusLG, colorInfoBg, colorBgBase, colorBgContainerDisabled },
  } = theme.useToken();
  const handleSelect = (id: string, href?: boolean) => {
    TextService.getTextForRead(id).then(res => {
      if (res) {
        if (!href)
          navigate(window.location.pathname + '/id/' + res._id)
        setText(res)
        setSelectText(false);
      }
    })
  }
  const TextController = {
    saveAccessLink: (access_link: string) => {
      TextService.getTextWithAccessLink(access_link)
        .then(res => {
          let page = window.location.href.split(window.location.origin)[1].split('/')[1]
          if (res != null) {
            message.success({
              content: 'Текст полученный по ссылке сохранен во вкладке "Доступ по ссылке" страницы "Мои тексты"',
              key: 'success',
            });
            navigate('/' + page + '/id/' + res._id)
            setText(res)
          } else {
            navigate('/' + page)
          }
        }
        )
    },
  }
  useEffect(() => {
    setOptionsInput([])
    setOptions({})
    let key = window.location.href.split(window.location.origin)[1].split('/')[1]
    console.log(key)
    if (CONST_TRAINS[key]) {
      setTimeout(() => {
        const options = CONST_TRAINS[key].options
        if (options) {
          setOptionsInput([...options])
          options.forEach(option => {
            if (option.defaultValue)
              setOptions({ ...options, [option.key]: option.defaultValue })
          })
        }
      }, 1);

    }
    if (window.location.href.includes('/id/')) {
      handleSelect(window.location.href.split('/id/')[1].split('/')[0], true)
    } else
      if (window.location.href.includes('/access_link/')) {
        let access_link = window.location.href.split('/access_link/')[1].split('/')[0]
        TextController.saveAccessLink(access_link)
      }
      else setSelectText(true)
  }, [children])
  return <div style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
    <Layout
      style={{ height: '100%', overflow: 'auto', width: '100%', display: 'flex', flexDirection: 'column', flex: 1 }}
    >
      <Header style={{
        padding: 0,
        // background: colorBgContainer,
        background: colorBgContainerDisabled,
        borderRadius: borderRadiusLG,
        // margin: '12px 8px',
        height: 'max-content',
        marginBottom: '12px',
      }}>
        <Flex
          id="popap-container"
          justify='left'
          align='center'
          style={{
            placeItems: 'baseline',
            lineHeight: '100%',
          }}
          gap={8}
        >
          <Typography >{text?.title && text?.title.length > 20 ? <Tooltip title={text.title}>{text?.title.substring(0, 30) + '...'}</Tooltip> : text?.title}</Typography>
          <Button icon={<MenuOutlined />} onClick={() => setSelectText(true)}>Выбрать Текст</Button>
          {/* <Button icon={<SettingOutlined />}>Настройки</Button> */}
          {optionsInput.map(option => option.input(
            (value) => setOptions({ ...options, [option.key]: value }),
            () => {
              let cont = document.getElementById('popap-container')
              if (cont)
                return cont
              else return document.body
            }

          ))}
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
        {React.cloneElement(children, { text, options })}
      </Content>
    </Layout>
    <Modal
      getContainer={() => {
        let cont = document.getElementById('popap-container')
        if (cont)
          return cont
        else return document.body
      }}
      title={'Выбрать текст'}
      open={selectText}
      destroyOnClose={true}
      onOk={() => {
        setSelectText(false);
      }}
      width={'90%'}
      onCancel={() => {
        setSelectText(false);
      }}
      footer={null}>
      <TextTabs selectMode={true} onSelect={handleSelect} />
    </Modal >
  </div>
};

export default TextTrainWrapper;