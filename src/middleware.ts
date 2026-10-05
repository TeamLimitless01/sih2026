import { withAuth } from "next-auth/middleware";

export default withAuth;

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/cases/:path*",
    "/search/:path*",
    "/network/:path*",
    "/reports/:path*",
    "/settings/:path*",
    "/print/:path*"
  ]
};
