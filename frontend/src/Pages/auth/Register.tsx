import { useEffect, useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import logo from "../../Assets/fournew.png";
import { register } from "@/store/thunks/userThunks";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { registerInterface } from "@/types/types";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { clearError, clearMessage } from "@/store/slices/userSlice";

const Register = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, message, error } = useAppSelector((state) => state.users);
  const [formData, setFormData] = useState<registerInterface>({
    name: "",
    email: "",
    password: "",
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(register(formData));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
    if (message) {
      navigate("/login");
      dispatch(clearMessage());
    }
  }, [dispatch, error, navigate, message]);

  return (
    <div className="flex w-full p-2 md:p-0">
      <div className="md:w-[60%] w-full h-[85vh] flex justify-center items-center">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col md:items-center">
            <h1 className="text-xl font-extrabold md:text-3xl text-slate-600">
              Hello! Feeling
              <span className="text-5xl font-extrabold md:text-5xl text-primary">
                Hungry
              </span>
              <span className="text-5xl">?</span>
            </h1>
            <p className="font-extrabold md:text-xl text-slate-600">
              <span className="text-primary"> Hurry Up!</span> Sign Up And enjoy
            </p>
          </div>
          <div className="flex flex-col">
            <label className="text-slate-700" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="p-2 transition-all duration-200 border-2 rounded outline-none focus:border-primary"
              required
            />
          </div>
          <div className="flex flex-col">
            <label className="text-slate-700" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="p-2 transition-all duration-200 border-2 rounded outline-none focus:border-primary"
              required
            />
          </div>
          <div className="flex flex-col">
            <label className="text-slate-700" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="p-2 transition-all duration-200 border-2 rounded outline-none focus:border-primary"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full h-12 hover:bg-[#c03737] hover:border-[#c03737] p-2 mt-5 font-bold text-white transition-all duration-200 border-2 rounded border-primary bg-primary"
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
              "Register"
            )}
          </button>
          <p className="text-gray-400">
            Already Have An Account?
            <NavLink
              className="font-bold text-primary hover:underline"
              to={"/login"}
            >
              Sign In
            </NavLink>
          </p>
        </form>
      </div>
      <div className="md:flex hidden items-center justify-center w-[40%] h-screen bg-primary">
        <LazyLoadImage className="w-[30rem]" src={logo} />
      </div>
    </div>
  );
};

export default Register;
