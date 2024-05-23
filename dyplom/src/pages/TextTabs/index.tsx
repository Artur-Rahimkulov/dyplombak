import { useNavigate } from 'react-router-dom';
import { Button, Divider, Form, Input, List, Modal, Select, Space, Tabs, TabsProps, message, } from 'antd';
import 'react-reflex/styles.css';
import { useEffect, useState } from 'react';
import { ClockCircleOutlined, DeleteOutlined, DownSquareOutlined, EditOutlined, FileSearchOutlined, FolderOutlined, PaperClipOutlined, PlusOutlined, StarOutlined, UpSquareOutlined, UserOutlined } from '@ant-design/icons';
import { QueryParams, TextModelForList } from '../../models/Text';
import TextService from '../../api/text.api';
import { FavoritesGroup } from '../../models/Favorites';
import FavoritesService from '../../api/favorites.api';
import RatingService from '../../api/rating.api';
import confirm from 'antd/es/modal/confirm';
import CreateEditText, { FieldType } from '../../components/CreateAndEditText';
import RenderTextCard from '../../components/RenderTextCard';
import { User } from '../../models/User';
import UserService from '../../api/user.api';
import Share from '../../components/Share';
/**
 * Renders the main component of the application.
 * 
 * @returns {JSX.Element} The rendered component.
 */


interface Props {
    selectMode?: boolean,
    onSelect?: (id: string) => void,
}
function TextTabs({ selectMode, onSelect }: Props) {
    const [texts, setTexts] = useState<TextModelForList[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [favoritesGroups, setFavoritesGroups] = useState<FavoritesGroup[]>([]);
    const [showAdd, setShowAdd] = useState(false);
    const [share, setShare] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [createFavoriteName, setCreateFavoriteName] = useState('');
    const [editTextId, setEditTextId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [updateFavoriteGroup, setUpdateFavoriteGroup] = useState<{ name: string, _id: string } | null>(null);
    const [queryParams, setQueryParams] = useState<QueryParams>({
        page: 1,
        pageSize: 10,
        search: '',
        sort: 'title',
        sortOrder: 1,
        activeKey: 'author',
        favoriteGroupId: 'all'
    });
    const navigate = useNavigate()
    let textController = {
        getTexts: () => {
            setLoading(true);
            TextService.getTexts(queryParams)
                .then(res => {
                    if (res) {
                        console.log(res);
                        setTexts(res.texts);
                        setTotal(res.count);
                    }
                })
                .finally(() => setLoading(false));

        },
        handleRate: (item: TextModelForList, type: string) => {
            RatingService.rateText(item._id, type as 'like' | 'dislike')
                .then(res => {
                    if (res !== null) {
                        let buffer = [...texts].map(text => {
                            if (text._id == item._id) {
                                text.likes = res.likes ?? 0
                                text.dislikes = res.dislikes ?? 0
                                text.user.liked = res.rating ?? null
                            }
                            return text;
                        });
                        setTexts(buffer);
                    }
                })
        },
        handleEdit: (item: TextModelForList) => {
            setEditTextId(item._id);
            setShowAdd(true);
        },
        handleCopy: (item: TextModelForList) => {
            TextService.copyText(item._id).then(
                res => {
                    if (res != null) {
                        message.success('Текст успешно скопирован');
                    }
                }
            )
        },
        handleShare: (item: TextModelForList) => {
            setShare(item._id)
        },
        saveAccessLink: (access_link: string) => {
            TextService.getTextWithAccessLink(access_link)
                .then(res => {
                    if (res != null) {
                        message.success({
                            content: 'Текст успешно сохранен',
                            key: 'success',
                        });
                        navigate('/list/tab/access_linked/')
                    } else {
                        navigate('/not_found')
                    }
                }
                )
        },
        handleDelete: (item: TextModelForList) => {
            confirm({
                title: 'Вы уверены?',
                content: 'Вы уверены, что хотите удалить текст: ' + item.title + '?',
                okText: 'Да',
                cancelText: 'Нет',
                onOk: () => {
                    TextService.deleteText(item._id)
                        .then(res => {
                            if (res !== null) {
                                let buffer = [...texts].filter(text => text._id != item._id);
                                setTexts(buffer);
                                message.success('Текст удален');
                            }
                        })
                },
                onCancel: () => {
                    return
                },
                closable: true,
            })
        },
        handleCreateEdit: (values: FieldType) => {
            if (editTextId) {
                let newText = { ...values, _id: editTextId };
                return TextService.updateText(newText)
                    .then(res => {
                        if (res) {
                            let buffer = [...texts].map(text => {
                                if (text._id == editTextId) {
                                    text.title = newText.title;
                                    text.description = newText.description;
                                    text.updatedAt = res.updatedAt
                                }
                                return text;
                            });
                            setTexts(buffer);
                            message.success('Текст успешно обновлен');
                            setShowAdd(false);
                            setEditTextId(null);

                        }
                    })
            } else {
                return TextService.createText(values)
                    .then(res => {
                        if (res) {
                            message.success('Текст успешно создан');
                            setShowAdd(false);
                        }
                    })
            }
        },
        handleAccessLevel: (item: TextModelForList, level: 'private' | 'public' | 'access_link') => {
            TextService.updateAccessLevel(item._id, level)
                .then(res => {
                    if (res != null) {
                        let buffer = [...texts].map(text => {
                            if (text._id == item._id) {
                                text.accessLevel = level;
                            }
                            return text;
                        });
                        message.success('Настройки приватности обновлены');
                        setTexts(buffer);
                    }
                })
        }
    }
    let setActivekey = (key: string) => {
        if (!selectMode)
            navigate('/list/tab/' + key);
        setQueryParams({
            ...queryParams,
            activeKey: key as 'author' | 'public' | 'favorites' | 'access_linked' | 'recent',
            page: 1,
            search: '',
            favoriteGroupId: 'all',
            sort: key !== 'public' ? 'title' : 'likes',
            sortOrder: key !== 'public' ? 1 : -1
        });
    }

    let favoritesController = {
        getFavorites: () => {
            FavoritesService.getGroups()
                .then(res => {
                    if (res) {
                        console.log('fav_groups', res);
                        setFavoritesGroups(res);
                    }
                })
        },
        createFavoritesGroup: (name: string) => {
            if (name == '') return message.error('Необходимо ввести название группы');
            FavoritesService.addGroup(name)
                .then(res => {
                    if (res != null) {
                        message.success('Группа успешно создана');
                        setCreateFavoriteName('')
                        favoritesController.getFavorites();
                    }
                })
        },
        deleteFavoritesGroup: (id: string) => {
            FavoritesService.deleteGroup(id)
                .then(res => {
                    if (res != null) {
                        message.success('Группа успешно удалена');
                        favoritesController.getFavorites();
                    }
                })
        },
        updateFavoritesGroup: (id: string, name: string) => {
            FavoritesService.updateGroup(id, name)
                .then(res => {
                    if (res != null) {
                        message.success('Группа успешно обновлена');
                        favoritesController.getFavorites();
                        setUpdateFavoriteGroup(null);
                    }
                })
        },
        addToGroup: (group: string, item: TextModelForList) => {
            return FavoritesService.addToFavoritesGroup(group, item._id)
                .then(res => {
                    if (res != null) {
                        message.success('Текст успешно добавлен в группу');
                        let buffer = [...texts].map(text => {
                            if (text._id == item._id) {
                                if (text.user.favorites == null) {
                                    text.user.favorites = []
                                }
                                text.user.favorites.push(res)
                            }
                            return text;
                        });
                        setTexts(buffer);
                    }
                    return res
                })
        },
        deleteFromGroup: (group: string, item: TextModelForList) => {
            return FavoritesService.removeFromFavoritesGroup(group, item._id)
                .then(res => {
                    if (res != null) {
                        message.success('Текст успешно удален из группы');
                        let buffer = [...texts].map(text => {
                            if (text._id == item._id) {
                                if (text.user.favorites == null) {
                                    text.user.favorites = []
                                }
                                text.user.favorites = text.user.favorites.filter(fav => fav.group != group)
                            }
                            return text;
                        });
                        setTexts(buffer);
                    }
                    return res
                })
        },
    }
    let getChild = () => <List
        grid={{ gutter: 0, lg: 2, md: 1, sm: 1, xs: 1, xl: 3, xxl: 4 }}
        dataSource={texts}
        loading={loading}
        pagination={{
            pageSize: queryParams.pageSize,
            pageSizeOptions: [10, 20, 30],
            showSizeChanger: true,
            onChange: (newPage, newPageSize) => {
                if (queryParams.pageSize !== newPageSize)
                    setQueryParams({ ...queryParams, pageSize: newPageSize });
                if (queryParams.page !== newPage)
                    setQueryParams({ ...queryParams, page: newPage });
            },
            current: queryParams.page,
            total: total
        }}
        split={true}
        bordered={true}
        renderItem={(item: TextModelForList) =>
            <RenderTextCard
                item={item}
                user={user}
                selectMode={selectMode}
                onSelect={onSelect}
                handleRate={textController.handleRate}
                handleEdit={textController.handleEdit}
                handleCopy={textController.handleCopy}
                handleShare={textController.handleShare}
                navigate={navigate}
                handleDelete={textController.handleDelete}
                favoritesGroups={favoritesGroups}
                handleAccessLevel={textController.handleAccessLevel}
                addToGroup={favoritesController.addToGroup}
                deleteFromGroup={favoritesController.deleteFromGroup} />}
    />
    let getItems = () => {
        let items = {
            favorites: {
                label: 'Избранное',
                icon: <StarOutlined />,
            },
            author: {
                label: 'Мои',
                icon: <UserOutlined />,
            },
            public: {
                label: 'Открытые',
                icon: <FileSearchOutlined />,
            },
            access_linked: {
                label: 'Доступ по ссылке',
                icon: <PaperClipOutlined />,
            },
            recent: {
                label: 'Недавние',
                icon: <ClockCircleOutlined />,
            },
        } as { [key: string]: { label: string, icon: JSX.Element } };

        return ['author', 'public', 'favorites', 'access_linked', 'recent'].map(key => (
            {
                label: items[key] ? items[key].label : '',
                key,
                animated: true,
                icon: items[key] ? items[key].icon : <FolderOutlined />,
                style: { display: 'flex', flexDirection: 'column', height: '100%', flex: 1 },
                children: getChild(),
            }
        )) as TabsProps['items'];

    }
    useEffect(() => {
        if (!selectMode) {
            if (window.location.href.includes('/access_link/')) {
                let access_link = window.location.href.split('/access_link/')[1].split('/')[0]
                textController.saveAccessLink(access_link)
            }
            if (window.location.href.includes('/tab/')) {
                let tab = window.location.href.split('/tab/')[1].split('/')[0]
                setQueryParams({ ...queryParams, activeKey: tab as 'author' | 'public' | 'favorites' | 'access_linked' | 'recent', page: 1, search: '', favoriteGroupId: 'all' })
            }
        }
        favoritesController.getFavorites();
        UserService.getUser().then(res => {
            if (res) {
                setUser(res);
            }
        })
    }, []);
    useEffect(() => {
        textController.getTexts();
    }, [queryParams]);


    return (
        <>
            <Tabs
                activeKey={queryParams.activeKey}
                onChange={setActivekey}
                destroyInactiveTabPane={true}
                // centered={true}
                tabBarExtraContent={{
                    left: !selectMode && <>
                        <Button type="primary" style={{ marginRight: '1em' }} onClick={() => setShowAdd(true)}>Добавить текст</Button>
                    </>,
                    right: <>
                        <Input.Group>
                            <Space.Compact>
                                <Select
                                    style={{ width: '150px' }}
                                    placeholder='сортировать по'
                                    value={queryParams.sort}
                                    popupMatchSelectWidth={false}
                                    title='Сортировать по'
                                    options={[
                                        { label: 'По заголовку', value: 'title' },
                                        { label: 'По просмотрам', value: 'views' },
                                        { label: 'По лайкам', value: 'likes' },
                                        { label: 'По дизлайкам', value: 'dislikes' },
                                        { label: 'По дате создания', value: 'createdAt' },
                                        { label: 'По дате обновления', value: 'updatedAt' }
                                    ]}
                                    onChange={(e) => setQueryParams({ ...queryParams, sort: e })} />
                                <Button
                                    icon={queryParams.sortOrder === -1 ? <DownSquareOutlined /> : <UpSquareOutlined />}
                                    onClick={() => setQueryParams({ ...queryParams, sortOrder: queryParams.sortOrder === -1 ? 1 : -1 })}
                                    title={`сортировать по ${queryParams.sortOrder == -1 ? 'убыв' : 'возр'}`}></Button>
                            </Space.Compact>
                            <Space.Compact>
                                <Input onChange={(e) => { setQueryParams({ ...queryParams, search: e.target.value }) }} placeholder="Поиск по названию" />
                                {queryParams.activeKey == 'favorites' &&
                                    <Select
                                        title='Фильтр по группам избранных'
                                        value={queryParams.favoriteGroupId}
                                        onClear={() => setQueryParams({ ...queryParams, favoriteGroupId: 'all' })}
                                        popupMatchSelectWidth={false}
                                        dropdownRender={(menu,) => (
                                            <>
                                                {menu}
                                                <Divider style={{ margin: '8px 0' }} />
                                                <Space style={{ padding: '0 8px 4px' }}>
                                                    <Input
                                                        placeholder="Please enter item"
                                                        value={createFavoriteName}
                                                        onChange={(e) => setCreateFavoriteName(e.target.value)}
                                                        onKeyDown={(e) => e.stopPropagation()}
                                                    />
                                                    <Button type="text" icon={<PlusOutlined />}
                                                        onClick={() => favoritesController.createFavoritesGroup(createFavoriteName)}>
                                                        Добавить группу
                                                    </Button>
                                                </Space>
                                            </>
                                        )}
                                        optionRender={(item, info) => {
                                            return <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                                <div>{item.label}</div>
                                                <Space>
                                                    <Button type="text" icon={<EditOutlined />}
                                                        onClick={() => setUpdateFavoriteGroup({ name: item.label as string, _id: item.value as string })}>

                                                    </Button>
                                                    <Button danger type="text" icon={<DeleteOutlined />}
                                                        onClick={() => favoritesController.deleteFavoritesGroup(item.value as string)}>
                                                    </Button>
                                                </Space>
                                            </div>
                                        }}
                                        options={[...favoritesGroups, { _id: 'all', name: 'все' }].map(group => ({ label: group.name, value: group._id }))}
                                        onChange={(e) => setQueryParams({ ...queryParams, favoriteGroupId: e as string | 'all' })} />
                                }
                            </Space.Compact>

                        </Input.Group>
                    </>
                }}
                items={getItems()}
                style={{ height: '100%', overflowX: 'hidden', width: '100%', display: 'flex', flexDirection: 'column', maxHeight: '100%', overflowY: 'auto' }}
            />
            <Modal
                title={(editTextId) ? 'Редактировать текст' : "Добавить текст"}
                open={showAdd}
                destroyOnClose={true}
                onOk={() => {
                    setShowAdd(false);
                    setEditTextId(null);
                }}
                width={'70%'}
                onCancel={() => {
                    confirm({
                        title: 'Вы уверены?',
                        content: 'Вы уверены, что хотите отменить?',
                        okText: 'Да',
                        cancelText: 'Нет',
                        onOk: () => {
                            setShowAdd(false);
                            setEditTextId(null);
                        },
                        onCancel: () => {
                            return
                        },
                        closable: true,
                    })
                }}
                footer={null}>
                <CreateEditText text_id={editTextId} handleCreateEditText={textController.handleCreateEdit} />
            </Modal >
            <Modal
                title={'Редактировать группу'}
                open={updateFavoriteGroup != null}
                destroyOnClose={true}
                onOk={() => {
                    setUpdateFavoriteGroup(null);
                }}
                width={'30%'}
                onCancel={() => {
                    confirm({
                        title: 'Вы уверены?',
                        content: 'Вы уверены, что хотите отменить?',
                        okText: 'Да',
                        cancelText: 'Нет',
                        onOk: () => {
                            setUpdateFavoriteGroup(null);
                        },
                        onCancel: () => {
                            return
                        },
                        closable: true,
                    })
                }}
                footer={null}>
                <Form
                    name='add-text'
                    onFinish={(values: { name: string }) => {
                        console.log('editGroup', values)
                        favoritesController.updateFavoritesGroup(updateFavoriteGroup?._id as string, values.name)
                    }}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Название"
                        name="name"
                        initialValue={updateFavoriteGroup?.name as string}
                        rules={[{ required: true, message: 'Название не может быть пустым' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item >
                        <div
                            style={{ marginTop: '1em', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', gap: '1em' }}>
                            <Button type="primary" htmlType="submit">Сохранить</Button>
                        </div>
                    </Form.Item>
                </Form>
            </Modal >
            <Modal
                title={'Поделиться текстом'}
                open={share != null}
                destroyOnClose={true}
                onOk={() => {
                    setShare(null);
                }}
                width={'30%'}
                onCancel={() => {
                    setShare(null);
                }}
                footer={null}>
                <Share text_id={share} />
            </Modal >
        </>
    )
}


export default TextTabs;
