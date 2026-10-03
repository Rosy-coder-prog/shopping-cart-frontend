// 同一套程式碼可以同時在瀏覽器端與伺服器端運行
import axios from "axios";
import { useMemberStore } from "@/stores/member";

const api =axios.create({
    // baseURL所有請求只寫路徑，例如 api.get('/api/cart')，不用每次寫完整網址
    baseURL:'http://localhost:8082', //共用網址

    // 請求時帶 cookie，refresh token 需要它
    withCredentials:true  //共用cookie
})
// 每個請求發出前，自動加 Authorization header
// api.interceptors.request.use(...) 攔截器：每個透過 api 發出的請求，在送出之前都會先經過這個函式。

// interceptor 攔截的是前端自己發出的請求
api.interceptors.request.use((config) => {  //config 就是整包請求的設定
    const store =useMemberStore() //拿 accessToken
    if(store.accessToken){
        // config 是這個請求的設定物件，包含 URL、headers、body 等。你可以在送出前修改它
        config.headers.Authorization= `Bearer ${store.accessToken}` //拿出來存進去
    }
    // 沒有accessToken跳過if回傳
    return config
})

//let值會變
let isRefreshing = false //有沒有人正在呼叫 refresh API
let waitingQueue = [] //refresh 完成後要重送的請求

api.interceptors.response.use( //共用的回應攔截器（401 自動 refresh）

    //代表成功，(response) => { return response }
    (response) => response,
    //  ↑ 參數        ↑ 回傳值

    //失敗的處理結果，axios 把非 2xx 的回應包成一個 error 物件傳進來
    async(error) => {
        //失敗的請求設定存起來，之後 refresh 成功要重送它
        const originalRequest = error.config
        // ?. 是可選鏈
        // status !== 401 ，不是「未登入」，可能是 403（沒權限）、500（伺服器錯誤），refresh 解決不了
//url === '/api/auth/refresh'  ， refresh API 本身失敗了，再 refresh 就是無限循環 ，超過 7 天沒用.已登出.cookie 被清掉了
// url 呼叫 api
        if(error.response?.status !== 401 
            || originalRequest.url === '/api/auth/refresh'
            || originalRequest.url === '/api/member/login'
            || originalRequest.url === '/api/member/register'){
            // Promise 代表一個還不知道結果的操作，reject拒絕
            return Promise.reject(error) //不是 401，或 refresh 自己失敗 → 我沒辦法處理 → 丟回去 ( throw e)
        }
        if(isRefreshing){
            // new Promise((resolve) => { ... })建立一個還沒完成的承諾
            
            return new Promise((resolve) => {
                // 把「之後要做的事」存進陣列，現在不執行
                // 這個函式現在不會被呼叫，它只是被存起來
                // push 是陣列的方法，把東西加到陣列
                waitingQueue.push((newToken) =>{
                    originalRequest.headers.Authorization = `Bearer ${newToken}`
                    //  把回應交給等待中的頁面， 用新 token 重送請求，拿到回應 /	「重送請求，把結果交給等待中的頁面」
                    resolve(api(originalRequest))
                })
            })
        }
           
        isRefreshing = true

        try{
            // refreshAPI只有一個入，所有人都用這個路徑
            // 每個人帶的 cookie 不同，後端靠 cookie 裡的 refresh token 分辨是誰
        //   null 是 body（請求內容，refresh 不需要在 body 帶任何資料，因為身分憑證在 cookie 裡
        // 原始 axios 就不經過 interceptor，原始的 axios 預設 withCredentials: false，不會帶 cookie。所以要手動加
        // 呼叫後端的動作存進res
        const res =await axios.post('http://localhost:8082/api/auth/refresh',null,{
            // 這個請求要帶 cookie
            withCredentials: true
        })

        const newToken = res.data.accessToken
        const store =useMemberStore()
       //讓前端知道身分，重新整理不會消失
        store.setMember(res.data)
    // callback排隊時存進去的那個函式，callback 是變數名稱，你可以取任何名字，waitingQueue.forEach((fn) => fn(newToken))  

        waitingQueue.forEach((callback) => callback(newToken))
                            //    ↑ 參數         ↑ 呼叫這個參數（它是函式），傳入 newToken
         //清空                   
        waitingQueue = []
    // 重送原本失敗的請求
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return api(originalRequest)
         }catch(refreshError){
  // refresh 也失敗（過期、被作廢）→ 導向登入頁
             const store = useMemberStore()
            //  refresh 失敗代表這個人已經不是登入狀態了
             store.accessToken = null
             store.memberID = null
             store.membername = null
             store.role = null
            //  window.location.href 瀏覽器物件
             window.location.href = '/login'
             return Promise.reject(refreshError)

             
         }finally{
            // 不管成功或失敗，都要把旗標重設
            isRefreshing = false
         }
        
    }
    
)
// 把 api 這個物件匯出，讓其他檔案能用
export default api

// 請求 A、B、C 同時收到 401

// A（第一個）：isRefreshing=false → 設成 true → 呼叫 /api/auth/refresh
// B（第二個）：isRefreshing=true  → 進入 waitingQueue 排隊
// C（第三個）：isRefreshing=true  → 進入 waitingQueue 排隊

// refresh 成功 → newToken
//   → 通知 B、C：用新 token 重送
//   → A 自己也用新 token 重送
//   → isRefreshing = false

// 15:00.001  請求 A 進入 interceptor
//            isRefreshing = false → 跳過 if
//            isRefreshing = true  ← 改成 true
//            進入 try → 去 refresh...（還沒回來）

// 15:00.002  請求 B 進入 interceptor（同一段程式碼，但是另一次執行）
//            isRefreshing = true  → 進入 if → 排隊

// 15:00.003  請求 C 進入 interceptor（又一次執行）
//            isRefreshing = true  → 進入 if → 排隊
// originalRequest，每次執行 interceptor，JavaScript 會建立獨立的執行環境
// 閉包（closure）


// 	            上面的 reject	            下面的 catch
// 時機	            去之前判斷	             去之後看結果
// 問的問題	「這個問題 refresh 能解決嗎？」	「refresh 成功了嗎？」
// 失敗原因	不是 401、或 refresh 自己失敗	refresh token 過期、被作廢、停權