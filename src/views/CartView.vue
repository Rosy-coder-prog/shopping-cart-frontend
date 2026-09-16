<template>

<div>
    <h1>購物車</h1>
    <div v-if="cartItems.length === 0">購物車是空的</div>
    <div v-for="item in cartItems" :key="item.productID">

        {{ item.productname }} - {{ item.price }} - {{ item.cartQuantity }}

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


// 刪除
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
    cartItems.value = []

}else{
    alert('結帳失敗')
}

}

</script>

<style scoped>

</style>
