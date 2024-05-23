
import { message } from "antd";
import { Favorite, FavoritesGroup } from "../models/Favorites";
import { instance } from "./api.config";
let FavoritesService = {
    getGroups() {
        return instance.get("/api/favorites/groups")
            .then((response) => {
                if (response.data.status)
                    return response.data.favorites_groups as FavoritesGroup[]
                else {
                    if (response.data.message)

                    message.error(response.data.message)
                    return null
                }
            })
    },
    addGroup(name: string) {
        return instance.post("/api/favorites/groups", { name })
            .then((response) => {
                if (response.data.status)
                    return response.data.favorites_group as FavoritesGroup
                else {
                    if (response.data.message)

                    message.error(response.data.message)
                    return null
                }
            })
    },
    deleteGroup(id: string) {
        return instance.delete("/api/favorites/groups/" + id)
            .then((response) => {
                if (response.data.status)
                    return response.data.status as boolean
                else {
                    if (response.data.message)

                    message.error(response.data.message)
                    return null
                }
            })
    },
    updateGroup(id: string, name: string) {
        return instance.put("/api/favorites/groups/" + id, { name })
            .then((response) => {
                if (response.data.status)
                    return response.data.status as FavoritesGroup
                else {
                    if (response.data.message)

                        message.error(response.data.message)
                    return null
                }
            })
    },
    addToFavoritesGroup(groupId: string, textId: string) {
        return instance.post(`api/favorites/${textId}/${groupId}`)
            .then((response) => {
                if (response.data.status)
                    return response.data.favorites as Favorite
                else {
                    if (response.data.message)
                        message.error(response.data.message)
                    return null
                }
            })
    },
    removeFromFavoritesGroup(groupId: string, textId: string) {
        return instance.delete(`api/favorites/${textId}/${groupId}`)
            .then((response) => {
                if (response.data.status)
                    return response.data.status as boolean
                else {
                    if (response.data.message)

                        message.error(response.data.message)
                    return null
                }
            })
    }
}
export default FavoritesService