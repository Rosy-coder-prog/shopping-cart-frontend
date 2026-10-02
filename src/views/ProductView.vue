<template>
    <div>
        <h1>商品列表</h1>
              <!-- foreach方法 -->
              <!-- :key 的值在這個清單裡不能重複，讓 Vue 能分辨誰是誰-->
            <div v-for="product in products" :key="product.productID">
                {{ product.productname  }} - {{ product.price }}
                <!-- 按下按鈕，把這個商品的 productID 傳進函式 -->
               <button @click="addTocart(product.productID)">加入購物車</button>
                </div>


</div>
</template>

<script setup>
// 頁面一載入就要去後端查商品，用 onMounted
import api from '@/api/axios'
import {ref, onMounted} from 'vue'
// 空陣列
const products = ref([])


//讀取商品
//頁面載入完成後，自動執行
onMounted(async ()=> {
          //api.get(網址, 設定物件)
          //先等結果，再處理
    const res = await api.get('/api/product/findall')
    // 賦值語句
        products.value =res.data
    })
  
  


//加入購物車
const addTocart = async(productID)=>{
   
  try{
    await api.post('/api/cart/add',{
        
        productID:productID
     //  ↑ 屬性名稱    ↑ 值（變數）
       } ) 
        alert('加入成功')
    }catch(error){
        alert(error.response?.data?.message ||'加入失敗')
    }

            
        }
 
</script>

<style scoped></style>

//讀取商品
  const response = await  fetch('http://localhost:8082/api/product/findall')
 轉成 JavaScript 陣列
    const data = await response.json()
       把資料塞進 products
    products.value =data



/*
加入購物車
 const response =await fetch('http://localhost:8082/api/cart/add',{
        method:'POST',
        headers:{'Content-Type' :'application/json'},
        body:JSON.stringify({
            memberID:store.memberID,
            // 左邊的 productID 是你後端 CartDTO 裡面的屬性名稱
            // 右邊 — 從函式參數傳進來的值
            productID:productID


             if(response.ok){
        alert('已加入購物車')
    }else{
        alert('加入失敗')
    }
            */

   