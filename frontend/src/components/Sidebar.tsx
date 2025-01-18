import { LazyLoadImage } from "react-lazy-load-image-component";
import fourLogo from "../Assets/fourlogo.png";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Home,
  Pizza,
  Users,
  ChevronsUpDown,
  Plus,
  AlignLeft,
  ListOrdered,
  BadgeDollarSign,
  ExternalLink,
  Menu,
  CircleUser,
  Puzzle,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "./ui/button";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { userInfo } from "@/types/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logout } from "@/store/thunks/userThunks";
import { toggleSidebar } from "@/store/slices/userSlice";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createCoupon } from "@/store/thunks/couponThunks";
import { toast } from "react-toastify";
import { clearMessage } from "@/store/slices/couponSlice";

const Sidebar = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user, sidebar } = useAppSelector((state) => state.users);
  const { error, message, loading } = useAppSelector((state) => state.coupon);
  const userDetails = user as userInfo;
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1500);
  const [isOpen, setIsOpen] = useState(false);
  const [couponData, setCouponData] = useState({
    code: "",
    discount: 0,
    expiryDate: "",
    active: false,
  });

  const couponChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setCouponData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const couponSubmit = () => {
    dispatch(createCoupon(couponData));
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleSidebar = () => {
    if (!isMobile) {
      dispatch(toggleSidebar());
    }
  };

  useEffect(() => {
    const handleResize = () => {
      const isNowMobile = window.innerWidth <= 1500;
      setIsMobile(isNowMobile);

      if (isNowMobile && !sidebar) {
        dispatch(toggleSidebar());
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [dispatch, sidebar]);
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
    <div
      className={`fixed flex flex-col justify-between h-screen ${
        sidebar ? "w-16" : "w-80"
      } bg-slate-100 transition-all duration-300`}
    >
      <div>
        <div
          className={`flex items-center ${
            sidebar ? "justify-center" : "justify-between"
          }  p-2`}
        >
          <LazyLoadImage
            onClick={() => navigate("/")}
            src={fourLogo}
            className={`transition-all cursor-pointer duration-300 ${
              sidebar ? "hidden" : "block"
            }`}
          />
          <Menu onClick={handleSidebar} className="w-6 h-6 cursor-pointer" />
        </div>

        <div className="p-2">
          <nav>
            <ul className="flex flex-col gap-2">
              <li>
                <NavLink
                  className={`flex ${
                    sidebar ? "justify-center" : ""
                  } items-center gap-2 p-2 rounded group bg-slate-200`}
                  to={"/dashboard"}
                >
                  <Home className="text-blue-500 group-hover:animate-rotate" />
                  {!sidebar && <span>Home</span>}
                </NavLink>
              </li>

              {!sidebar && (
                <li>
                  <Collapsible
                    open={isOpen}
                    onOpenChange={setIsOpen}
                    className="w-full space-y-2"
                  >
                    <div className="flex items-center justify-between p-2 space-x-4 rounded group bg-slate-200">
                      <h4 className="flex items-center gap-2">
                        <Pizza className="text-amber-400 group-hover:animate-rotate" />
                        {!sidebar && <span>Menu</span>}
                      </h4>
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <ChevronsUpDown className="w-4 h-4" />
                          <span className="sr-only">Toggle</span>
                        </Button>
                      </CollapsibleTrigger>
                    </div>

                    <CollapsibleContent className="flex flex-col items-end space-y-2">
                      <NavLink
                        className="flex group w-[90%] items-center gap-2 p-2 rounded bg-slate-200"
                        to={"/newmenuitem"}
                      >
                        <Plus className="text-green-500 group-hover:animate-rotate" />
                        Add Menu Item
                      </NavLink>
                      <NavLink
                        className="flex w-[90%] items-center group gap-2 p-2 rounded bg-slate-200"
                        to={"/fullmenu"}
                      >
                        <AlignLeft className="text-pink-500 group-hover:animate-rotate" />
                        All Menu Items
                      </NavLink>
                    </CollapsibleContent>
                  </Collapsible>
                </li>
              )}

              {/* Orders */}
              {sidebar && (
                <>
                  {" "}
                  <li>
                    <NavLink
                      className={`flex ${
                        sidebar ? "justify-center" : ""
                      } items-center gap-2 p-2 rounded group bg-slate-200`}
                      to={"/fullmenu"}
                    >
                      <AlignLeft className="text-pink-500 group-hover:animate-rotate" />
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      className={`flex ${
                        sidebar ? "justify-center" : ""
                      } items-center gap-2 p-2 rounded group bg-slate-200`}
                      to={"/newmenuitem"}
                    >
                      <Plus className="text-green-500 group-hover:animate-rotate" />
                    </NavLink>
                  </li>
                </>
              )}
              <li>
                <NavLink
                  className={`flex ${
                    sidebar ? "justify-center" : ""
                  } items-center gap-2 p-2 rounded group bg-slate-200`}
                  to={"/allorders"}
                >
                  <ListOrdered className="text-orange-500 group-hover:animate-rotate" />
                  {!sidebar && <span>Orders</span>}
                </NavLink>
              </li>

              {/* Coupons */}
              <li>
                <NavLink
                  className={`flex ${
                    sidebar ? "justify-center" : ""
                  } items-center gap-2 p-2 rounded group bg-slate-200`}
                  to={"/allcoupons"}
                >
                  <BadgeDollarSign className="text-purple-500 group-hover:animate-rotate" />
                  {!sidebar && <span>Coupons</span>}
                </NavLink>
              </li>

              {/* Users */}
              <li>
                <Dialog>
                  <DialogTrigger asChild>
                    <button
                      className={`flex w-full ${
                        sidebar ? "justify-center" : ""
                      } items-center gap-2 p-2 rounded group bg-slate-200`}
                    >
                      <Puzzle className="text-green-500 group-hover:animate-rotate" />{" "}
                      {!sidebar && <span>Add Coupon</span>}
                    </button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Coupon</DialogTitle>
                      <DialogDescription>Add New Coupon Here</DialogDescription>
                    </DialogHeader>
                    <form className="flex flex-col gap-5" action="">
                      <div className="flex flex-col">
                        <label htmlFor="code">Coupon Code</label>
                        <input
                          type="text"
                          name="code"
                          value={couponData.code}
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
                          value={couponData.discount}
                          onChange={couponChange}
                          className="p-1 rounded [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none border-2 outline-primary border-slate-300"
                          placeholder="Enter Discount Percentage%"
                        />
                      </div>

                      <div className="flex flex-col">
                        <label htmlFor="expiryDate">Expire On</label>
                        <input
                          type="date"
                          name="expiryDate"
                          value={couponData.expiryDate}
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
                          checked={couponData.active}
                          className="w-10"
                          placeholder="Enter The Coupon Code Here"
                        />
                      </div>
                      <span
                        onClick={couponSubmit}
                        className="flex items-center justify-center w-full h-12 gap-2 p-2 font-semibold text-white rounded bg-primary"
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
                            <span className="sr-only">Loading...</span>
                          </div>
                        ) : (
                          "Create Coupon"
                        )}
                      </span>
                    </form>
                    <DialogFooter></DialogFooter>
                  </DialogContent>
                </Dialog>
              </li>
              <li>
                <NavLink
                  className={`flex ${
                    sidebar ? "justify-center" : ""
                  } items-center gap-2 p-2 rounded group bg-slate-200`}
                  to={"/allusers"}
                >
                  <Users className="text-primary group-hover:animate-rotate" />
                  {!sidebar && <span>Users</span>}
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Sidebar Footer */}
      <div
        className={`flex p-4 items-center bg-slate-200 ${
          sidebar ? "flex-row-reverse justify-center" : "justify-between"
        }`}
      >
        <div>
          {!sidebar && (
            <>
              <h1>{userDetails?.name}</h1>
              <p className="text-xs">{userDetails?.email}</p>
            </>
          )}
        </div>
        <div className="flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center justify-center p-2 transition-all duration-200 rounded hover:bg-[#fdf9f9]">
                {sidebar ? (
                  <CircleUser />
                ) : (
                  <ChevronsUpDown className="w-4 h-4" />
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>{userDetails?.name}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                Log out
                <DropdownMenuShortcut>
                  <ExternalLink className="w-4 h-4" />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
