import { instance } from "./api.config";
import { message } from "antd";
let RatingService = {

    rateText(id: string, rating: 'like' | 'dislike') {
        return instance.post("/api/rating/" + id + '/' + rating)
            .then((response) => {
                if (response.data.status)
                    return response.data as {
                        status: boolean,
                        likes: number,
                        dislikes: number,
                        rating: number | null,
                    }
                else {
                    if (response.data.message)

                    message.error(response.data.message)
                    return null
                }
            })
    },
}
export default RatingService