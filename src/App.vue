

<template>
  <!-- 導航區域 -->
  <nav>
<!-- <router-link> 就是超連結，點了會跳到對應的頁面 -->

  <router-link to="/products">商品列表</router-link>
  |
  <router-link to="/cart">購物車</router-link>
  |
  <span v-if="store.memberID">歡迎，{{store.membername}}</span>
  <button v-if="store.memberID" @click="handleLogout">登出</button>
  </nav>
  <router-view/>
</template>

<script setup>

import { useRouter } from 'vue-router';
// useRouter 是 vue-router 套件提供的工具
import { useMemberStore } from './stores/member';
import api from './api/axios';

const store= useMemberStore()
const router = useRouter()

const handleLogout =async () => {
  try{await api.post('/api/auth/logout')

  }catch(error){

  }finally{
     store.logout()
  router.push('/login')
  }
}
 



</script>

<style scoped></style>

/*

為什麼不會有問題

① cookie 被清掉了（大部分情況）

就算後端作廢失敗，只要 Set-Cookie: Max-Age=0 有回來，瀏覽器就會刪掉 cookie。沒有 cookie，就算資料庫的 token 還有效，也沒人能用它。

② 如果連 cookie 都沒清掉（後端完全沒回應）

最壞的情況：cookie 還在、資料庫 token 還有效。但：

保護機制	效果
access token 15 分鐘過期	最多 15 分鐘內有效
refresh token 7 天過期	7 天後自動失效
排程清除	凌晨 3 點刪掉過期的

不會永遠有效，時間到了就自動消失。

③ 使用者可以再按一次登出

後端恢復後再登出一次就好。
*/