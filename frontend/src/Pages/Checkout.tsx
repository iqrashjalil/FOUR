import { serverUrl } from "@/serverUrl";
import { addToCart, decreaseQuantity } from "@/store/slices/userSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { fetchCoupon } from "@/store/thunks/couponThunks";
import { couponInfo, menuItem, orderInfo, userInfo } from "@/types/types";
import { useEffect, useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa6";
import { RiDeleteBinLine } from "react-icons/ri";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useNavigate } from "react-router-dom";
import cod from "../Assets/cashondelivery.png";
import { FaCcVisa } from "react-icons/fa";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { toast } from "react-toastify";
import { createOrder } from "@/store/thunks/orderThunks";
import { clearMessage, clearSuccess } from "@/store/slices/orderSlice";

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const stripe = useStripe();
  const elements = useElements();
  const {
    error: orderError,
    message: orderMessage,
    success,
  } = useAppSelector((state) => state.orders);
  const { cart, user } = useAppSelector((state) => state.users);
  const { coupon, message, loading, error } = useAppSelector(
    (state) => state.coupon
  );
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const userDetails = user as userInfo;
  const couponCode = coupon as unknown as couponInfo;
  const [order, setOrder] = useState<orderInfo>({
    _id: "",
    coupon: "",
    items: [],
    totalAmount: 0,
    paymentMethod: "",
    phone: "",
    address: "",
    paymentMethodId: "",
  });
  const [paymentMethodId, setPaymentMethodId] = useState("");
  const [code, setCode] = useState("");
  const handleQuantityIncrement = (newItem: menuItem) => {
    dispatch(addToCart(newItem));
  };
  const handleQuantityDecrement = (newItem: menuItem) => {
    dispatch(decreaseQuantity(newItem));
  };

  const cartPrice = cart.reduce((total, cartItem) => {
    return total + cartItem.item.price * cartItem.quantity;
  }, 0);

  const discount = couponCode?.discount || 0;
  const totalPrice = cartPrice - (cartPrice * discount) / 100;
  const handleBack = () => {
    navigate("/allmenuitems");
  };

  const handleCoupon = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value);
  };
  useEffect(() => {
    dispatch(fetchCoupon(code));
  }, [code, dispatch]);
  useEffect(() => {
    setOrder({
      _id: userDetails?._id,
      coupon: couponCode?.code || "",
      items: cart.map((cartItem) => ({
        item: cartItem.item,
        quantity: cartItem.quantity,
      })),
      paymentMethod: paymentMethod,
      totalAmount: totalPrice,
      phone: phone || userDetails?.phone || "",
      address: address || userDetails?.address || "",
      paymentMethodId: paymentMethodId,
    });
  }, [
    address,
    cart,
    couponCode?.code,
    paymentMethod,
    paymentMethodId,
    phone,
    totalPrice,
    userDetails?._id,
    userDetails?.address,
    userDetails?.phone,
  ]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (paymentMethod === "card") {
      if (!stripe || !elements) {
        toast.error("Stripe has not loaded yet.");
        return;
      }

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        toast.error("CardElement not found.");
        return;
      }

      const { error, paymentMethod: stripePaymentMethod } =
        await stripe.createPaymentMethod({
          type: "card",
          card: cardElement,
        });

      if (error) {
        toast.error(`Payment error: ${error?.message}`);
        return;
      }

      if (!stripePaymentMethod?.id) {
        toast.error("Failed to create payment method.");
        return;
      }
      setPaymentMethodId(stripePaymentMethod?.id);
      if (stripePaymentMethod.id) {
        dispatch(createOrder(order));
      }
    }
  };
  const handleCodSubmit = () => {
    dispatch(createOrder(order));
  };
  useEffect(() => {
    if (orderError) {
      toast.error(orderError);
    }
    if (orderMessage) {
      toast.success(orderMessage);
      dispatch(clearMessage());
    }
    if (success) {
      navigate("/orderconfirm");
      localStorage.removeItem("cart");
      dispatch(clearSuccess());
    }
  }, [
    cart,
    dispatch,
    error,
    message,
    navigate,
    orderError,
    orderMessage,
    success,
  ]);
  return (
    <div className="flex flex-col items-center px-2 pt-[70px] md:pt-[80px]">
      <section className="container border-b border-slate-200 flex flex-col md:flex-row gap-y-10 md:gap-y-0 gap-[10%]">
        <div className="w-full md:w-[45%] border-b md:border-none border-slate-200 pb-5 md:pb-0">
          <div className="flex items-center gap-5">
            <FaArrowLeft
              onClick={handleBack}
              className="cursor-pointer"
              size={25}
            />
            <h1 className="text-3xl font-bold text-slate-700">Cart</h1>
          </div>
          <div className="flex flex-col gap-5 mt-5">
            {cart.map((cart, index) => (
              <div
                className="flex items-center w-full gap-2 p-2 rounded-lg bg-slate-100"
                key={index}
              >
                <div className="w-[20%] md:w-[10%]">
                  <LazyLoadImage
                    className="w-full h-full rounded"
                    src={`${serverUrl}/${cart.item.image}`}
                  />
                </div>
                <div className="w-[50%] md:w-[70%]">
                  <h1 className="font-semibold">{cart.item.name}</h1>
                  <p className="text-sm">{cart.item.category}</p>
                  <p className="font-semibold text-orange-600">
                    RS: {cart.item.price}
                  </p>
                </div>
                <div className="w-[30%] md:w-[20%] flex justify-center">
                  <p className="flex gap-2 text-sm">
                    <button
                      onClick={() => handleQuantityDecrement(cart.item)}
                      className="flex items-center justify-center h-6 p-1 rounded w-7 bg-primary"
                    >
                      {cart.quantity === 1 ? (
                        <RiDeleteBinLine className="text-white" size={15} />
                      ) : (
                        <FaMinus className="text-white" />
                      )}
                    </button>{" "}
                    <span className="w-2 font-bold">{cart.quantity}</span>{" "}
                    <button
                      onClick={() => handleQuantityIncrement(cart.item)}
                      className="flex items-center justify-center h-6 p-1 rounded w-7 bg-primary"
                    >
                      <FaPlus className="text-white" />
                    </button>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className=" w-full md:w-[45%]">
          <div>
            <h1 className="text-3xl font-bold text-slate-700">Total</h1>
            <p className="text-slate-400">
              Estimated Delivery Time <span className="text-primary">45</span>{" "}
              Mins
            </p>
          </div>
          <div className="border-b border-slate-300">
            {cart.map((cart, index) => (
              <div
                className="flex items-center justify-between mt-5"
                key={index}
              >
                <p className="font-light text-slate-400">
                  <span>{cart.quantity} x </span>
                  {cart.item.name}
                </p>
                <p className="text-slate-400">
                  RS: {(cart.item.price * cart.quantity).toLocaleString()}
                </p>
              </div>
            ))}
            <div className="flex justify-between my-5">
              <p className="text-orange-500">Enter Coupon Here</p>
              <div>
                <div className="relative flex items-center gap-2">
                  <input
                    className="p-1 border-2 rounded outline-none border-slate-200"
                    type="text"
                    value={code}
                    onChange={handleCoupon}
                    placeholder="Enter Coupon"
                  />
                  <div
                    className={`${
                      loading ? "opacity-100" : "opacity-0"
                    } absolute right-2`}
                    role="status"
                  >
                    <svg
                      aria-hidden="true"
                      className="w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-primary"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                    <span className="sr-only">Loading...</span>
                  </div>
                </div>
                <p
                  className={`text-sm font-light ${
                    error
                      ? "text-primary"
                      : message
                      ? "text-green-500"
                      : "text-white"
                  }`}
                >
                  {error || message || "No Error or Message"}
                  {message ? "😊" : ""}
                </p>
              </div>
            </div>
            <div className="flex justify-between my-5 text-orange-500">
              <p>Discount</p>
              <p>-RS: {(discount * cartPrice) / 100}</p>
            </div>
          </div>
          <div className="my-5">
            <div className="flex justify-between">
              <p className="text-2xl font-semibold">Grand Total</p>
              <p className="text-2xl font-semibold">
                Rs:{" "}
                <span className="text-green-500">
                  {totalPrice.toLocaleString()}
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="container mt-5 flex flex-col md:flex-row gap-y-10 md:gap-y-0 gap-[10%]">
        <div className="w-full md:w-[45%] border-b md:border-none border-slate-200 pb-5 md:pb-0 ">
          <h1 className="text-3xl font-bold text-slate-700">Checkout</h1>
          <div className="mt-5">
            <div className="flex justify-end font-semibold text-primary">
              <button className="">Change</button>
            </div>
            {userDetails?.address && (
              <div className="flex items-center justify-between p-2 rounded bg-slate-100">
                <div>
                  {" "}
                  <h1 className="text-xl font-semibold">Current Address</h1>
                  <p className="font-light">{userDetails?.address}</p>
                </div>
                <div>
                  <input
                    type="radio"
                    onChange={() => setAddress("")}
                    checked={!address}
                    className="w-6 h-6"
                  />
                </div>
              </div>
            )}
            <div className="flex flex-col mt-5">
              <label htmlFor="">
                Use A Different <span className="text-primary">Address</span>
              </label>
              <input
                type="text"
                name="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="p-2 border-2 rounded outline-none border-slate-200"
                placeholder="Enter New Address"
              />
            </div>
          </div>
          <div className="mt-5">
            <div className="flex justify-end font-semibold text-primary">
              <button className="">Change</button>
            </div>
            {userDetails?.phone && (
              <div className="flex items-center justify-between p-2 rounded bg-slate-100">
                <div>
                  <h1 className="text-xl font-semibold">Current Phone</h1>
                  <p className="font-light">{userDetails?.phone}</p>
                </div>
                <div>
                  <input
                    type="radio"
                    onChange={() => setPhone("")}
                    checked={!phone}
                    className="w-6 h-6"
                  />
                </div>
              </div>
            )}
            <div className="flex flex-col mt-5">
              <label htmlFor="">
                Use A Different <span className="text-primary">Phone</span>
              </label>
              <input
                type="text"
                name="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="p-2 border-2 rounded outline-none border-slate-200"
                placeholder="Enter New Phone Number"
              />
            </div>
          </div>
        </div>
        <div className=" w-full md:w-[45%]">
          <div>
            <h1 className="text-3xl font-bold text-slate-700">
              Payment Method
            </h1>
            <p className="mt-5 text-slate-400">
              By selecting your mode of payment, you will agree to transfer
              funds for the order you are going to make.
            </p>
          </div>
          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between p-4 rounded bg-slate-100">
              <div className="flex items-center gap-10">
                <input
                  name="paymentMethod"
                  type="radio"
                  value="cod"
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-6 h-6 cursor-pointer"
                />
                <h1 className="font-semibold ">Cash On Delivery</h1>
              </div>
              <LazyLoadImage className="w-10 h-10" src={cod} />
            </div>
            <div className="flex items-center justify-between p-4 rounded bg-slate-100">
              <div className="flex items-center gap-10">
                <input
                  name="paymentMethod"
                  type="radio"
                  value="card"
                  defaultChecked
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-6 h-6 cursor-pointer"
                />
                <h1 className="font-semibold ">Pay With Card</h1>
              </div>
              <FaCcVisa className="w-10 h-10 text-blue-500" />
            </div>
            {paymentMethod === "cod" && (
              <button
                onClick={handleCodSubmit}
                className="p-3 font-semibold text-white transition-all duration-200 rounded-lg hover:text-black hover:bg-slate-300 bg-primary "
              >
                Place Order
              </button>
            )}
            {paymentMethod === "card" && (
              <>
                <div className="flex items-center my-4">
                  <hr className="flex-grow border-t border-gray-300" />
                  <span className="px-4 text-sm text-gray-500">
                    Pay With Card
                  </span>
                  <hr className="flex-grow border-t border-gray-300" />
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="block mb-1 font-medium">
                      Card Details
                    </label>
                    <div className="px-3 py-2 border rounded">
                      <CardElement />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full p-3 font-semibold text-white transition-all duration-200 rounded-lg hover:text-black hover:bg-slate-300 bg-primary "
                  >
                    Place Order
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Checkout;
