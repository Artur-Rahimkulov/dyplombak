import { UserSettings } from "../models/Settings";
import { User } from "../models/User";
import { instance } from "./api.config";
import { message } from "antd";
let UserService = {
    getUser() {
        return instance.get("/api/user")
            .then(res => {
                if (res.data.status)
                    return res.data.user as User;
                else {
                    if (res.data.message)

                        message.error(res.data.message);
                    return null
                }
            })
    },
    updateUser(userSettings: UserSettings) {
        return instance.put("/api/user", { userSettings })
            .then(res => {
                if (res.data.status)
                    return res.data.user as User;
                else {
                    if (res.data.message)

                        message.error(res.data.message);
                    return null
                }
            })
    }

}
export default UserService