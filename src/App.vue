

<template>
  <!-- 導航區域 -->
  <nav>
<!-- <router-link> 就是超連結，點了會跳到對應的頁面 -->

  <router-link to="/products">商品列表</router-link>
  |
  <router-link to="/cart">購物車</router-link>
  |
  <button @click="handleLogout">登出</button>
  </nav>
  <router-view/>
</template>

<script setup>

import { useRouter } from 'vue-router';
// useRouter 是 vue-router 套件提供的工具
import { useMemberStore } from './stores/member';

const store= useMemberStore()
const router = useRouter()

const handleLogout = () =>{
  store.logout()
   router.push('/login')
}


</script>

<style scoped></style>
