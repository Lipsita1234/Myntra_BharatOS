import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get("url");

    if (!url) {
      return NextResponse.json({ error: "Missing 'url' parameter" }, { status: 400 });
    }

    // Fetch the external dataset URL
    const response = await fetch(url);
    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch dataset from external source: ${response.statusText}` },
        { status: response.status }
      );
    }

    const dataText = await response.text();
    return new NextResponse(dataText, {
      status: 200,
      headers: {
        "Content-Type": "text/plain",
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "An error occurred while fetching the dataset" },
      { status: 500 }
    );
  }
}
