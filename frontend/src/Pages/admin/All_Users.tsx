import Sidebar from "@/components/Sidebar";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { paginationInfo, userInfo } from "@/types/types";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useEffect } from "react";
import { getAllUsers } from "@/store/thunks/userThunks";
import Loader from "@/components/loader/Loader";

const All_Users = () => {
  const dispatch = useAppDispatch();
  const {
    pagination: paginationDetails,
    sidebar,
    loading,
    allUsers,
  } = useAppSelector((state) => state.users);
  const allUsersData = allUsers as userInfo[];
  const pagination = paginationDetails as paginationInfo;
  useEffect(() => {
    dispatch(getAllUsers({ page: 1, limit: 20 }));
  }, [dispatch]);

  const handlePageChange = (page: number) => {
    dispatch(getAllUsers({ page, limit: 20 }));
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
                  Users Record
                </h1>

                <div className="w-full overflow-auto">
                  <table className="w-full mt-5 text-sm text-left text-gray-500 rtl:text-right dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                      <tr>
                        <th scope="col" className="px-6 py-3">
                          Name
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Email
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Role
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
                      {allUsersData?.map((user, index) => (
                        <tr
                          key={index}
                          className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                        >
                          <td className="py-4 ">{user?.name}</td>

                          <td className="py-4">{user?.email}</td>
                          <td className="py-4">
                            <span
                              className={`${
                                user?.role === "admin"
                                  ? "dark:bg-green-900 bg-green-100 dark:text-green-300 text-green-800"
                                  : "dark:bg-red-900 bg-red-100 dark:text-red-300 text-red-800"
                              } text-xs font-medium me-2 px-2.5 py-0.5 rounded `}
                            >
                              {user?.role}
                            </span>
                          </td>
                          <td className="py-4">{user?.phone}</td>
                          <td className="py-4">{user?.address}</td>
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

export default All_Users;
