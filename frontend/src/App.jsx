import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from "react-hot-toast";
import { useState, useEffect } from 'react';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductViewDetails from './pages/ProductViewDetails';
import ViewCategories from './pages/ViewCategories';
import ChangePassword from './pages/ChangePassword';
import Cart from './pages/Cart';
import EnterShippingDetails from './pages/EnterShippingDetails';


import Header from './component/Header';
import SearchPage from './pages/SearchPage';
import AddReview from './pages/AddReview';
import ViewOrders from './pages/ViewOrders';
import PlaceOrder from './pages/placeOrder';
import ViewAllUsers from './pages/ViewAllUsers';
import OrderHistory from './pages/OrderHistory';
import ProtectedRoute from "./protected/ProtectedRoute";
import UserOrderDetails from './pages/UserOrderDetails';

import EditProfile from './pages/EditProfile';
import Profile from './pages/Profile';
import ForgotPassword from './pages/ForgotPassword';
import SkinTypeQuiz from './pages/SkinQuiz';
import EditReview from './pages/EditReview';
import ViewProductList from './pages/ViewProductList';
import DeleteAccount from './pages/DeleteAccount';

import Addproduct from './pages/Addproduct';
import AdminDashboard from "./pages/AdminDashboard";
import Footer from './component/Footer';
import Wishlist from './pages/Wishlist';
import { getUserRole } from './protected/Auth';
import Landing from './pages/Landing';
import ViewAdminOrders from './pages/ViewAdminOrders';
import OrderDetailsAdmin from './pages/OrderDetailsAdmin';
import Contact from './pages/ContactPage';
import About from './pages/About';

import AdminProfile from './pages/AdminProfile';
import AdminEditProfile from './pages/AdminEditProfile';
import ViewReview from './pages/ViewReview';
import EditProduct from './pages/EditProduct';
import ContactPage from './pages/ContactPage';

function App() {
  const [isAdmin, setIsAdmin] = useState(getUserRole() === "admin");

  useEffect(() => {
    setIsAdmin(getUserRole() === "admin");

    const handleUserLogin = () => {
      setIsAdmin(getUserRole() === "admin");
    };

    const handleUserLogout = () => {
      setIsAdmin(false);
    };

    window.addEventListener("userLogin", handleUserLogin);
    window.addEventListener("logout", handleUserLogout);

    return () => {
      window.removeEventListener("userLogin", handleUserLogin);
      window.removeEventListener("logout", handleUserLogout);
    };
  }, []);

  return (
    <Router>
      <Toaster />
      {isAdmin ? <></> : <Header />}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/userdash" element={<ProtectedRoute allowedRoles={["user"]} element={<Dashboard />} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/viewcart" element={<ProtectedRoute allowedRoles={["user"]} element={<Cart />} />} />
        <Route path="/shippingdetails" element={<ProtectedRoute allowedRoles={["user"]} element={<EnterShippingDetails />} />} />
        <Route path="/editprofile" element={<ProtectedRoute allowedRoles={["user"]} element={<EditProfile />} />} />
        <Route path="/admineditprofile" element={<ProtectedRoute allowedRoles={["admin"]} element={<AdminEditProfile/>} />} />
        <Route path="/profile" element={<ProtectedRoute allowedRoles={["user"]} element={<Profile />} />} />
        <Route path="/addproduct" element={<ProtectedRoute allowedRoles={["admin"]} element={<Addproduct />} />} />
        <Route path="/adminprofile" element={<ProtectedRoute allowedRoles={["admin"]} element={<AdminProfile/>} />} />
        <Route path="/admindash" element={<ProtectedRoute allowedRoles={["admin"]} element={<AdminDashboard />} />} />
        <Route path='/wishlist' element={<ProtectedRoute allowedRoles={["user"]} element={<Wishlist />} />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/skinquiz" element={<SkinTypeQuiz />} />
        <Route path="/editreview/:reviewId" element={<ProtectedRoute allowedRoles={["user", "admin"]} element={<EditReview />} />} />
        <Route path="/viewproductlist" element={<ViewProductList />} />
        <Route path="/shop" element={<ViewCategories />} />
        <Route path="/changepassword" element={<ProtectedRoute allowedRoles={["user", "admin"]} element={<ChangePassword />} />} />
        <Route path="/shipping" element={<ProtectedRoute allowedRoles={["user"]} element={<EnterShippingDetails />} />} />
        <Route path="/addreview/:productId" element={<ProtectedRoute allowedRoles={["user"]} element={<AddReview />} />} />
        <Route path="/orders" element={<ProtectedRoute allowedRoles={["user"]} element={<ViewOrders />} />} />
        <Route path="/placeorders" element={<ProtectedRoute allowedRoles={["user"]} element={<PlaceOrder />} />} />
        <Route path="/viewallusers" element={<ProtectedRoute allowedRoles={["admin"]} element={<ViewAllUsers />} />} />
        <Route path="/vieworderhistory" element={<ProtectedRoute allowedRoles={["user"]} element={<OrderHistory />} />} />
        <Route path="/order/:id" element={<ProtectedRoute allowedRoles={["user"]} element={<UserOrderDetails />} />} />
        <Route path="/product/:id" element={<ProductViewDetails />} />
        <Route path="/viewadminorder" element={<ProtectedRoute allowedRoles={["admin"]} element={<ViewAdminOrders />}/>}/>
        <Route path="/admin/order/:id" element={<ProtectedRoute allowedRoles={["admin"]} element={<OrderDetailsAdmin />} />} />
        <Route path="/deleteuser" element={<ProtectedRoute allowedRoles={["user","admin"]} element={<DeleteAccount />} />} />
        <Route path="/editproduct/:id" element={<ProtectedRoute allowedRoles={["admin"]} element={<EditProduct />} />} />
        <Route path="/viewreview/:productId" element={<ProtectedRoute allowedRoles={["user", "admin"]} element={<ViewReview />} />} />
        <Route path="/about" element={<About/>}/>
        <Route path="/contact" element={<ContactPage/>}/>
      </Routes>
      {isAdmin ? <></> : <Footer />}

    </Router>
  )
}

export default App