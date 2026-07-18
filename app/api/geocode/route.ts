import { NextResponse, type NextRequest } from "next/server";
import { searchCities } from "@/lib/api/geocoding";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q") ?? "";

  try {
    const results = await searchCities(query);
    return NextResponse.json({ results });
  } catch {
    return NextResponse.json(
      { results: [], error: "Recherche indisponible" },
      { status: 502 }
    );
  }
}
