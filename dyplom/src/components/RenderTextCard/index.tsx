import { Avatar, Badge, Card, Dropdown, Flex, List, Select, Space, Tag, Tooltip, Typography, message, } from 'antd';
import 'react-reflex/styles.css';
import React, { useState } from 'react';
import { BarsOutlined, CopyOutlined, DeleteOutlined, DislikeOutlined, EditOutlined, ExportOutlined, EyeInvisibleOutlined, EyeOutlined, FileSyncOutlined, LikeOutlined, LinkOutlined, LockOutlined, ReadOutlined, SyncOutlined, UnlockOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { TextModelForList } from '../../models/Text';
import Meta from 'antd/es/card/Meta';
import { FavoritesGroup } from '../../models/Favorites';
import moment from 'moment';
import { User } from '../../models/User';
import { ItemType } from 'antd/es/menu/hooks/useItems';
import { CONST_ACCESS_LEVELS, CONST_TRAINS } from '../../utils/constants';
/**
 * Renders the main component of the application.
 * 
 * @returns {JSX.Element} The rendered component.
 */
const tagInputStyle: React.CSSProperties = {
    width: '100%',
    height: 22,
    // marginInlineEnd: 8,
    margin: 0,

    verticalAlign: 'top',
};

const tagPlusStyle: React.CSSProperties = {
    height: 22,
    padding: 0,
    marginLeft: '1em',
    // background: token.colorBgContainer,
    borderStyle: 'dashed',
};
const getRandomLightColorFromText = (text: string) => {
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
        hash = text.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = '#';
    for (let i = 0; i < 3; i++) {
        let value = (hash >> (i * 8)) & 0xFF;
        color += ('00' + value.toString(16)).substr(-2);
    }
    return color;
}
function getOptimalTextColor(hexColor: string) {
    // Преобразуем шестнадцатеричный цвет в RGB
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);

    // Вычисляем яркость цвета по формуле:
    // Яркость = (0.299 * R + 0.587 * G + 0.114 * B)
    const brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    // Определяем оптимальный цвет для текста
    if (brightness > 0.5) {
        // Если фон слишком светлый, возвращаем черный текст
        return '#000000';
    } else {
        // Если фон слишком темный, возвращаем белый текст
        return '#ffffff';
    }
}
function RenderTextCard({
    item,
    handleRate,
    handleEdit,
    navigate,
    selectMode,
    user,
    handleDelete,
    handleCopy,
    handleShare,
    onSelect,
    handleAccessLevel,
    favoritesGroups,
    addToGroup,
    deleteFromGroup
}: {
    item: TextModelForList,
    handleRate: (item: TextModelForList, type: string) => void,
    handleEdit: (item: TextModelForList) => void,
    handleCopy: (item: TextModelForList) => void,
    user: User | null,
    onSelect?: (id: string) => void
    selectMode?: boolean,
    handleAccessLevel: (item: TextModelForList, level: 'private' | 'public' | 'access_link') => void,
    navigate: (path: string) => void,
    handleDelete: (item: TextModelForList) => void,
    handleShare: (item: TextModelForList) => void,
    favoritesGroups: FavoritesGroup[],
    addToGroup: (group: string, text: TextModelForList) => Promise<any>,
    deleteFromGroup: (group: string, text: TextModelForList) => Promise<any>
}
) {
    const [expand, setExpand] = useState(false);
    const handleAddToGroup = (group: string, text: TextModelForList) => {
        addToGroup(group, text)
            .then(res => {
                if (res != null) {
                }
                return res
            })
    }
    let getSelect = () => {
        let favs = item.user.favorites ? item.user.favorites.map(fav => fav.group) : []
        let options = favoritesGroups.filter(group => !favs.includes(group._id)).map(group => ({ label: group.name, value: group._id }))
        if (options.length == 0) return null
        return <Tag style={tagPlusStyle}>
            <Select
                size="small"
                style={tagInputStyle}
                bordered={false}
                value={null}
                placeholder="Новый тэг"
                popupMatchSelectWidth={false}
                title='Новый тэг'
                options={options}
                onSelect={(e, option) => handleAddToGroup(option.value as string, item)}
            />

        </Tag>
    }
    const getItem = (children: JSX.Element) => {
        // if (moment(item.createdAt).isBetween(moment().subtract(1, 'hour'), moment())) {
        //     return <Badge.Ribbon text='New' color='red'>
        //         {children}
        //     </Badge.Ribbon>
        // }
        return children
    }
    const handleCopyShare = () => {

    }
    return (
        getItem(<List.Item style={{ height: '100%', flex: 1, width: '100%', padding: 3, margin: 3, display: 'flex', flexDirection: 'column', minHeight: '290px' }}>


            <Card
                onClick={() => onSelect && onSelect(item._id)}
                style={{
                    height: '100%', flex: 1, width: '100%', display: 'flex', flexDirection: 'column',
                }}
                hoverable={true}
                styles={{
                    actions: {
                        padding: 0,
                        margin: 0,
                    },
                    body: {
                        padding: 12,
                        flexGrow: 1,
                        paddingBottom: 0,
                        display: 'flex',
                        flexDirection: 'column',
                    }
                }}
                actions={!selectMode ? [
                    <IconText
                        icon={item.user.lastReaded ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                        style={item.user.lastReaded ? { color: '#1890ff' } : {}}
                        text={item.views + ''}
                        key="list-vertical-star-o" />,
                    <IconText
                        style={(item.user.liked == 1) ? { color: '#1890ff' } : {}}

                        onClick={() => handleRate(item, 'like')}
                        icon={<LikeOutlined />}
                        text={item.likes + ''}
                        key="list-vertical-like-o" />,
                    <IconText
                        style={(item.user.liked == 0) ? { color: '#1890ff' } : {}}
                        onClick={() => handleRate(item, 'dislike')}
                        icon={<DislikeOutlined />}
                        text={item.dislikes + ''}
                        key="list-vertical-message" />,
                    <Dropdown menu={{
                        items: Object.entries(CONST_TRAINS).map(
                            ([key, value], index, arr) => ({
                                key: value.key,
                                icon: value.icon,
                                label: value.label,
                                title: value.title,
                                onClick: (info) => navigate(value.path + 'id/' + item._id)
                            }))
                    }}
                        trigger={['click']}>
                        <ReadOutlined />
                    </Dropdown>,
                    <Dropdown menu={{
                        items: [
                            { key: '1', disabled: user?._id != item.author._id, label: 'Редактировать', onClick: () => handleEdit(item), icon: <EditOutlined /> },
                            { key: '3', label: 'Копировать к себе', onClick: () => handleCopy(item), icon: <CopyOutlined /> },
                            { type: 'divider' },
                            { key: '2', disabled: user?._id != item.author._id, label: 'Удалить', danger: true, onClick: () => handleDelete(item), icon: <DeleteOutlined /> },
                        ]
                    }}
                        trigger={['click']}>
                        <BarsOutlined />
                    </Dropdown>

                ] : []}
            >
                <Meta
                    style={{ flexGrow: 1 }}
                    avatar={
                        <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', gap: '4px', justifyContent: 'space-between' }}>
                            <Tooltip title={'Автор: ' + item.author.username} placement='bottom' color='gray'>
                                <Avatar size='small' icon={<UserOutlined />} />
                            </Tooltip>
                            {user?._id == item.author._id && !selectMode && <>
                                <Dropdown menu={{
                                    items: Object.entries(CONST_ACCESS_LEVELS).map(([key, value], index) => ({
                                        key: key,
                                        label: value.name,
                                        icon: value.icon,
                                        title: value.name,
                                        onClick: () => handleAccessLevel(item, key as 'private' | 'public' | 'access_link')
                                    } as ItemType))
                                }}
                                    trigger={['click']}>
                                    <Tooltip title={'Приватность: ' + CONST_ACCESS_LEVELS[item.accessLevel].name} placement='top' color='gray'>
                                        <Avatar size='small' icon={CONST_ACCESS_LEVELS[item.accessLevel].icon} shape='square' style={{ backgroundColor: '#eee', color: '#000' }} />
                                    </Tooltip>
                                </Dropdown>
                                {item.access_link && item.accessLevel == 'access_link' &&
                                    <Tooltip title={'Скопировать ссылку'} placement='top' color='gray'>
                                        <Avatar size='small' icon={<ExportOutlined />} onClick={() => handleShare(item)} shape='square' style={{ backgroundColor: '#eee', color: '#000' }} />
                                    </Tooltip>
                                }
                            </>}

                        </div>

                    }

                    title={<span>{item.title}</span>}
                    description={

                        <Typography.Paragraph style={{
                            whiteSpace: expand ? 'pre-line' : '',
                        }}
                            ellipsis={{
                                expanded: expand,
                                expandable: 'collapsible',
                                rows: 5,
                                symbol: (expanded) => {
                                    if (!expanded)
                                        return <Typography.Link onClick={() => setExpand(true)}>Показать ещё</Typography.Link>
                                    return <Typography.Link onClick={() => setExpand(false)}>Скрыть</Typography.Link>
                                },
                            }}

                        >
                            {item.description}

                        </Typography.Paragraph>}
                />


                <Flex gap="4px 0" wrap='wrap' style={{ marginTop: '0px', marginBottom: '8px' }}>
                    <Typography.Text style={{ fontSize: '0.8em', color: '#999' }}>Теги:</Typography.Text>
                    {item.user.favorites?.map<React.ReactNode>((tag, index) => {
                        let name = favoritesGroups.find(group => group._id == tag.group)?.name;
                        if (name) {
                            const isLongTag = name.length > 20;
                            const tagElem = (
                                <Tag
                                    key={tag._id}
                                    closable={true}
                                    style={{
                                        userSelect: 'none',
                                        display: 'flex',
                                        alignItems: 'baseline',
                                        color: getOptimalTextColor(getRandomLightColorFromText(tag.group)),
                                        justifyContent: 'center', margin: 0, marginLeft: '8px'
                                    }}
                                    color={getRandomLightColorFromText(tag.group)}

                                    onClose={() => deleteFromGroup(tag.group, item)}
                                >
                                    <span
                                    >
                                        {isLongTag ? `${name.slice(0, 20)}...` : name}
                                    </span>
                                </Tag>
                            );
                            return isLongTag ? (
                                <Tooltip title={name} key={tag._id}>
                                    {tagElem}
                                </Tooltip>
                            ) : (
                                tagElem
                            );
                        } else return null
                    })
                    }
                    {!selectMode && getSelect()}

                </Flex>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Typography.Text style={{ fontSize: '0.8em', color: '#999' }}>Добавлено: {moment(item.createdAt).format('DD.MM.YYYY HH:mm')}</Typography.Text>
                    <Typography.Text style={{ fontSize: '0.8em', color: '#999' }}>Обновлено: {moment(item.updatedAt).format('DD.MM.YYYY HH:mm')}</Typography.Text>
                </div>

            </Card >
        </List.Item >)

    )
}
const IconText = ({ icon, text, style, onClick }: { icon: React.ReactNode; text: string, style?: React.CSSProperties, onClick?: () => void }) => (
    <Space
        onClick={onClick}
        style={{ ...style, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: 0, padding: 0 }}>
        {icon}
        {text}
    </Space>
);

export default RenderTextCard;
