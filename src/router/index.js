import LoginView from '@/views/LoginView.vue'
import ProductView from '@/views/ProductView.vue'
import CartView from '@/views/CartView.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {path:'/',
      // 使用者在瀏覽器打什麼網址，就對應到什麼頁面
    redirect:'/login'
    // 使用者打了 A 網址，自動跳到 B
    
    },
    {
      path:'/login',
     component:LoginView
     // 這個路徑顯示哪個頁面
    },
    {
// 當網址是 /products 的時候，顯示 ProductView.vue
        path:'/products',
        component:ProductView
    },{
    path:'/cart',
    component:CartView
    }
  ],
})

export default router
