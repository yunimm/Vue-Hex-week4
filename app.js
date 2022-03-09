const BASE_URL = "https://vue3-course-api.hexschool.io/v2/admin/signin"

// 建立Vue環境
const app = {
  data() {
    return {
      user: {
        username: '',
        password: '',
      },
    }
  },
  methods: {
    login() {
      // 用axios接API
      axios
      // 加入站點/API登入程序/使用者帳密
      .post(BASE_URL, this.user)
      .then((res) => {
        // console.log(res)
        // 寫入token,目的驗證管理員身分
        const {token, expired} = res.data
        // 將token存入cookie
        document.cookie = `hexToken=${ token }; expires=${new Date(expired)}`
        // 跳轉至商品頁面
        window.location = 'productsList.html'
      })
      .catch((error) => {
        console.log(error.message)
        this.user.password = ''
      })
      
    }
    
  }
}
Vue.createApp(app).mount('#app')