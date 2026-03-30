import { NextRequest } from "next/server";
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import path from "path";
import fs from "fs";
import os from "os";

export const runtime = "nodejs";
export const maxDuration = 600;

export async function POST(req: NextRequest) {
  try {
    const { composition } = await req.json();
    const entryPoint = path.join(process.cwd(), "src/remotion/index.ts");
    const outFile = path.join(os.tmpdir(), `${composition}-${Date.now()}.mp4`);

    const bundled = await bundle({ entryPoint });

    const comp = await selectComposition({
      serveUrl: bundled,
      id: composition,
    });

    await renderMedia({
      composition: comp,
      serveUrl: bundled,
      codec: "h264",
      outputLocation: outFile,
    });

    const buffer = fs.readFileSync(outFile);
    fs.unlinkSync(outFile);

    return new Response(buffer, {
      headers: {
        "Content-Type": "video/mp4",
        "Content-Disposition": `attachment; filename="${composition}.mp4"`,
        "Content-Length": String(buffer.length),
      },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
