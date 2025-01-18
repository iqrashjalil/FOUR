import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { useAppSelector, useAppDispatch } from "@/store/store";
import { addNewMenuItem } from "@/store/thunks/menuThunks";
import { menuItem } from "@/types/types";
import { toast } from "react-toastify";
import { clearError, clearMessage } from "@/store/slices/menuSlice";

const New_Menu = () => {
  const dispatch = useAppDispatch();
  const { sidebar } = useAppSelector((state) => state.users);
  const { message, error, loading } = useAppSelector((state) => state.menu);
  const categories = [
    "pizza",
    "burger",
    "dessert",
    "shake",
    "fries",
    "wings",
    "drinks",
    "soft drinks",
  ];

  const [formData, setFormData] = useState<menuItem>({
    name: "",
    description: "",
    price: 0,
    category: "",
    image: null,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      setFormData((prevData) => ({
        ...prevData,
        image: files[0],
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formDataToSend = new FormData();

    formDataToSend.append("name", formData.name);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("price", formData.price.toString());
    formDataToSend.append("category", formData.category);

    if (formData.image) {
      formDataToSend.append("image", formData.image);
    }
    console.log(formDataToSend);

    dispatch(addNewMenuItem(formDataToSend));

    setFormData({
      name: "",
      description: "",
      price: 0,
      category: "",
      image: null,
    });
  };

  useEffect(() => {
    if (message) {
      toast.success(message);
      dispatch(clearMessage());
    }
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [dispatch, error, message]);
  return (
    <div className="flex">
      <section className={`${sidebar ? "w-16" : "w-80"}`}>
        <Sidebar />
      </section>
      <section className="flex flex-col items-center justify-center flex-1 h-screen p-2">
        <div className="flex flex-col items-center w-full">
          <h1 className="text-xl font-bold md:text-3xl text-slate-700">
            Add New Menu Item
          </h1>
        </div>
        <div className="p-2 md:p-5 rounded md:w-[30rem] bg-slate-100">
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 bg-transparent border-2 rounded border-slate-300 outline-primary"
                placeholder="Enter Menu Item Name"
              />
            </div>
            <div className="mt-5">
              <label htmlFor="description">Description</label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-2 bg-transparent border-2 rounded border-slate-300 outline-primary"
                placeholder="Enter Description"
              />
            </div>
            <div className="mt-5">
              <label htmlFor="price">Price</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full p-2 bg-transparent border-2 rounded border-slate-300 outline-primary"
                placeholder="Enter Price"
              />
            </div>
            <div className="flex flex-col mt-5">
              <label htmlFor="category">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full p-2 capitalize bg-transparent border-2 rounded border-slate-300 outline-primary"
              >
                <option value="">Select Category</option>
                {categories.map((category, index) => (
                  <option value={category} key={index}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div className="mt-5">
              <label htmlFor="image">Image</label>
              <div className="flex gap-[5%]">
                {" "}
                <div
                  className={`flex items-center justify-center ${
                    formData.image === null ? "w-full" : "w-[55%]"
                  } `}
                >
                  <label
                    htmlFor="dropzone-file"
                    className="flex items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer 64 flex- bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg
                        className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 20 16"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                        />
                      </svg>
                      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-semibold">Click to upload</span>{" "}
                        or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        SVG, PNG, JPG or GIF (MAX. 800x400px)
                      </p>
                    </div>
                    <input
                      name="image"
                      onChange={handleFileChange}
                      id="dropzone-file"
                      type="file"
                      className="hidden"
                    />
                  </label>
                </div>
                {formData.image && (
                  <div className="flex items-center justify-center h-40 w-[40%] rounded-lg">
                    <img
                      src={
                        formData.image instanceof File
                          ? URL.createObjectURL(formData.image)
                          : ""
                      }
                      alt="Preview"
                      className="object-cover max-w-full max-h-full rounded-md"
                    />
                  </div>
                )}
              </div>
            </div>
            <button className="w-full h-12 p-2 mt-5 font-semibold text-white rounded bg-primary">
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
                "Add Item"
              )}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default New_Menu;
