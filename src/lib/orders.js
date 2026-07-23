import { connectDB } from "@/lib/mongodb";
import Counter from "@/models/Counter";
import Order from "@/models/Order";
import User from "@/models/User";
import Product from "@/models/Product";

export async function createOrder(data) {
  await connectDB();

  const counter = await Counter.findOneAndUpdate(
    { name: "orderNumber" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  return Order.create({
    orderNumber: counter.seq,
    userId: data.userId,
    items: data.items,
    total: data.total,
    shippingAddress: data.shippingAddress,
    contactPhone: data.contactPhone,
    contactEmail: data.contactEmail,
    notes: data.notes || "",
  });
}

export async function getOrders() {
  await connectDB();
  return Order.find()
    .populate("userId", "name email")
    .sort({ createdAt: -1 })
    .lean();
}

export async function getOrdersByUser(userId) {
  await connectDB();
  return Order.find({ userId }).sort({ createdAt: -1 }).lean();
}

export async function getOrderById(id) {
  await connectDB();
  return Order.findById(id).populate("userId", "name email").lean();
}

export async function getOrderByIdAndUser(orderId, userId) {
  await connectDB();
  return Order.findOne({ _id: orderId, userId })
    .populate("userId", "name email")
    .lean();
}

export async function updateOrderStatus(orderId, status) {
  await connectDB();
  return Order.findByIdAndUpdate(
    orderId,
    { status },
    { new: true, runValidators: true }
  )
    .populate("userId", "name email")
    .lean();
}

export async function getOrdersByMonth() {
  await connectDB();
  const result = await Order.aggregate([
    { $match: { status: { $in: ["Active", "Closed", "Shipped"] } } },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        total: { $sum: "$total" },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ]);

  const months = [
    "Ene", "Feb", "Mar", "Abr", "May", "Jun",
    "Jul", "Ago", "Sep", "Oct", "Nov", "Dic",
  ];

  return result.map((r) => ({
    month: `${months[r._id.month - 1]} ${r._id.year}`,
    ingresos: r.total,
    ordenes: r.count,
  }));
}

export async function getRevenueByStatus() {
  await connectDB();
  const result = await Order.aggregate([
    {
      $group: {
        _id: "$status",
        total: { $sum: "$total" },
        count: { $sum: 1 },
      },
    },
  ]);

  const statusMap = {
    Active: "Activo",
    Closed: "Cerrado",
    Shipped: "Enviado",
    Canceled: "Rechazada",
  };

  return result.map((r) => ({
    name: statusMap[r._id] || r._id,
    value: r.total,
    count: r.count,
  }));
}

export async function getDashboardMetrics() {
  await connectDB();

  const [
    totalOrders,
    totalRevenueResult,
    recentOrders,
    recentUsers,
    lowStockProducts,
    totalUsers,
  ] = await Promise.all([
    Order.countDocuments(),
    Order.aggregate([
      { $match: { status: { $in: ["Active", "Closed", "Shipped"] } } },
      { $group: { _id: null, total: { $sum: "$total" } } },
    ]),
    Order.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 })
      .limit(5)
      .lean(),
    User.find()
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(5)
      .lean(),
    Product.find({ stock: { $lte: 1 } })
      .select("name stock")
      .lean(),
    User.countDocuments(),
  ]);

  return {
    totalOrders,
    totalRevenue: totalRevenueResult[0]?.total || 0,
    recentOrders,
    recentUsers,
    lowStockProducts,
    totalUsers,
  };
}
