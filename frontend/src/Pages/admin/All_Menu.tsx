import Sidebar from "@/components/Sidebar";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { deleteMenuItem, getFullMenu } from "@/store/thunks/menuThunks";
import { paginationInfo } from "@/types/types";
import { useEffect } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { serverUrl } from "@/serverUrl";
import { Delete, Edit } from "lucide-react";
import { toast } from "react-toastify";
import { clearMessage } from "@/store/slices/menuSlice";
import { useNavigate } from "react-router-dom";
import Loader from "@/components/loader/Loader";

const All_Menu = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { sidebar } = useAppSelector((state) => state.users);
  const {
    pagination: paginationDetail,
    fullMenu,
    error,
    message,
    loading,
  } = useAppSelector((state) => state.menu);
  const pagination = paginationDetail as paginationInfo;
  const handlePageChange = (page: number) => {
    dispatch(getFullMenu({ page, limit: 20 }));
  };

  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteMenuItem(id)).unwrap();
      dispatch(getFullMenu({ page: 1, limit: 20 }));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    dispatch(getFullMenu({ page: 1, limit: 20 }));
  }, [dispatch]);
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
    if (message) {
      toast.success(message);
      dispatch(clearMessage());
    }
  }, [dispatch, error, message]);
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
                  Entire Menu
                </h1>

                <div className="w-full overflow-auto">
                  <table className="w-full mt-5 text-sm text-left text-gray-500 rtl:text-right dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                      <tr>
                        <th scope="col" className="px-6 py-3">
                          Image
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Name
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Description
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Price
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Category
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Available
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {fullMenu?.map((item, index) => (
                        <tr
                          key={index}
                          className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                        >
                          <td className="py-4 ">
                            <LazyLoadImage
                              className="w-10 h-10 rounded-full"
                              src={`${serverUrl}/${item?.image}`}
                            />
                          </td>

                          <td className="py-4 ">{item?.name}</td>
                          <td className="py-4 ">{item?.description}</td>
                          <td className="py-4">
                            <span className="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                              Rs: {item?.price}
                            </span>
                          </td>
                          <td className="py-4 ">{item?.category}</td>
                          <td className="py-4">
                            <span
                              className={`${
                                item?.available
                                  ? "dark:bg-green-900 bg-green-100 dark:text-green-300 text-green-800"
                                  : "dark:bg-red-900 bg-red-100 dark:text-red-300 text-red-800"
                              } text-xs font-medium me-2 px-2.5 py-0.5 rounded `}
                            >
                              {item?.available ? "Available" : "Not Available"}
                            </span>
                          </td>
                          <td className="flex gap-2 py-4">
                            <button
                              onClick={() => handleDelete(item._id!)}
                              className="flex items-center gap-1 p-2 font-semibold text-white rounded bg-primary"
                            >
                              Delete <Delete size={20} />
                            </button>
                            <button
                              onClick={() =>
                                navigate(`/editmenuitem/${item._id}`)
                              }
                              className="flex items-center gap-1 p-2 font-semibold text-white bg-blue-500 rounded"
                            >
                              Edit <Edit className="" size={16} />
                            </button>
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

export default All_Menu;
