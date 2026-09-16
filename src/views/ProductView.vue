<template>
    <div>
        <h1>商品列表</h1>
              <!-- foreach方法 -->
              <!-- :key 主鍵辨識每一筆資料 -->
            <div v-for="product in products" :key="product.productID">
                {{ product.productname  }} - {{ product.price }}
                <!-- 按下按鈕，把這個商品的 productID 傳進函式 -->
               <button @click="addTocart(product.productID)">加入購物車</button>
                </div>


</div>
</template>

<script setup>
// 頁面一載入就要去後端查商品，用 onMounted
import { useMemberStore } from '@/stores/member'
import {ref, onMounted} from 'vue'
// 空陣列
const products = ref([])
const store = useMemberStore()

//讀取商品
onMounted(async ()=> {

    const response = await  fetch('http://localhost:8082/Product/findall')
// 轉成 JavaScript 陣列
    const data = await response.json()
      //  把資料塞進 products
    products.value =data
  
})

//加入購物車
const addTocart = async(productID)=>{
    const response =await fetch('http://localhost:8082/Cart/add',{
        method:'POST',
        headers:{'Content-Type' :'application/json'},
        body:JSON.stringify({
            memberID:store.memberID,
            // 左邊的 productID 是你後端 CartDTO 裡面的屬性名稱
            // 右邊 — 從函式參數傳進來的值
            productID:productID

            
        })
    })
    if(response.ok){
        alert('已加入購物車')
    }else{
        alert('加入失敗')
    }

}
</script>

<style scoped></style>