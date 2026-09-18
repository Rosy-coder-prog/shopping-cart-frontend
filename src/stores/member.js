import { defineStore } from "pinia";
import { ref } from "vue";
// export公開的方法，其他檔案可以import
// defineStore建立倉庫的語法
//'member' 倉庫名稱
export const useMemberStore = defineStore('member', ()=>{
    // 登入的時候把值放進去，像是後端 Entity 的屬性 → 存在資料庫
    // 先宣告變數，等登入成功後再存值進去
    //數字null ，文字 ''(空字串)
    const memberID =ref(null)
    const membername = ref('')
    const role = ref('')

    // 像是後端 Entity把值set
    const setMember = (data) => {
        memberID.value =data.memberID
        // 我的值=外面傳進來的
        membername.value = data.membername
        role.value = data.role
    }  

    

    const logout =()=>{
        memberID.value=null,
        membername.value='',
        role.value=''

    }

    return {memberID,membername,setMember,logout,role}

    
})