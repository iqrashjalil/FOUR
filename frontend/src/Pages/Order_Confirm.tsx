import { emptyCart } from "@/store/slices/userSlice";
import { useAppDispatch } from "@/store/store";
import { ArrowRight, Truck } from "lucide-react";
import { useEffect } from "react";
import { NavLink } from "react-router-dom";

const Order_Confirm = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(emptyCart());
  }, [dispatch]);
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col items-center">
        <Truck className="text-green-500" size={200} />

        <h1 className="text-5xl font-extrabold">
          Hurray<span className="text-amber-500">!</span> Order Placed!
        </h1>
        <NavLink
          className="flex items-center p-2 text-white rounded bg-primary"
          to={"/"}
        >
          Go Home Explore More! <ArrowRight />
        </NavLink>
      </div>
    </div>
  );
};

export default Order_Confirm;
