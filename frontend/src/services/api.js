import axios from 'axios';

const ApiFormData = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials:true,
    headers:{
        "Content-Type":"multipart/form-data",
    },
});

const Api=axios.create({
    baseURL:import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
    headers:{
        "Content-Type":"application/json"
    }
});

const authConfig = (extraHeaders = {}) => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
    ...extraHeaders,
  },
});

export const loginUser = (data) => Api.post("/api/user/login", data);
export const createUserApi = (data) => Api.post("/api/user/register", data);

export const fetchProducts = () => Api.get("/api/product/getallproducts");
export const fetchCategories = () => Api.get("/api/product/getcategories");

export const getProductDetailsApi = (id) => {
  if (!id) throw new Error("Product ID is required");
  return Api.get(`/api/product/productdetails/${id}`, authConfig());
};

export const getCartByUserApi = () => Api.get("/api/cart/getCart", authConfig());


export const addProductApi = (data) => ApiFormData.post("/api/product/addproduct", data, authConfig());
export const updateProductApi = (id, data) => ApiFormData.put(`/api/product/updateProduct/${id}`, data, authConfig());
export const searchProducts = (keyword) => Api.get(`/api/product/search?keyword=${encodeURIComponent(keyword)}`);

export const getProfileApi = () => Api.get("/api/user/profile", authConfig());
export const updateProfileApi = (formData) => ApiFormData.put("/api/user/profile", formData, authConfig());
export const updateCartQuantity = (productId, quantity ) => Api.put(`/api/cart/updateCart/${productId}`, { quantity }, authConfig());
export const addToCartApi = (data) => Api.post("/api/cart/add", data, authConfig());
export const clearCartApi = () => Api.delete("/api/cart/clearcart", authConfig());
export const removeCartItemApi = (productId) => Api.delete(`/api/cart/removecartitem/${productId}`, authConfig()); //ritu


export const deleteProductApi = (id) => Api.delete(`/api/product/deleteproduct/${id}`, authConfig())

export const saveShippingApi = (data) => Api.post(`/api/shipping/saveShipping`, data, authConfig());
export const getAllShippingApi =() => Api.get(`/api/shipping/getAllShipping`, authConfig());
export const getSavedShippingApi = () => Api.get("/api/shipping/getsavedshipping", authConfig());
export const changePasswordApi = (data) => Api.put('/api/user/changepassword', data, authConfig());

export const getProductByIdApi = (id) => Api.get(`/api/product/getProductById/${id}`)

export const  submitQuizApi = (data) => Api.post('/api/quiz/submit', data, authConfig());
export const getQuizResultsApi = () => Api.get('/api/quiz/results', authConfig());

export const deleteMyAccountApi = () =>
  Api.delete("/api/user/deleteuser", authConfig());

export const sendForgotPasswordOtpApi = (data) =>
  Api.post("/api/user/forgotpassword/sendotp", data);

export const verifyForgotPasswordOtpApi = (data) =>
  Api.post("/api/user/forgotpassword/verifyotp", data);

export const resetPasswordApi = (data) =>
  Api.put("/api/user/forgotpassword/resetpassword", data);




export const getProductsByCategoryApi = (category) => {
  if (!category) throw new Error("Category is required");
  return Api.get(`/api/product/getproductsbycategory/${encodeURIComponent(category)}`);
};

//Wishlist APIs
export const addToWishListApi = (data) => Api.post("/api/wishlist/addwishlist", data, authConfig());
export const getWishListApi = () => Api.get("/api/wishlist/getwishlist", authConfig());
export const removeFromWishListApi = (productId) => Api.delete(`/api/wishlist/removewishlist/${productId}`, authConfig());
export const moveToCartApi = (productId) => Api.post(`/api/wishlist/movetocart/${productId}`, {}, authConfig());
export const editProductApi = (productId, data) => ApiFormData.put(`/api/product/updateProduct/${productId}`, data, authConfig());

//review
export const createReviewApi = (data) => Api.post("/api/review/createreview", data, authConfig());
export const getProductReviewsApi = (productId) => Api.get(`/api/review/getreview/${productId}`, authConfig());
export const getReviewByIdApi = (reviewId) => Api.get(`/api/review/getreview-by-id/${reviewId}`, authConfig());
export const updateReviewApi = (reviewId, data) => Api.put(`/api/review/updatereview/${reviewId}`, data, authConfig());
export const deleteReviewApi = (reviewId) => Api.delete(`/api/review/deletereview/${reviewId}`, authConfig());
export const placeOrderApi = (data) => Api.post("/api/order/place", data, authConfig());
export const getOrdersApi = () => Api.get("/api/order/get_allorders", authConfig());
export const getOrderDetailsApi = (orderId) => Api.get("/api/order/getorder", { params: { orderId }, ...authConfig() });
export const getAllOrdersAdminApi = (status) => Api.get("/api/order/get-all", { params: { status }, ...authConfig() });
export const getOrderDetailsAdminApi = (orderId) => Api.get("/api/order/getorder-admin", { params: { orderId }, ...authConfig() });
export const updateOrderStatusApi = (orderId, status) => Api.put(`/api/order/update-status/${orderId}`, { status }, authConfig());

export const getAllUsersApi = (role) => Api.get(`/api/user/viewallusers`, {params: {role}, ...authConfig()})
export const getRelatedProductsApi = (id, category) => 
  Api.get("/api/product/relatedproducts", {
    params: { id, category }
  });