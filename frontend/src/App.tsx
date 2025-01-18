import {
  Route,
  Routes,
  BrowserRouter as Router,
  useLocation,
} from "react-router-dom";
import Home from "./Pages/Home";
import Navbar from "./components/Header/Navbar";
import Login from "./Pages/auth/Login";
import Register from "./Pages/auth/Register";
import Footer from "./components/Footer/Footer";
import All_Items from "./Pages/All_Items";
import { useEffect } from "react";
import { useAppDispatch } from "./store/store";
import { getUser } from "./store/thunks/userThunks";
import Floating_Button from "./components/Floating_Button";
import Checkout from "./Pages/Checkout";
import "./app.css";
import Protected_Route from "./Protected_Route";
import Dashboard from "./Pages/admin/Dashboard";
import All_Orders from "./Pages/admin/All_Orders";
import All_Users from "./Pages/admin/All_Users";
import All_Coupons from "./Pages/admin/All_Coupons";
import New_Menu from "./Pages/admin/New_Menu";
import All_Menu from "./Pages/admin/All_Menu";
import Edit_Item from "./Pages/admin/Edit_Item";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import Order_Confirm from "./Pages/Order_Confirm";
import Error_404 from "./Pages/Error_404";

const stripePromise = loadStripe(
  "pk_test_51PGdZyIJCjG6VKKG0ZjRbBNbjsLTrZcGIEwYfm645u4PTudXgv89cDosQ5nG80JaaUsre3qNDtW0jtXg6jtvMvfp00XgGKjlRe"
);

function App() {
  const dispatch = useAppDispatch();
  const isAuthenticated = localStorage.getItem("isAuthenticated");

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getUser());
    }
  }, [isAuthenticated, dispatch]);

  return (
    <Router>
      <Main />
    </Router>
  );
}

function Main() {
  const location = useLocation(); // Now inside the Router context

  const hideNavbarRoutes = [
    "/dashboard",
    "/allorders",
    "/allusers",
    "/allcoupons",
    "/newmenuitem",
    "/fullmenu",
    "/editmenuitem",
  ];
  const shouldHideNavbar = hideNavbarRoutes.some((route) =>
    location.pathname.startsWith(route)
  );
  return (
    <>
      {!shouldHideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/allmenuitems" element={<All_Items />} />
        <Route path="/orderconfirm" element={<Order_Confirm />} />
        <Route
          path="/checkout"
          element={
            <Elements stripe={stripePromise}>
              <Checkout />
            </Elements>
          }
        />
        <Route
          path="/dashboard"
          element={
            <Protected_Route requiredRole="admin">
              <Dashboard />
            </Protected_Route>
          }
        />
        <Route
          path="/allorders"
          element={
            <Protected_Route requiredRole="admin">
              <All_Orders />
            </Protected_Route>
          }
        />
        <Route
          path="/allusers"
          element={
            <Protected_Route requiredRole="admin">
              <All_Users />
            </Protected_Route>
          }
        />
        <Route
          path="/allcoupons"
          element={
            <Protected_Route requiredRole="admin">
              <All_Coupons />
            </Protected_Route>
          }
        />
        <Route
          path="/newmenuitem"
          element={
            <Protected_Route requiredRole="admin">
              <New_Menu />
            </Protected_Route>
          }
        />
        <Route
          path="/fullmenu"
          element={
            <Protected_Route requiredRole="admin">
              <All_Menu />
            </Protected_Route>
          }
        />
        <Route
          path="/editmenuitem/:id"
          element={
            <Protected_Route requiredRole="admin">
              <Edit_Item />
            </Protected_Route>
          }
        />
        <Route path="*" element={<Error_404 />} />
      </Routes>

      {!shouldHideNavbar && <Footer />}
      {!shouldHideNavbar && <Floating_Button />}
    </>
  );
}

export default App;
