import { NextResponse, type NextRequest } from "next/server";
import { getWeather } from "@/lib/api/weather";

export async function GET(request: NextRequest) {
  const lat = Number(request.nextUrl.searchParams.get("lat"));
  const lon = Number(request.nextUrl.searchParams.get("lon"));

  if (Number.isNaN(lat) || Number.isNaN(lon)) {
    return NextResponse.json(
      { error: "Coordonnées invalides" },
      { status: 400 }
    );
  }

  try {
    const weather = await getWeather(lat, lon);
    return NextResponse.json({
      current: weather.current,
      todayMax: weather.daily[0]?.temperatureMax,
      todayMin: weather.daily[0]?.temperatureMin,
    });
  } catch {
    return NextResponse.json(
      { error: "Météo indisponible" },
      { status: 502 }
    );
  }
}
