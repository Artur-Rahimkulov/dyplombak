import { message } from "antd";
import { QueryParams, TextModelForCreate, TextModelForList, TextModelForReadEdit, TextModelForUpdate } from "../models/Text";
import { instance } from "./api.config";
let TextService = {
    getTexts(queryParams: QueryParams) {
        return instance.get("/api/texts/", {
            params: queryParams
        })
            .then((response) => {
                if (response.data.status)
                    return response.data as
                        {
                            texts: TextModelForList[],
                            count: number,
                            status: boolean,
                        }

                else {
                    if (response.data.message)

                        message.error(response.data.message)
                    return null
                }
            })
    },
    getTextForEdit(id: string) {
        return instance.get("/api/texts/edit/" + id,)
            .then((response) => {
                if (response.data.status)
                    return response.data.text as TextModelForReadEdit
                else {
                    if (response.data.message)

                        message.error(response.data.message)
                    return null
                }
            })
    },
    getTextForRead(id: string) {
        return instance.get("/api/texts/read/" + id,)
            .then((response) => {
                if (response.data.status)
                    return response.data.text as TextModelForReadEdit
                else {
                    if (response.data.message)

                        message.error(response.data.message)
                    return null
                }
            })
    },
    getTextWithAccessLink(access_link: string) {
        return instance.get("/api/texts/read_with_access_link/" + access_link,)
            .then((response) => {
                if (response.data.status)
                    return response.data.text as TextModelForReadEdit
                else {
                    if (response.data.message)

                        message.error(response.data.message)
                    return null
                }
            })
    },
    createText(text: TextModelForCreate) {
        return instance.post("/api/texts", text)
            .then((response) => {
                if (response.data.status)
                    return response.data.text as TextModelForReadEdit
                else {
                    if (response.data.message)

                        message.error(response.data.message)
                    return null
                }
            })
    },
    updateText(text: TextModelForUpdate) {
        return instance.put("/api/texts/" + text._id, text)
            .then((response) => {
                if (response.data.status)
                    return response.data.text as TextModelForReadEdit
                else {
                    if (response.data.message)

                        message.error(response.data.message)
                    return null
                }
            })
    },
    deleteText(id: string) {
        return instance.delete("/api/texts/" + id)
            .then((response) => {
                if (response.data.status)
                    return response.data.text as TextModelForReadEdit
                else {
                    if (response.data.message)

                        message.error(response.data.message)
                    return null
                }
            })
    },
    copyText(id: string) {
        return instance.post("/api/texts/copy/" + id)
            .then((response) => {
                if (response.data.status)
                    return response.data.text as TextModelForReadEdit
                else {
                    if (response.data.message)

                        message.error(response.data.message)
                    return null
                }
            })
    },
    updateAccessLink(id: string) {
        return instance.put("/api/texts/access_link/" + id)
            .then((response) => {
                if (response.data.status)
                    return response.data.access_link as string
                else {
                    if (response.data.message)

                        message.error(response.data.message)
                    return null
                }
            })
    },
    updateAccessLevel(id: string, acccess_level: string) {
        return instance.put("/api/texts/access_level/" + id, { accessLevel: acccess_level })
            .then((response) => {
                if (response.data.status)
                    return response.data.text as TextModelForReadEdit
                else {
                    if (response.data.message)

                        message.error(response.data.message)
                    return null
                }
            })
    },
    deleteAccessLink(id: string) {
        return instance.delete("/api/texts/access_link/" + id)
            .then((response) => {
                if (response.data.status)
                    return response.data.access_link as string
                else {
                    if (response.data.message)

                        message.error(response.data.message)
                    return null
                }
            })
    }
}

export default TextService