<script setup>




</script>

<template>
  <!-- 導航區域 -->
  <nav>
<!-- <router-link> 就是超連結，點了會跳到對應的頁面 -->

  <router-link to="/products">商品列表</router-link>
  |
  <router-link to="/cart">購物車</router-link>
  </nav>
  <router-view/>
</template>

<style scoped></style>
