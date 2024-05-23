import { Avatar, Button, Card, ColorPicker, ConfigProvider, Divider, FloatButton, Form, Input, List, Modal, Progress, QRCode, Select, Space, Tabs, TabsProps, message, theme } from 'antd';
import 'react-reflex/styles.css';
import React, { useEffect, useMemo, useState } from 'react';
import { ClockCircleOutlined, CommentOutlined, DislikeOutlined, DownloadOutlined, EyeOutlined, FileSearchOutlined, FullscreenOutlined, LikeOutlined, PaperClipOutlined, PlusOutlined, StarOutlined, UserOutlined } from '@ant-design/icons';
import { QueryParams, TextModelForList } from '../../models/Text';
import TextService from '../../api/text.api';
import Meta from 'antd/es/card/Meta';
import { CONST_TRAINS } from '../../utils/constants';
import a from '../../icons/logo500x500.png'
import { Color } from 'antd/es/color-picker';

/**
 * Renders the main component of the application.
 * 
 * @returns {JSX.Element} The rendered component.
 */


interface Props {
    text_id: string | null;
}
function Share({ text_id }: Props) {
    const [access_link, setAccessLink] = useState<string | null>(null);
    const [access_type, setAccessType] = useState<string | null>(null);
    // const [color, setColor] = useState<Color | null>();
    const downloadQRCode = () => {

        const canvas = document.getElementById('myqrcode')?.querySelector<HTMLCanvasElement>('canvas');
        if (canvas) {
            const url = canvas.toDataURL();
            const a = document.createElement('a');
            a.download = 'QRCode.png';
            a.href = url;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    };
    const getData = () => {
        setAccessType(null)
        if (text_id) {
            TextService.getTextForEdit(text_id)
                .then(res => {
                    if (res) {
                        setAccessLink(res.access_link);
                    }
                })
        } else {
            setAccessLink(null);
        }
    }
    useEffect(() => {
        getData()
    }, [text_id])
    const getLink = () => {
        let path = '/list/'
        if (access_type) {
            let access = CONST_TRAINS[access_type]
            if (access) {
                path = access.path
            }
        }
        return window.location.origin + path + 'access_link/' + access_link;
    }
    let copyLink = () => {
        navigator.clipboard.writeText(getLink())
        message.success('Ссылка скопирована в буфер обмена')
    }
    return (
        <div style={{ display: 'flex', flexDirection: 'row', width: '100%', height: '100%', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', flex: 1, flexDirection: 'column', alignItems: 'center', height: '100%' }}>
                <Form
                    name='add-text'
                    // labelCol={{ span: 6 }}
                    onReset={getData}
                    autoComplete="off"
                    size='small'
                    style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', alignItems: 'center' }}

                >
                    <Form.Item
                        label="Открыть текст в"
                    >
                        <Select
                            value={access_type}
                            popupMatchSelectWidth={false}
                            options={[
                                { label: 'Тексты', value: null },
                                ...Object.entries(CONST_TRAINS).map(([key, value]) => ({ label: value.label, value: key }))
                            ]}
                            onSelect={(value) => setAccessType(value)}
                        />
                    </Form.Item>

                </Form>
                <div style={{ flexGrow: 1, height: '100%' }}></div>
                <div style={{ flex: 1, height: '100%' }}>
                    <Button onClick={() => { copyLink() }} size='small' type="primary">Копировать ссылку</Button>
                </div>
            </div>
            <div id='myqrcode' style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <QRCode value={getLink()} icon={a} />
                {/* <Space.Compact size='small'>
                    <ColorPicker value={color} onChangeComplete={(color) => setColor(color)} />
                    <Button icon={<DownloadOutlined />} type='primary'></Button>
                    <Button size='small' onClick={downloadQRCode('png')} type='primary' > PNG</Button>
                    <Button size='small' onClick={downloadQRCode('jpg')} type='primary' > JPG</Button>
                </Space.Compact> */}
                {/* <ColorPicker value={color} onChangeComplete={(color) => setColor(color)} /> */}
                <Button size='small' icon={<DownloadOutlined />} onClick={downloadQRCode} type='primary' > PNG</Button>
            </div>
        </div>
    )
}




export default Share;
