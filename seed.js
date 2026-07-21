const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");

try { require("dotenv").config(); } catch (_) {}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("Falta la variable MONGODB_URI en el archivo .env");
  process.exit(1);
}

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    description: { type: String, default: "", trim: true },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "", trim: true },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0, default: 0 },
    image: { type: String, default: "", trim: true },
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
    attributes: [
      {
        name: { type: String, required: true, trim: true },
        options: [{ type: String, trim: true }],
      },
    ],
  },
  { timestamps: true }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true },
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  },
  { timestamps: true }
);

const counterSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  seq: { type: Number, default: 0 },
});

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: Number, required: true, unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        name: { type: String, required: true },
        image: { type: String, default: "" },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, min: 1 },
        customizations: { type: mongoose.Schema.Types.Mixed, default: {} },
        subtotal: { type: Number, required: true },
      },
    ],
    total: { type: Number, required: true, min: 0 },
    shippingAddress: { type: String, required: true, trim: true },
    contactPhone: { type: String, required: true, trim: true },
    contactEmail: { type: String, required: true, trim: true, lowercase: true },
    notes: { type: String, default: "", trim: true },
    status: {
      type: String,
      enum: ["Active", "Closed", "Shipped", "Canceled"],
      default: "Active",
    },
  },
  { timestamps: true }
);

const Category = mongoose.models.Category || mongoose.model("Category", categorySchema);
const Product = mongoose.models.Product || mongoose.model("Product", productSchema);
const User = mongoose.models.User || mongoose.model("User", userSchema);
const Counter = mongoose.models.Counter || mongoose.model("Counter", counterSchema);
const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Conectado a MongoDB");

    await Category.deleteMany({});
    await Product.deleteMany({});
    await User.deleteMany({});
    await Counter.deleteMany({});
    await Order.deleteMany({});
    console.log("Colecciones limpiadas");

    const categories = await Category.insertMany([
      { name: "Cookies", description: "Galletas artesanales de varios sabores" },
      { name: "Brownies", description: "Brownies caseros con distintos rellenos" },
      { name: "Tortas", description: "Tortas personalizadas para toda ocasion" },
      { name: "Alfajores", description: "Alfajores rellenos de dulce de leche y mas" },
    ]);
    console.log(`${categories.length} categorias creadas`);

    const products = await Product.insertMany([
      {
        name: "Cookie Clasica",
        description: "Galleta de chocolate clásica, crujiente por fuera y suave por dentro. Perfecta para acompañar con un café o leche.",
        price: 150,
        stock: 50,
        image: "cookie-clasica.svg",
        categories: [categories[0]._id],
        attributes: [
          { name: "Tipo de masa", options: ["Vainilla", "Chocolate", "Red Velvet"] },
          { name: "Topping", options: ["Glasé", "Dulce de leche", "Crema"] },
        ],
      },
      {
        name: "Brownie Especial",
        description: "Brownie intenso de chocolate belga con nueces pecanas. Una explosión de sabor en cada bocado.",
        price: 250,
        stock: 30,
        image: "brownie-especial.svg",
        categories: [categories[1]._id],
        attributes: [
          { name: "Relleno", options: ["Nada", "Dulce de leche", "Frutillas"] },
          { name: "Chips", options: ["Chocolate blanco", "Chocolate negro", "Frutos secos"] },
        ],
      },
      {
        name: "Torta Personalizada",
        description: "Torta de chocolate con cobertura de ganache. Ideal para cumpleaños y celebraciones.",
        price: 3500,
        stock: 10,
        image: "torta-personalizada.svg",
        categories: [categories[2]._id],
        attributes: [
          { name: "Tamaño", options: ["Pequeña (8 porciones)", "Mediana (12 porciones)", "Grande (20 porciones)"] },
          { name: "Sabor", options: ["Chocolate", "Vainilla", "Frutilla"] },
        ],
      },
      {
        name: "Alfajor de Maicena",
        description: "Alfajor tradicional de maicena relleno de dulce de leche, bañado en coco rallado.",
        price: 120,
        stock: 100,
        image: "alfajor-maicena.svg",
        categories: [categories[3]._id],
        attributes: [
          { name: "Relleno", options: ["Dulce de leche", "Chocolate", "Merengue"] },
          { name: "Cobertura", options: ["Coco rallado", "Chocolate", "Glaseado"] },
        ],
      },
      {
        name: "Cookie Red Velvet",
        description: "Galleta red velvet con chips de chocolate blanco. Un clásico renovado.",
        price: 180,
        stock: 40,
        image: "cookie-red-velvet.svg",
        categories: [categories[0]._id],
        attributes: [
          { name: "Topping", options: ["Glasé", "Cream cheese", "Nada"] },
        ],
      },
      {
        name: "Brownie de Nutella",
        description: "Brownie relleno de Nutella con un toque de avellanas. Para los amantes del chocolate italiano.",
        price: 280,
        stock: 25,
        image: "brownie-nutella.svg",
        categories: [categories[1]._id, categories[0]._id],
        attributes: [
          { name: "Extra", options: ["Nada", "Nueces", "Cookies crumble"] },
        ],
      },
    ]);
    console.log(`${products.length} productos creados`);

    const hashedPassword = await bcryptjs.hash("password123", 10);

    const users = await User.insertMany([
      {
        name: "Juan Perez",
        email: "juan@test.com",
        password: hashedPassword,
        favorites: [products[0]._id, products[2]._id],
      },
      {
        name: "Maria Garcia",
        email: "maria@test.com",
        password: hashedPassword,
        favorites: [products[1]._id],
      },
      {
        name: "Admin Ecommerce",
        email: "admin@test.com",
        password: hashedPassword,
        favorites: [],
      },
    ]);
    console.log(`${users.length} usuarios creados`);

    await Counter.create({ name: "orderNumber", seq: 1002 });

    const orders = await Order.insertMany([
      {
        orderNumber: 1000,
        userId: users[0]._id,
        items: [
          {
            productId: products[0]._id,
            name: products[0].name,
            image: products[0].image,
            price: products[0].price,
            quantity: 2,
            customizations: { "Tipo de masa": "Chocolate", Topping: "Dulce de leche" },
            subtotal: 300,
          },
          {
            productId: products[1]._id,
            name: products[1].name,
            image: products[1].image,
            price: products[1].price,
            quantity: 1,
            customizations: { Relleno: "Dulce de leche" },
            subtotal: 250,
          },
        ],
        total: 550,
        shippingAddress: "Av. Corrientes 1234, Buenos Aires",
        contactPhone: "11-5555-1234",
        contactEmail: "juan@test.com",
        notes: "Pedido para el viernes por la tarde",
        status: "Active",
      },
      {
        orderNumber: 1001,
        userId: users[1]._id,
        items: [
          {
            productId: products[3]._id,
            name: products[3].name,
            image: products[3].image,
            price: products[3].price,
            quantity: 6,
            customizations: { Relleno: "Dulce de leche", Cobertura: "Coco rallado" },
            subtotal: 720,
          },
        ],
        total: 720,
        shippingAddress: "Calle Florida 567, CABA",
        contactPhone: "11-6666-5678",
        contactEmail: "maria@test.com",
        notes: "",
        status: "Shipped",
      },
    ]);
    console.log(`${orders.length} ordenes creadas`);

    console.log("\n=== Seed completado ===");
    console.log("Usuarios de prueba:");
    console.log("  juan@test.com / password123");
    console.log("  maria@test.com / password123");
    console.log("  admin@test.com / password123");
    console.log(`\nOrdenes: #1000 (Active), #1001 (Shipped)`);

    await mongoose.disconnect();
    console.log("\nDesconectado de MongoDB");
  } catch (error) {
    console.error("Error durante el seed:", error);
    process.exit(1);
  }
}

seed();
