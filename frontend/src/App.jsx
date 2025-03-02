import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Home from "./pages/home";
import Profile from "./pages/profile";
import Navbar from "./components/navbar";
import Buyitems from "./pages/buy";
import AddItem from "./pages/additem";
import ProductDetails from "./pages/item";
import MyCart from "./pages/mycart";
import OrdersHistory from "./pages/orderhistory";
import Sellerorders from "./pages/sellerorder";
import Chatbot from "./pages/chatbot";
import "./App.css";

function App() {
  const token = localStorage.getItem('token');

  return (
    <Router>
      {token && <Navbar />}
      <Routes>
        <Route path="/" element={token?<Profile/> : <Home/>} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={token ? <Profile /> : <Navigate to="/" />} />
        <Route path="/buy" element={token ? <Buyitems /> : <Navigate to="/" />} />
        <Route path="/additem" element={token ? <AddItem /> : <Navigate to="/" />} />
        <Route path="/items/:id" element={token? <ProductDetails /> : <Navigate to="/"/>} />
        <Route path="/mycart" element={token ? <MyCart /> : <Navigate to="/" />} />
        <Route path="/orderhistory" element={token ? <OrdersHistory /> : <Navigate to="/" />} />
        <Route path="/sellerorders" element={token ? <Sellerorders /> : <Navigate to="/" />} />
        <Route path="/chatbot" element={token ? <Chatbot /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
