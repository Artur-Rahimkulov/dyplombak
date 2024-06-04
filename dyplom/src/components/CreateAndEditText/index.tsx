import { HashRouter, Route, Routes, useParams } from 'react-router-dom';
import { Avatar, Button, Card, ConfigProvider, FloatButton, Form, Input, List, Modal, Progress, Space, Tabs, TabsProps, message, theme } from 'antd';
import ru_RU from 'antd/locale/ru_RU';
import { ReflexContainer, ReflexSplitter, ReflexElement } from 'react-reflex';
import 'react-reflex/styles.css';
import styles from '../../App.module.css';
import React, { useEffect, useMemo, useState } from 'react';
import ShowWord from '../../components/ShowWord';
import { Layout } from 'antd';
import { Content, Footer, Header } from 'antd/es/layout/layout';
import { text } from 'stream/consumers';
import { stringToArrayString } from '../../utils/transformText';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';
import { ClockCircleOutlined, CommentOutlined, DislikeOutlined, EyeOutlined, FileSearchOutlined, FullscreenOutlined, LikeOutlined, PaperClipOutlined, PlusOutlined, StarOutlined, UserOutlined } from '@ant-design/icons';
import { QueryParams, TextModelForList } from '../../models/Text';
import TextService from '../../api/text.api';
import { PaginationConfig } from 'antd/lib/pagination';
import { set } from 'mobx';
import Meta from 'antd/es/card/Meta';
import { FavoritesGroup } from '../../models/Favorites';
import FavoritesService from '../../api/favorites.api';
import { get } from 'http';
import StickyBox from 'react-sticky-box';
import RatingService from '../../api/rating.api';
import confirm from 'antd/es/modal/confirm';
/**
 * Renders the main component of the application.
 * 
 * @returns {JSX.Element} The rendered component.
 */

export type FieldType = {
    title: string;
    description: string;
    text: string;
};

interface Props {
    text_id: string | null;
    handleCreateEditText: (values: FieldType) => Promise<void>
}
function CreateEditText({ text_id, handleCreateEditText }: Props) {
    const [form] = Form.useForm();
    const getData = () => {
        if (text_id) {
            TextService.getTextForEdit(text_id)
                .then(res => {
                    if (res) {
                        let fields = { description: res.description, text: res.text, title: res.title } as FieldType;
                        form.setFieldsValue(fields);
                    }
                })
        } else {
            form.resetFields();
        }
    }
    useEffect(() => {
        if (text_id) {
            TextService.getTextForEdit(text_id)
                .then(res => {
                    if (res) {
                        let fields = { description: res.description, text: res.text, title: res.title } as FieldType;
                        form.setFieldsValue(fields);
                    }
                })
        } else {
            form.resetFields();
        }
    }, [text_id])
    const onFinish = (values: FieldType) => {
        handleCreateEditText(values)
        form.resetFields();
    }
    return (
        <Form
            form={form}
            name='add-text'
            // labelCol={{ span: 6 }}
            onReset={getData}
            onFinish={onFinish}
            autoComplete="off"
        >
            <Form.Item<FieldType>
                label="Заголовок"
                name="title"
                rules={[{ required: true, message: 'Заголовок не может быть пустым' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item<FieldType>
                name="description"
                label="Описание"
                rules={[{ required: true, message: 'Описание не может быть пустым' }]}
            >
                <Input.TextArea showCount={true} />
            </Form.Item>
            <Form.Item<FieldType>
                label="Текст"
                name="text"
                rules={[{ required: true, message: 'Текст не может быть пустым' }]}
            >
                <Input.TextArea showCount={true} />
            </Form.Item>
            <Form.Item >
                <div
                    style={{ marginTop: '1em', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', gap: '1em' }}>
                    <Button htmlType='reset'>Очистить</Button>
                    <Button type="primary" htmlType="submit">{(text_id) ? 'Обновить' : 'Добавить'}</Button>
                </div>
            </Form.Item>
        </Form>
    )
}



export default CreateEditText;
