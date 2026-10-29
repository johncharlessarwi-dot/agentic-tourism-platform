export function GET() {
  return Response.json({
    status: "ok",
    service: "safarios-platform",
    version: process.env.npm_package_version ?? "0.1.0",
    timestamp: new Date().toISOString(),
  });
}
