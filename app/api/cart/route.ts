import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/mongoose";
import MenuItem from "@/models/menuItem";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { action, items } = await req.json();

    // Store cart in session storage on client side, but we can log for analytics
    if (action === "validate") {
      // Verify that menu items exist and prices are current

      for (const item of items) {
        const menuItem = await MenuItem.findById(item.id).select("price available");

        if (!menuItem || !menuItem.available) {
          return NextResponse.json(
            { error: `Item ${item.id} is not available` },
            { status: 400 }
          );
        }

        if (menuItem.price !== item.price) {
          return NextResponse.json(
            { error: `Price has changed for ${item.name}` },
            { status: 400 }
          );
        }
      }

      return NextResponse.json({ valid: true });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Cart validation error:", error);
    return NextResponse.json(
      { error: "Failed to validate cart" },
      { status: 500 }
    );
  }
}
