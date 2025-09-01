import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";

const protectedRoutes = ["/create(.*)", "/profile(.*)"];
const isProtectedRoute = createRouteMatcher(protectedRoutes);

export default convexAuthNextjsMiddleware(
  async (req, { convexAuth }) => {
    const isAuthenticated = await convexAuth.isAuthenticated();

    if (isProtectedRoute(req) && !isAuthenticated) {
      return nextjsMiddlewareRedirect(req, "/");
    }
  },
  { cookieConfig: { maxAge: 60 * 60 * 24 * 30 } }
);

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
