import { Favorite } from "./Favorites";
import { User } from "./User"

export interface TextModelForList {
    _id: string,
    title: string,
    author: User,
    description: string,
    views: number,
    likes: number,
    dislikes: number,
    accessLevel: 'public' | 'private' | 'access_link',
    access_link: string,
    user: {
        liked: number | null,
        favorites: Favorite[] | null,
        lastReaded: Date | null,
        access_linked: boolean
    },
    createdAt: Date,
    updatedAt: Date,
}
export interface TextModelForReadEdit extends TextModelForList {
    text: string,
}

export interface TextModelForCreate {
    title: string,
    description: string,
    text: string
}
export interface TextModelForUpdate {
    _id: string,
    title: string,
    description: string,
    text: string
}
export interface QueryParams {
    page: number,
    pageSize: number,
    search: string | null,
    sort: 'title' | 'views' | 'likes' | 'dislikes' | 'createdAt' | 'updatedAt',
    sortOrder: 1 | -1,
    activeKey: 'author' | 'public' | 'favorites' | 'access_linked' | 'recent',
    favoriteGroupId: string | 'all',
}
