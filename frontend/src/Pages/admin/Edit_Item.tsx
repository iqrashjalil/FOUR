import { serverUrl } from "@/serverUrl";
import { useAppSelector, useAppDispatch } from "@/store/store";
import { getMenuDetail, updateMenuItem } from "@/store/thunks/menuThunks";
import { menuItem } from "@/types/types";
import Sidebar from "../../components/Sidebar";
import React, { useEffect, useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "@/components/loader/Loader";
import { clearError, clearMessage } from "@/store/slices/menuSlice";

const Edit_Item = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { sidebar } = useAppSelector((state) => state.users);
  const { menuItemDetail, loading, error, message } = useAppSelector(
    (state) => state.menu
  );
  const itemDetail = menuItemDetail as menuItem;

  // Initialize form state
  const [formData, setFormData] = useState<menuItem>({
    name: "",
    description: "",
    price: 0,
    category: "",
    image: null,
  });

  // Sync formData with itemDetail
  useEffect(() => {
    if (itemDetail) {
      setFormData({
        name: itemDetail.name,
        description: itemDetail.description,
        price: itemDetail.price,
        category: itemDetail.category,
        image: null,
      });
    }
  }, [itemDetail]);

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle file change for image upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files; // Access files once
    if (files && files[0]) {
      setFormData((prevData) => ({
        ...prevData,
        image: files[0], // Assert that files[0] exists
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Dispatch the updateMenuItem action
    e.preventDefault();

    const updatedData = new FormData();

    // Append the form data
    updatedData.append("name", formData.name);
    updatedData.append("description", formData.description);
    updatedData.append("price", formData.price.toString());
    updatedData.append("category", formData.category);

    // Append the image if it exists
    if (formData.image) {
      updatedData.append("image", formData.image);
    }
    console.log(updatedData);

    try {
      if (!id) {
        console.error("Item ID is undefined");
        return;
      }

      await dispatch(updateMenuItem({ id, updatedData })).unwrap();
    } catch (error) {
      console.error("Error updating menu item:", error);
    }
  };
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

  useEffect(() => {
    dispatch(getMenuDetail(id!));
  }, [dispatch, id]);

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
            <section className="flex flex-col items-center justify-center flex-1 h-screen p-2">
              <div className="flex flex-col items-center w-full ">
                <h1 className="text-xl font-bold md:text-3xl text-slate-700">
                  Edit Menu Item
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
                      <div
                        className={`flex items-center justify-center ${
                          formData.image === null ? "w-full" : "w-[55%]"
                        }`}
                      >
                        <label
                          htmlFor="dropzone-file"
                          className="flex items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                        >
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                              <span className="font-semibold">
                                Click to upload
                              </span>{" "}
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
                      </div>{" "}
                      <div className="flex items-center justify-center h-40 w-[40%] rounded-lg">
                        {formData.image ? (
                          <img
                            src={
                              formData.image instanceof File
                                ? URL.createObjectURL(formData.image)
                                : formData.image
                            }
                            alt="Preview"
                            className="object-cover max-w-full max-h-full rounded-md"
                          />
                        ) : (
                          <LazyLoadImage
                            className="object-cover max-w-full max-h-full rounded-md"
                            src={`${serverUrl}/${itemDetail?.image}`}
                          />
                        )}{" "}
                      </div>
                    </div>
                  </div>
                  <button className="w-full p-2 mt-5 text-white rounded bg-primary">
                    Update Item
                  </button>
                </form>
              </div>
            </section>
          </div>
        </>
      )}
    </>
  );
};

export default Edit_Item;
