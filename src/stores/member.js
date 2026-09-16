import { defineStore } from "pinia";
import { ref } from "vue";
// export公開的方法，其他檔案可以import
// defineStore建立倉庫的語法
export const useMemberStore = defineStore('member', ()=>{
    // 登入的時候把值放進去，像是後端 Entity 的屬性 → 存在資料庫
    const memberID =ref(null)
    const membername = ref('')

    // 像是後端 Entity把值set
    const setMember = (data) => {
        memberID.value =data.memberID
        // 我的值=外面傳進來的
        membername.value = data.membername
    }

    return {memberID,membername,setMember}
})