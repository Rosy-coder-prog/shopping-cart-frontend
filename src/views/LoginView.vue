<template>
    <div>
        <!-- 預設false -->
        <h1>{{isRegister ? '註冊' : '登入'}}</h1>
        
    <input v-model="mailbox" placeholder="請輸入信箱" >
    <input v-model="password" type="password" placeholder="請輸入密碼">
    <!-- 只有註冊模式才顯示 -->
    <input v-if="isRegister" v-model="membername" placeholder="輸入暱稱">
    <button @click="handleSubmit">{{isRegister ? '註冊' : '登入'}}</button>
    <!-- 三元運算 -->
    <button @click="isRegister = !isRegister">{{isRegister ? '已有帳號?登入' :'沒有帳號? 註冊'}}</button>
    <!-- @click → 按下去執行什麼
isRegister = !isRegister → 把 true 變 false，false 變 true -->
</div>

    
</template>

<script setup>
import { ref } from 'vue';
import { useMemberStore } from '@/stores/member';
import { useRouter } from 'vue-router';
const router = useRouter()


// ref 讓變數和畫面雙向綁定，使用者打什麼，變數就是什麼
const isRegister=ref(false)
const mailbox=ref('')
const password=ref('')
const membername=ref('')
const store =useMemberStore()

const handleSubmit =async () =>{
    // true執行，但預設是false登入
    if(isRegister.value){

    }else{
        /*
      箭頭函式，() → 參數（沒有參數就空括號）
      => → 箭頭（代表「這是一個函式」）
      {} → 函式內容
       */
        const response =await fetch('http://localhost:8082/Member/login',{
    method:'POST',
    headers:{'Content-type':'application/json'},
    // 資料格式是 JSON，Content-Type內容類型，application/json ->JSON格式
    body: JSON.stringify({
        // JavaScript 物件轉成 JSON 字串(動作)

        mailbox:mailbox.value,
        //從盒子拿值:送給後端
    //    mailbox第一個 對應後端 MemberDTO  mailbox
        // 用了 ref，要拿裡面的值要加 .value
        password:password.value

       
    })

})
 if(response.ok){
    // response.ok → 後端回傳 200 就是 true，回傳 500 就是 false
    const data= await response.json()
    // 回傳的 JSON 字串轉成 JavaScript 物件
    // data = { memberID: 1, membername: "小明" }

    store.setMember(data) //存進倉庫，方便使用
    
    alert('歡迎，'+ data.membername)
    router.push('/products') //跳到商品頁面

            // 彈出視窗顯示結果，之後再改成跳頁
        }else{
            alert('登入失敗')
        }
    }
}



</script>

<style scoped>
</style>
