import { message, notification } from "antd";
import axios from "axios";

export const instance = axios.create({
  // к запросу будет приуепляться cookies
  withCredentials: true,
  // устанавливаем baseURL
  baseURL: "http://localhost:3500",
});

// создаем перехватчик запросов
// который к каждому запросу добавляет accessToken из localStorage
instance.interceptors.request.use(
  (config) => {
    config.headers.Authorization = `Bearer ${localStorage.getItem("token")}`
    return config
  }
)
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    notification.error({
      message: "Ошибка сети",
      description: 'Проверьте подключение к сети и попробуйте ещё раз\n Если проблема не решилась, пожалуйста, сообщите об этом на https://github.com/rahimkulov/dyplom/issues',
    })
    return Promise.resolve({ data: { status: false, message: null } })
  }
)
