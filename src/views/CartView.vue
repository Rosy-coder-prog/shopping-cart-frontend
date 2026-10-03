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

    <div v-if="cartItems.length > 0">
       總金額: ${{total}}
<button  @click="checkout">結帳</button>
    </div>
    
</div>

</template>

<script setup>
import api from '@/api/axios'
// computed 是「自動計算的值」
import {ref,onMounted,computed} from 'vue'


const cartItems = ref([])

const total = computed(() => {
// reduce，可以把整個陣列「累加」成一個值
    return cartItems.value.reduce((sum,item) =>{
        return sum + item.price*item.cartQuantity  
        //  0 是初始值，sum 從 0 開始累加
               },0 )
})


// 增加商品                 靠順序  第一個值     第二個值
const changecartQuantity = async(productID,newQuantity) =>{
    if(newQuantity<=0){
        removeItem(productID)
    }else{
        try{const response = await api.put('/api/cart/update',{
                productID:productID,
                cartQuantity:newQuantity
        })  
        //更新畫面
        cartItems.value = response.data
            }catch(error){
                alert(error.response?.data?.message || '增加失敗')

            }
        }

        
        }
        

      


// 刪除帶進參數productID
const removeItem = async(productID)=>{

  try{
   const response=   await api.delete('/api/cart/remove',{
            data:{productID:productID } 
   })
      //更新畫面
            cartItems.value = response.data

   alert('刪除成功')
  }catch(error){
    
   alert(error.response?.data?.message || '刪除失敗')
  }

}


//讀取購物車
onMounted(async ()=>{
const response = await api.get('/api/cart')


cartItems.value=response.data
})

//結帳
const checkout = async () => {

        try{const response = await api.post('/api/order/checkout')

        alert('結帳成功，總金額:' + response.data.amount)

        cartItems.value = []
        
        } catch(error){
            alert(error.response?.data?.message || '結帳失敗')
        }
        

    }


</script>

<style scoped>

</style>

/*
// 刪除帶進參數productID
const removeItem = async(productID)=>{
  const response=  await fetch ('http://localhost:8082/api/cart/remove',{

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
*/
/*
//讀取購物車
onMounted(async ()=>{
const response = await fetch(`http://localhost:8082/api/cart/${store.memberID}`)
const data = await response.json()

cartItems.value=data
})

//結帳
const checkout = async () => {
         const response = await fetch(`http://localhost:8082/api/order/checkout/${store.memberID}`,{
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
*/

/*
// 增加商品
const changecartQuantity = async(productID,newQuantity) =>{
    if(newQuantity<=0){
        removeItem(productID)
    }else{
        const response = await fetch('http://localhost:8082/api/cart/update',{
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
    */