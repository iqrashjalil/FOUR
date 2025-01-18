import Sidebar from "@/components/Sidebar";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { couponInfo, paginationInfo } from "@/types/types";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useEffect, useState } from "react";
import {
  deleteCoupon,
  getAllCoupons,
  getCouponDetails,
  updateCoupon,
} from "@/store/thunks/couponThunks";
import { Delete, Edit } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Loader from "@/components/loader/Loader";

const All_Coupons = () => {
  const dispatch = useAppDispatch();
  const {
    pagination: paginationDetails,
    allCoupons,
    couponDetail,
    loading,
  } = useAppSelector((state) => state.coupon);
  const { sidebar } = useAppSelector((state) => state.users);
  const couponDetails = couponDetail as unknown as couponInfo;
  const allCouponsData = allCoupons as couponInfo[];
  const pagination = paginationDetails as paginationInfo;

  const formatDate = (date: Date | string) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toISOString().slice(0, 10);
  };
  const [couponEdit, setCouponEdit] = useState<couponInfo>({
    code: "",
    discount: 0,
    expiryDate: "",
    active: false,
  });
  useEffect(() => {
    setCouponEdit({
      code: couponDetails?.code || "",
      discount: couponDetails?.discount || 0,
      expiryDate: formatDate(couponDetails?.expiryDate) || "",
      active: couponDetails?.active || false,
    });
  }, [couponDetails]);

  const couponChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setCouponEdit((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const updateCouponHandler = async (id: string) => {
    try {
      await dispatch(updateCoupon({ id, couponEdit })).unwrap();
      dispatch(getAllCoupons({ page: 1, limit: 20 }));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    dispatch(getAllCoupons({ page: 1, limit: 20 }));
  }, [dispatch]);

  const handlePageChange = (page: number) => {
    dispatch(getAllCoupons({ page, limit: 20 }));
  };

  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteCoupon(id)).unwrap();
      dispatch(getAllCoupons({ page: 1, limit: 20 }));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          {" "}
          <div className="flex">
            <section className={`${sidebar ? "w-16" : "w-80"}`}>
              <Sidebar />
            </section>
            <section className="flex-1 p-2 overflow-hidden">
              <div>
                <h1 className="text-xl font-bold md:text-3xl text-slate-700">
                  Coupons Record
                </h1>

                <div className="w-full overflow-auto">
                  <table className="w-full mt-5 text-sm text-left text-gray-500 rtl:text-right dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                      <tr>
                        <th scope="col" className="px-6 py-3">
                          Coupon Code
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Discount
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Expiry Date
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Active
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {allCouponsData?.map((coupon, index) => (
                        <tr
                          key={index}
                          className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                        >
                          <td className="py-4 ">{coupon?.code}</td>

                          <td className="py-4">
                            <span className="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                              {coupon?.discount}%
                            </span>
                          </td>
                          <td className="py-4">
                            {coupon?.expiryDate
                              ? new Date(coupon.expiryDate)
                                  .toISOString()
                                  .split("T")[0]
                              : "No expiry date"}
                          </td>
                          <td className="py-4">
                            <span
                              className={`${
                                coupon?.active
                                  ? "dark:bg-green-900 bg-green-100 dark:text-green-300 text-green-800"
                                  : "dark:bg-red-900 bg-red-100 dark:text-red-300 text-red-800"
                              } text-xs font-medium me-2 px-2.5 py-0.5 rounded `}
                            >
                              {coupon?.active ? "Active" : "Not Active"}
                            </span>
                          </td>
                          <td className="flex gap-2 py-4">
                            <button
                              onClick={() => handleDelete(coupon._id!)}
                              className="flex items-center gap-1 p-2 font-semibold text-white rounded bg-primary"
                            >
                              Delete <Delete size={20} />
                            </button>

                            <Dialog>
                              <DialogTrigger asChild>
                                <button
                                  onClick={() =>
                                    dispatch(getCouponDetails(coupon._id!))
                                  }
                                  className="flex items-center gap-1 p-2 font-semibold text-white bg-blue-500 rounded"
                                >
                                  Edit <Edit className="" size={16} />
                                </button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                  <DialogTitle>Edit Coupon</DialogTitle>
                                </DialogHeader>
                                <form className="flex flex-col gap-5" action="">
                                  <div className="flex flex-col">
                                    <label htmlFor="code">Coupon Code</label>
                                    <input
                                      type="text"
                                      name="code"
                                      value={couponEdit.code}
                                      onChange={couponChange}
                                      className="p-1 border-2 rounded outline-primary border-slate-300"
                                      placeholder="Enter The Coupon Code Here"
                                    />
                                  </div>

                                  <div className="flex flex-col">
                                    <label htmlFor="discount">Discount</label>
                                    <input
                                      type="number"
                                      name="discount"
                                      value={couponEdit.discount}
                                      onChange={couponChange}
                                      className="p-1 rounded [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none border-2 outline-primary border-slate-300"
                                      placeholder="Enter Discount Percentage%"
                                    />
                                  </div>

                                  <div className="flex flex-col">
                                    <label htmlFor="expiryDate">
                                      Expire On
                                    </label>
                                    <input
                                      type="date"
                                      name="expiryDate"
                                      value={formatDate(couponEdit.expiryDate)}
                                      onChange={couponChange}
                                      className="p-1 border-2 rounded outline-primary border-slate-300"
                                      placeholder="Enter The Coupon Code Here"
                                    />
                                  </div>

                                  <div className="flex justify-between">
                                    <label htmlFor="active">Active</label>
                                    <input
                                      type="checkbox"
                                      name="active"
                                      onChange={couponChange}
                                      checked={couponEdit.active}
                                      className="w-10"
                                      placeholder="Enter The Coupon Code Here"
                                    />
                                  </div>
                                  <span
                                    onClick={() =>
                                      updateCouponHandler(coupon._id!)
                                    }
                                    className="flex items-center justify-center w-full h-12 p-2 font-semibold text-white rounded bg-primary"
                                  >
                                    {loading ? (
                                      <div role="status">
                                        <svg
                                          aria-hidden="true"
                                          className="inline w-6 h-6 text-white animate-spin dark:text-gray-600 fill-primary"
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
                                        <span className="sr-only">
                                          Loading...
                                        </span>
                                      </div>
                                    ) : (
                                      "Update Coupon"
                                    )}
                                  </span>
                                </form>
                                <DialogFooter></DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </td>
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

export default All_Coupons;
