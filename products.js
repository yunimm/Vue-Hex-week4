import pagination from './pagination.js'
const apiUrl = 'https://vue3-course-api.hexschool.io/v2'
const apiPath = 'yu-hexschool'
let productModal = {}
let delProductModal = {}

// 建立Vue環境
const app = Vue.createApp({
  components: {
    pagination,
  },
  data() {
    return {
      products: [],
      tempProduct: {
        //多圖資料
        imageUrl: [],
      },
      isNew: false,
      pagination: {},
    }
  },
  methods: {
    // 確認使用者身份，身份正確則登入，身份錯誤則導回登入頁面
    checkAdmin() {
      const url = `${apiUrl}/api/user/check`
      axios
        .post(url)
        .then(() => {
          this.getProducts()
        })
        .catch((err) => {
          alert(err.data.message)
          window.location = 'index.html'
        })
    },
    getProducts(page = 1) {
      //參數預設值,如果不帶入參數會變成undefined
      //query, ?去帶
      //params
      const url = `${apiUrl}/api/${apiPath}/admin/products/?page=${page}`
      axios
        .get(url)
        .then((res) => {
          this.products = res.data.products
          this.pagination = res.data.pagination
        })
        .catch((err) => {
          alert(err.data.message)
        })
    },
    // 新增和編輯共用modal,帶入狀態和產品
    openModal(status, product) {
      if (status === 'isNew') {
        this.tempProduct = {
          imageUrl: [],
        }
        productModal.show()
        this.isNew = true
      } else if (status === 'edit') {
        // 淺拷貝,避免編輯到一半退出後改到原本的資料
        //如果外層顯示到深層的圖片,可能就得改用深層拷貝
        this.tempProduct = { ...product }
        productModal.show()
        this.isNew = false
      } else if ((status = 'delete')) {
        delProductModal.show()
        this.tempProduct = { ...product }
      }
    },
  },

  mounted() {
    // 讀取token
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/,
      '$1'
    )
    // 將token寫入axios預設設定
    axios.defaults.headers.common.Authorization = token
    this.checkAdmin()

    productModal = new bootstrap.Modal(
      document.getElementById('productModal'),
      {
        keyboard: true,
      }
    )
    delProductModal = new bootstrap.Modal(
      document.getElementById('delProductModal'),
      {
        keyboard: true,
      }
    )
  },
})
// // 全域註冊
app
  .component('productModal', {
    props: ['tempProduct', 'isNew'],
    template: '#templateForProductModal',
    methods: {
      updateProduct() {
        let url = `${apiUrl}/api/${apiPath}/admin/product`
        let method = 'post'
        // 使用isNew狀態來判斷當前指令是編輯還是新增商品,取用不同的api組合
        if (!this.isNew) {
          url = `${apiUrl}/api/${apiPath}/admin/product/${this.tempProduct.id}`
          method = 'put'
        }
        axios[method](url, { data: this.tempProduct })
          .then((res) => {
            // 通知父元件更新畫面
            this.$emit('get-products')
            productModal.hide()
          })
          .catch((err) => {
            alert(err.data.message)
          })
      },
    },
  })
  .component('delProductModal', {
    props: ['tempProduct'],
    template: '#templateForDelModal',
    methods: {
      deleteProduct() {
        const url = `${apiUrl}/api/${apiPath}/admin/product/${this.tempProduct.id}`
        axios
          .delete(url)
          .then((res) => {
            // 通知父元件更新畫面
            this.$emit('get-products')
            delProductModal.hide()
          })
          .catch((err) => {
            alert(err.data.message)
          })
      },
    },
  })

app.mount('#app')
