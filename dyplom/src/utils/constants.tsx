import { FileSyncOutlined, LinkOutlined, LockOutlined, SyncOutlined, TableOutlined, UnlockOutlined, VideoCameraOutlined } from "@ant-design/icons";
import { Col, Input, InputNumber, Row, Select, Slider } from "antd";
import React from "react";

export const CONST_TRAINS = {
    shuffle: {
        key: 'shuffle',
        icon: <SyncOutlined />,
        label: 'Перемешанные буквы',
        title: 'Перемешанные буквы',
        path: '/shuffle/',
        options: [
            {
                key: 'level',
                label: 'Уровень',
                defaultValue: 1,
                input: (onSelect: (value: number) => void, parent: () => HTMLElement) => <Select placeholder="Уровень" title="Уровень"
                    options={[
                        { value: 1, label: '1' },
                        { value: 2, label: '2' },
                        { value: 3, label: '3' },
                        { value: 4, label: '4' },
                        { value: 5, label: '5' },
                    ]}
                    getPopupContainer={parent}
                    defaultValue={1}
                    onSelect={onSelect}
                    popupMatchSelectWidth={false}
                >
                </Select>
            }
        ]
    },
    clip: {
        key: 'clip',
        icon: <VideoCameraOutlined />,
        label: 'Клип',
        title: 'Клип',
        path: '/clip/',
        options: [
            {
                key: 'level',
                label: 'Уровень',
                defaultValue: 1,
                input: (onSelect: (value: number) => void, parent: () => HTMLElement) => <Select placeholder="Уровень" title="Уровень"
                    options={[
                        { value: 1, label: '1' },
                        { value: 2, label: '2' },
                        { value: 3, label: '3' },
                        { value: 4, label: '4' },
                        { value: 5, label: '5' },
                    ]}
                    getPopupContainer={parent}
                    defaultValue={1}
                    onSelect={onSelect}
                    popupMatchSelectWidth={false}
                >
                </Select>
            },
            {
                key: 'speed',
                label: 'Скорость слов в минуту',
                defaultValue: 100,
                input: (onSelect: (value: number) => void, parent: () => HTMLElement) =>
                    <label style={{ display: 'flex', textWrap: 'nowrap', placeItems: 'baseline', width:'50%' }}>
                        <span style={{ marginRight: '8px' }}>Скорость слов в минуту:</span>
                        <Slider
                            style={{ flex: 1 }}
                            tooltip={{ getPopupContainer: parent }}
                            min={1}
                            max={500}
                            onChange={onSelect}
                            defaultValue={100}
                        />
                    </label>

            }
        ]
    },
    reverse: {
        key: 'reverse',
        icon: <FileSyncOutlined />,
        label: 'Перевёрнутый текст',
        title: 'Перевёрнутый текст',
        path: '/reverse/',
        options: [
            {
                key: 'level',
                label: 'Уровень',
                defaultValue: 1,
                input: (onSelect: (value: number) => void, parent: () => HTMLElement) => <Select defaultValue={1} placeholder="Уровень" title="Уровень"
                    options={[
                        { value: 1, label: 'Все' },
                        { value: 2, label: 'Абзацы' },
                        { value: 3, label: 'Слова' },
                        // { value: 3, label: 'Каждый третий' },
                        // { value: 4, label: 'Каждый четвертый' },
                        // { value: 5, label: 'Каждый пятый' },
                    ]}
                    getPopupContainer={parent}
                    onSelect={onSelect}
                    popupMatchSelectWidth={false}
                >
                </Select>
            }
        ]
    },
    shulte: {
        key: 'shulte',
        icon: <TableOutlined />,
        label: 'Шульте',
        title: 'Шульте',
        path: '/shulte/',
        options: [
            {
                key: 'size',
                label: 'Размер',
                defaultValue: 1,
                input: (onSelect: (value: number) => void, parent: () => HTMLElement) =>
                    <label>
                        <span style={{ marginRight: '8px' }}>Размер:</span>
                        <Select defaultValue={1} placeholder="Уровень" title="Уровень"
                            options={[
                                { value: 1, label: '1' },
                                { value: 2, label: '2' },
                                { value: 3, label: '3' },
                                // { value: 4, label: '4' },
                                // { value: 5, label: '5' },
                            ]}

                            getPopupContainer={parent}
                            onSelect={onSelect}
                            popupMatchSelectWidth={false}
                        >
                        </Select>
                    </label>
            },
            {
                key: 'rotate',
                label: 'Вращать',
                defaultValue: 0,
                input: (onSelect: (value: number) => void, parent: () => HTMLElement) =>
                    <label>
                        <span style={{ marginRight: '8px' }}>Вращать:</span>
                        <Select defaultValue={0} placeholder="Вращать" title="Вращать"
                            options={[
                                { value: 0, label: 'нет' },
                                { value: 2, label: 'да' },
                                // { value: 3, label: '3' },
                                // { value: 4, label: '4' },
                                // { value: 5, label: '5' },
                            ]}

                            getPopupContainer={parent}
                            onSelect={onSelect}
                            popupMatchSelectWidth={false}
                        >
                        </Select>
                    </label>
            },
            {
                key: 'fontSize',
                label: 'Размер',
                defaultValue: 4,
                input: (onSelect: (value: number) => void, parent: () => HTMLElement) =>
                    <label style={{ display: 'flex', textWrap: 'nowrap', placeItems: 'baseline' }}>
                        <span style={{ marginRight: '8px' }}>Размер шрифта:</span>
                        <Input defaultValue={4} placeholder="Уровень" title="Уровень"
                            type="number"
                            style={{ display: 'inline-block' }}
                            max={15}
                            min={1}
                            onChange={(e) => onSelect(Number(e.target.value))}
                        >
                        </Input>
                    </label>
            }
        ]
    },
} as { [key: string]: { key: string, icon: React.ReactNode, label: string, title: string, path: string, options?: { key: string, defaultValue?: number, label: string, input: (onSelect: (value: number) => void, parent: () => HTMLElement) => React.ReactNode }[] } }

export const CONST_ACCESS_LEVELS = {
    private: {
        name: 'Видно только мне',
        icon: <LockOutlined />
    },
    public: {
        name: 'Видно всем',
        icon: <UnlockOutlined />
    },
    access_link: {
        name: 'Доступ по ссылке',
        icon: <LinkOutlined />
    }
}