import { NextRequest, NextResponse } from "next/server";
import { TaxType } from "@prisma/client";
export async function GET(req: NextRequest) {
  try {
    const currencies = Object.values(TaxType);
    return NextResponse.json(currencies, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
