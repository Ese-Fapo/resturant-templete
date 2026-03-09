import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/mongoose";
import Order from "@/models/order";
import MenuItem from "@/models/menuItem";
import User from "@/models/user";

type UserAddress = {
  _id: string;
  street: string;
  city: string;
  postalCode: string;
  label: string;
};

type OrderItemType = {
  name: string;
  quantity: number;
  price: number;
};

type OrderDocument = {
  _id: string;
  total: number;
  status: string;
  paymentStatus: string;
  createdAt: Date;
  items: OrderItemType[];
  deliveryAddress: {
    street: string;
    city: string;
    postalCode: string;
  };
};

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { items, deliveryAddressId, paymentMethod, notes } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty" },
        { status: 400 }
      );
    }

    // Get user and validate address
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Validate delivery address
    const selectedAddress = user.addresses?.find(
      (addr: UserAddress) => addr._id?.toString() === deliveryAddressId
    );

    if (!selectedAddress) {
      return NextResponse.json(
        { error: "Invalid delivery address" },
        { status: 400 }
      );
    }

    // Validate and get current prices for all items
    const validatedItems = [];
    let subtotal = 0;

    for (const item of items) {
      const menuItem = await MenuItem.findById(item.id).select("name price image available");

      if (!menuItem || !menuItem.available) {
        return NextResponse.json(
          { error: `Item ${item.name} is no longer available` },
          { status: 400 }
        );
      }

      const itemTotal = menuItem.price * item.quantity;
      subtotal += itemTotal;

      validatedItems.push({
        menuItem: menuItem._id,
        name: menuItem.name,
        price: menuItem.price,
        quantity: item.quantity,
        image: menuItem.image,
      });
    }

    const TAX_RATE = 0.1;
    const DELIVERY_FEE = 5;
    const tax = Math.round(subtotal * TAX_RATE * 100) / 100;
    const total = Math.round((subtotal + tax + DELIVERY_FEE) * 100) / 100;

    // Create order
    const order = new Order({
      user: user._id,
      items: validatedItems,
      deliveryAddress: {
        street: selectedAddress.street,
        city: selectedAddress.city,
        postalCode: selectedAddress.postalCode,
        label: selectedAddress.label,
      },
      subtotal: Math.round(subtotal * 100) / 100,
      tax,
      deliveryFee: DELIVERY_FEE,
      total,
      paymentMethod,
      paymentStatus: "pending",
      notes: notes || "",
    });

    await order.save();

    return NextResponse.json(
      {
        success: true,
        order: {
          id: order._id.toString(),
          total: order.total,
          status: order.status,
          createdAt: order.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to process checkout" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get user's orders with full details
    const orders = await Order.find({ user: user._id })
      .sort({ createdAt: -1 })
      .lean();

    const formattedOrders = orders.map((order: OrderDocument) => ({
      id: order._id.toString(),
      total: order.total,
      status: order.status,
      paymentStatus: order.paymentStatus,
      createdAt: order.createdAt,
      items: order.items.map((item: OrderItemType) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      deliveryAddress: order.deliveryAddress,
    }));

    return NextResponse.json({ orders: formattedOrders });
  } catch (error) {
    console.error("Get orders error:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
