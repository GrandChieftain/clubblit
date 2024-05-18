import { authMiddleware, clerkClient, currentUser, redirectToSignIn } from "@clerk/nextjs";
import { NextResponse } from "next/server";

const main = ["/", "/chat"]

export default authMiddleware({
  afterAuth: async (auth, req) => {
    try{
      if (!auth.userId && !auth.isPublicRoute){
        return redirectToSignIn({ returnBackUrl: req.url });
      }
      else if (main.includes(req.nextUrl.pathname) && auth.orgId && !auth.isPublicRoute){
        const organizationId = auth.orgId;
        const organization = await clerkClient.organizations.getOrganization({
          organizationId
        });
        const status = organization.privateMetadata?.status as string | undefined
        if (!status){
          const create = new URL("/create", req.url);
          return NextResponse.redirect(create);
        }
      }
    }
    catch(error){
      console.error(error);
      return new NextResponse("Internal Server Error", {status: 500})
    }
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"]
};