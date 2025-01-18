import { tryCatch } from "../middlewares/Error-Middleware";
import Coupon from "../models/Coupon-Model";
import { ErrorHandler } from "../utils/Error-Handler";

// Creat Coupon (Admin Only)
const createCoupon = tryCatch(async (req, res, next) => {
  const { code, discount, expiryDate } = req.body;
  if (!code || !discount || !expiryDate) {
    return next(new ErrorHandler("All Fields Required", 400));
  }
  const couponExist = await Coupon.findOne({ code });
  if (couponExist) {
    return next(new ErrorHandler("Coupon Code Already Exists", 400));
  }
  const createdCoupon = await Coupon.create({
    code,
    discount,
    expiryDate,
  });

  res.status(201).json({
    success: true,
    message: `Coupon Code with coupon code: ${createdCoupon.code} created`,
  });
});

// Get All Coupons (Admin Only)
const getAllCoupons = tryCatch(async (req, res, next) => {
  const { page, limit } = req.query;

  const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

  const getAllCoupons = await Coupon.find()
    .skip(skip)
    .sort({ createdAt: -1 })
    .limit(parseInt(limit as string));
  const totalDocuments = await Coupon.countDocuments();
  res.status(200).json({
    success: true,
    coupons: getAllCoupons,
    pagination: {
      totalDocuments,
      currentPage: parseInt(page as string),
      totalPages: Math.ceil(totalDocuments / parseInt(limit as string)),
    },
  });
});

// Get Single Coupon
const fetchCoupon = tryCatch(async (req, res, next) => {
  const { code } = req.query;
  const coupon = await Coupon.findOne({ code });
  if (!coupon) {
    return next(new ErrorHandler("Coupon Not Found", 400));
  }
  if (new Date(coupon.expiryDate).getTime() < Date.now()) {
    return next(new ErrorHandler("Coupon Expired", 400));
  }
  if (coupon.active === false) {
    return next(new ErrorHandler("Coupon Inactive", 400));
  }
  res.status(200).json({ success: true, coupon: coupon });
});
// Update Coupon (Admin Only)
const updateCoupon = tryCatch(async (req, res, next) => {
  const { id } = req.params;
  const { code } = req.body;
  const couponExist = await Coupon.findOne({ code });

  const coupon = await Coupon.findById(id);
  if (coupon?.code === code) {
    const updatedCoupon = await Coupon.findByIdAndUpdate(id, req.body, {
      new: true,
    });
  } else if (couponExist) {
    return next(new ErrorHandler("Coupon Code Already Exists", 400));
  } else {
    const updatedCoupon = await Coupon.findByIdAndUpdate(id, req.body, {
      new: true,
    });
  }
  res
    .status(200)
    .json({ success: true, message: "Coupon Updated Successfully" });
});

// Delete Coupon (Admin Only)
const deleteCoupon = tryCatch(async (req, res, next) => {
  const { id } = req.params;
  const deletedCoupon = await Coupon.findByIdAndDelete(id);
  if (!deletedCoupon) {
    return next(new ErrorHandler("Coupon Not Found", 404));
  }
  res.status(200).json({
    success: true,
    message: `Coupon ${deletedCoupon.code} Deleted Successfully`,
  });
});

// Get Coupon Details (Admin Only)

const getCouponDetails = tryCatch(async (req, res, next) => {
  const { id } = req.params;
  const coupon = await Coupon.findById(id);
  if (!coupon) {
    return next(new ErrorHandler("Coupon Not Found", 404));
  }
  res.status(200).json({ success: true, coupon: coupon });
});

export default {
  createCoupon,
  getAllCoupons,
  updateCoupon,
  deleteCoupon,
  fetchCoupon,
  getCouponDetails,
};
