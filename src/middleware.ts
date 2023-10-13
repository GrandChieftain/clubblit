import { authMiddleware, clerkClient } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export default authMiddleware({
  afterAuth: async (auth, req) => {
    try{
    const home = new URL("/", "http://localhost:3000");
    if (req.url == home.toString() && auth.orgId){
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
      return new NextResponse("Internal Server Error", {status: 500})
    }
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"]
};