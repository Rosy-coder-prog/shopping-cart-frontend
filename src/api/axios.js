// 同一套程式碼可以同時在瀏覽器端與伺服器端運行
import axios from "axios";
import { useMemberStore } from "@/stores/member";

const api =axios.create({
    // baseURL所有請求只寫路徑，例如 api.get('/api/cart')，不用每次寫完整網址
    baseURL:'http://localhost:8082',
    // 請求時帶 cookie，refresh token 需要它
    withCredentials:true
})
// 每個請求發出前，自動加 Authorization header
// api.interceptors.request.use(...) 攔截器：每個透過 api 發出的請求，在送出之前都會先經過這個函式。

api.interceptors.request.use((config) => {
    const store =useMemberStore()
    if(store.accessToken){
        // config 是這個請求的設定物件，包含 URL、headers、body 等。你可以在送出前修改它
        config.headers.Authorization= `Bearer ${store.accessToken}`
    }
    return config
})

let isRefreshing = false
let waitingQueue = []

api.interceptors.response.use(

    (response) => response,

    async(error) => {
        const originalRequest = error.config

        if(error.response?.status !== 401 || originalRequest.url === '/api/auth/refresh'){
            return Promise.reject(error)
        }
        if(isRefreshing){
            return new Promise((resolve) => {
                waitingQueue.push((newToken) =>{
                    originalRequest.headers.Authorization = `Bearer ${newToken}`
                    resolve(api(originalRequest))
                })
            })
        }
        isRefreshing = true

        try{
        const res =await axios.post('http://localhost:8082/api/auth/refresh',null,{
            withCredentials: true
        })

        const newToken = res.data.accessToken
        const store =useMemberStore()
        store.accessToken = newToken

        waitingQueue.forEach((callback) => callback(newToken))
        waitingQueue = []

        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return api(originalRequest)
         }catch(refreshError){

             const store = useMemberStore()
             store.accessToken = null
             store.memberID = null
             store.membername = null
             store.role = null
             window.location.href = '/login'
             return Promise.reject(refreshError)

         }finally{
            isRefreshing = false
         }
        
    }
    
)
export default api

// 請求 A、B、C 同時收到 401

// A（第一個）：isRefreshing=false → 設成 true → 呼叫 /api/auth/refresh
// B（第二個）：isRefreshing=true  → 進入 waitingQueue 排隊
// C（第三個）：isRefreshing=true  → 進入 waitingQueue 排隊

// refresh 成功 → newToken
//   → 通知 B、C：用新 token 重送
//   → A 自己也用新 token 重送
//   → isRefreshing = false