import { withAuth } from "next-auth/middleware"

export default withAuth({
  pages: {
    signIn: "/",
  },
})

export const config = {
  matcher: ["/dashboard/:path*", "/journal/:path*", "/gallery/:path*", "/ai/:path*", "/ai-connections/:path*", "/mailbox/:path*", "/settings/:path*"],
}
