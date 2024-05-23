export interface Favorite {
    _id: string,
    user: string,
    text: string,
    group: string,
    createdAt: Date,
    updatedAt: Date
}

export interface FavoritesGroup {
    _id: string,
    user: string,
    name: string,
    createdAt: Date,
    updatedAt: Date
}