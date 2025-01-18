import Sidebar from "@/components/Sidebar";
import { useAppDispatch, useAppSelector } from "@/store/store";
import LineChart from "@/components/charts/Line_Chart";
import Dougnut_Chart from "@/components/charts/Dougnut_Chart";
import { useEffect } from "react";
import {
  getAllOrders,
  getMonthlySales,
  updateOrder,
} from "@/store/thunks/orderThunks";
import { orderInfo, paginationInfo } from "@/types/types";
import { getAllUsers } from "@/store/thunks/userThunks";
import { getAllCoupons } from "@/store/thunks/couponThunks";
import { toast } from "react-toastify";
import { clearError, clearMessage } from "@/store/slices/orderSlice";
import { useNavigate } from "react-router-dom";
import Loader from "@/components/loader/Loader";
import { getFullMenu } from "@/store/thunks/menuThunks";

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { sidebar, pagination } = useAppSelector((state) => state.users);
  const { pagination: menuPagination } = useAppSelector((state) => state.menu);
  const { allOrders, loading, monthlySales, error, message, pendingOrders } =
    useAppSelector((state) => state.orders);
  const paginationDetails = pagination as paginationInfo;
  const { allCoupons } = useAppSelector((state) => state.coupon);
  const activeCoupons = allCoupons.filter((coupon) => coupon.active);
  const inactiveCoupons = allCoupons.filter((coupon) => !coupon.active);
  const allOrdersData = allOrders as orderInfo[];
  const dougnutData: number[] = [activeCoupons.length, inactiveCoupons.length];

  useEffect(() => {
    dispatch(getAllOrders({ page: 1, limit: 10 }));
    dispatch(getAllUsers({}));
    dispatch(getAllCoupons({}));
    dispatch(getMonthlySales());
  }, [dispatch]);
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
    if (message) {
      toast.success(message);
      dispatch(clearMessage());
    }
    dispatch(getFullMenu({ page: 1, limit: 20 }));
  }, [dispatch, error, message]);

  const handlePaymentStatus = async ({
    id,
    value,
  }: {
    id: string;
    value: string;
  }) => {
    try {
      await dispatch(
        updateOrder({
          id,
          field: "paymentStatus",
          value,
        })
      ).unwrap();

      dispatch(getAllOrders({ page: 1, limit: 10 }));
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };
  const handleOrderStatus = async ({
    id,
    value,
  }: {
    id: string;
    value: string;
  }) => {
    try {
      await dispatch(
        updateOrder({
          id,
          field: "status",
          value,
        })
      ).unwrap();

      dispatch(getAllOrders({ page: 1, limit: 10 }));
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="flex">
            <section className={`${sidebar ? "w-16" : "w-80"}`}>
              <Sidebar />
            </section>
            <section className="flex-1 p-2 overflow-hidden">
              <div>
                <h1 className="text-xl font-bold md:text-3xl text-slate-700">
                  Dashboard
                </h1>
              </div>
              <div className="flex flex-wrap justify-center gap-5 pb-5 border-b border-slate-100">
                <div
                  onClick={() => navigate("/allorders")}
                  className="flex flex-col items-center justify-center w-32 h-24 rounded-lg cursor-pointer md:h-36 md:w-60 bg-slate-100"
                >
                  <h1 className="text-3xl font-bold md:text-5xl text-amber-500">
                    {pendingOrders}
                  </h1>
                  <p className="font-semibold md:text-xl">Orders</p>
                </div>
                <div
                  onClick={() => navigate("/fullmenu")}
                  className="flex flex-col items-center justify-center w-32 h-24 rounded-lg cursor-pointer md:h-36 md:w-60 bg-slate-100"
                >
                  <h1 className="text-3xl font-bold text-blue-500 md:text-5xl">
                    {menuPagination?.totalDocuments}
                  </h1>
                  <p className="font-semibold md:text-xl">Menu</p>
                </div>
                <div
                  onClick={() => navigate("/allcoupons")}
                  className="flex flex-col items-center justify-center w-32 h-24 rounded-lg cursor-pointer md:h-36 md:w-60 bg-slate-100"
                >
                  <h1 className="text-3xl font-bold text-green-500 md:text-5xl">
                    {allCoupons?.length}
                  </h1>
                  <p className="font-semibold md:text-xl">Coupons</p>
                </div>
                <div
                  onClick={() => navigate("/allusers")}
                  className="flex flex-col items-center justify-center w-32 h-24 rounded-lg cursor-pointer md:h-36 md:w-60 bg-slate-100"
                >
                  <h1 className="text-3xl font-bold text-purple-500 md:text-5xl">
                    {paginationDetails?.totalDocuments}
                  </h1>
                  <p className="font-semibold md:text-xl">Users</p>
                </div>
              </div>
              <div className="mt-5 md:h-[30rem] md:flex">
                <div className="md:w-[70%] md:h-full">
                  <h1 className="text-xl font-bold md:text-3xl text-slate-700">
                    Monthly Sales
                  </h1>
                  <div className="md:w-full md:h-[90%]">
                    <LineChart salesData={monthlySales} />
                  </div>
                </div>
                <div className="mt-5 md:mt-0 md:w-[30%] md:h-full">
                  <h1 className="text-xl font-bold md:text-3xl text-slate-700">
                    Coupons
                  </h1>
                  <div className="md:flex md:items-center md:justify-center md:w-full md:h-[80%]">
                    <Dougnut_Chart data={dougnutData} />
                  </div>
                </div>
              </div>

              <div>
                <h1 className="text-xl font-bold md:text-3xl text-slate-700">
                  Orders
                </h1>

                <div className="w-full overflow-auto">
                  <table className="w-full mt-5 text-sm text-left text-gray-500 rtl:text-right dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                      <tr>
                        <th scope="col" className="px-6 py-3">
                          Customer Name
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Items
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Total Amount
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Payment Method
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Payment Status
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Order Status
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Phone
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Address
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {allOrdersData?.map((order, index) => (
                        <tr
                          key={index}
                          className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                        >
                          <td className="py-4 ">
                            {order?.user?.name
                              ? `${order?.user?.name}`
                              : "Unnamed Order"}
                          </td>

                          <td className="py-4">
                            {order?.items?.map((item, index) => (
                              <p key={index}>
                                {item.quantity} X {item?.item?.name}
                              </p>
                            ))}
                          </td>
                          <td className="py-4">{order?.totalAmount}</td>
                          <td className="py-4">{order?.paymentMethod}</td>
                          <td className="py-4">
                            <select
                              className={`p-1 ${
                                order?.paymentStatus === "pending"
                                  ? "text-amber-500"
                                  : order?.paymentStatus === "paid"
                                  ? "text-green-500"
                                  : order?.paymentStatus === "failed"
                                  ? "text-primary"
                                  : ""
                              } rounded bg-slate-200`}
                              value={order?.paymentStatus}
                              onChange={(e) =>
                                handlePaymentStatus({
                                  id: order._id!,
                                  value: e.target.value,
                                })
                              }
                              name=""
                              id=""
                            >
                              <option
                                className="text-amber-600"
                                value="pending"
                              >
                                Pending
                              </option>
                              <option className="text-green-500" value="paid">
                                Paid
                              </option>
                              <option className="text-primary" value="failed">
                                Failed
                              </option>
                            </select>
                          </td>
                          <td className="py-4">
                            <select
                              className={`p-1 ${
                                order?.status === "pending"
                                  ? "text-amber-500"
                                  : order?.status === "processing"
                                  ? "text-blue-500"
                                  : order?.status === "shipped"
                                  ? "text-purple-500"
                                  : order?.status === "delivered"
                                  ? "text-green-500"
                                  : order?.status === "cancelled"
                                  ? "text-primary"
                                  : ""
                              } rounded bg-slate-200`}
                              value={order?.status}
                              onChange={(e) =>
                                handleOrderStatus({
                                  id: order._id!,
                                  value: e.target.value,
                                })
                              }
                              name=""
                              id=""
                            >
                              {" "}
                              <option
                                className="text-amber-500"
                                value="pending"
                              >
                                Pending
                              </option>
                              <option
                                className="text-blue-500"
                                value="processing"
                              >
                                Processing
                              </option>
                              <option
                                className="text-purple-500"
                                value="shipped"
                              >
                                Shipped
                              </option>
                              <option
                                className="text-green-500"
                                value="delivered"
                              >
                                Delivered
                              </option>
                              <option
                                className="text-primary"
                                value="cancelled"
                              >
                                Cancelled
                              </option>
                            </select>
                          </td>
                          <td className="py-4">{order?.phone}</td>
                          <td className="py-4">{order?.address}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          </div>
        </>
      )}
    </>
  );
};

export default Dashboard;
