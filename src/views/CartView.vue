<template>

<div>
    <h1>購物車</h1>
    <div v-if="cartItems.length === 0">購物車是空的</div>
    <div v-for="item in cartItems" :key="item.productID">
   <!-- $錢的符號    -分隔符號-->
        {{ item.productname }} - ${{ item.price }} 
        <button @click="changecartQuantity(item.productID,item.cartQuantity -1)">-</button>
        {{ item.cartQuantity }}
         <button @click="changecartQuantity(item.productID,item.cartQuantity +1)">+</button>
          <button @click="removeItem(item.productID)">刪除</button>
    </div>

    <div>
<button v-if="cartItems.length > 0" @click="checkout">結帳</button>
    </div>
    
</div>

</template>

<script setup>
import {ref,onMounted} from 'vue'
import { useMemberStore } from '@/stores/member'

const store = useMemberStore()
const cartItems = ref([])

// 增加商品
const changecartQuantity = async(productID,newQuantity) =>{
    if(newQuantity<=0){
        removeItem(productID)
    }else{
        const response = await fetch('http://localhost:8082/Cart/update',{
            method: 'PUT',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({

                memberID:store.memberID,
                productID:productID,
                cartQuantity:newQuantity
            })
        })

        if(response.ok){
            const data = await response.json()
            cartItems.value = data
        }

        }

    }



// 刪除帶進參數productID
const removeItem = async(productID)=>{
  const response=  await fetch ('http://localhost:8082/Cart/remove',{

             method: 'DELETE',
             headers:{'Content-Type':'application/json'},
             body: JSON.stringify({
                   memberID :store.memberID,
                   productID:productID
             })
  })

             if(response.ok){
                const data = await response.json()
                cartItems.value=data
             }

}


//讀取購物車
onMounted(async ()=>{
const response = await fetch(`http://localhost:8082/Cart/${store.memberID}`)
const data = await response.json()

cartItems.value=data
})

//結帳
const checkout = async () => {
         const response = await fetch(`http://localhost:8082/Order/checkout/${store.memberID}`,{
         method:'POST'


})

if(response.ok){
    const data = await response.json()
    alert('結帳成功 總金額:' + data.amount)
    // 前端不會自動知道後端發生了什麼，你要主動告訴它「資料變了」，所以給她空陣列
    cartItems.value = []

}else{
    alert('結帳失敗')
}

}

</script>

<style scoped>

</style>
