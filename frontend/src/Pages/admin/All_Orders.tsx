import { clearError, clearMessage } from "@/store/slices/orderSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { getAllOrders, updateOrder } from "@/store/thunks/orderThunks";
import { orderInfo, paginationInfo } from "@/types/types";
import Sidebar from "../../components/Sidebar";
import { useEffect } from "react";
import { toast } from "react-toastify";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import Loader from "@/components/loader/Loader";

const All_Orders = () => {
  const dispatch = useAppDispatch();
  const { sidebar } = useAppSelector((state) => state.users);
  const {
    allOrders,
    pagination: paginationDetails,
    message,
    error,
    loading,
  } = useAppSelector((state) => state.orders);
  const allOrdersData = allOrders as orderInfo[];
  const pagination = paginationDetails as paginationInfo;
  useEffect(() => {
    dispatch(getAllOrders({ page: 1, limit: 20 }));
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
  }, [dispatch, error, message]);

  const handlePageChange = (page: number) => {
    dispatch(getAllOrders({ page, limit: 20 }));
  };

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
      dispatch(getAllOrders({ page: pagination.currentPage, limit: 20 }));
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
      dispatch(getAllOrders({ page: pagination.currentPage, limit: 20 }));
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
                  All Orders Data
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
                                <span className="font-semibold text-primary">
                                  {" "}
                                  {item.quantity}
                                </span>{" "}
                                X {item?.item?.name}
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
              {pagination?.totalPages > 1 && (
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        className={`cursor-pointer ${
                          pagination?.currentPage === 1 ? "hidden" : "flex"
                        }`}
                        onClick={() =>
                          handlePageChange(
                            Math.max(1, pagination?.currentPage - 1)
                          )
                        }
                      />
                    </PaginationItem>
                    {Array.from(
                      { length: pagination?.totalPages },
                      (_, index) => (
                        <PaginationItem className="cursor-pointer" key={index}>
                          <PaginationLink
                            isActive={pagination.currentPage === index + 1}
                            onClick={() => handlePageChange(index + 1)}
                          >
                            {index + 1}
                          </PaginationLink>
                        </PaginationItem>
                      )
                    )}
                    <PaginationItem>
                      <PaginationNext
                        className={`cursor-pointer ${
                          pagination?.currentPage === pagination?.totalPages
                            ? "hidden"
                            : "flex"
                        }`}
                        onClick={() =>
                          handlePageChange(
                            Math.min(
                              pagination.totalDocuments,
                              pagination.currentPage + 1
                            )
                          )
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </section>
          </div>
        </>
      )}
    </>
  );
};

export default All_Orders;
