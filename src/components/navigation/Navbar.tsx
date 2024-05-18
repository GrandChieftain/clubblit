import OrganizationSwitcher from "./OrganizationSwitcher";
import logo from "@/assets/clubblit_logo.png"
import Image from "next/image";
import Link from "next/link";
import Search from "./Search"
import Profile from "./Profile"
import ModeToggle from "./ModeToggle";
import NotificationBell from "./ChatToggle";
import OrgSettings from "./OrgSettings";
import OfficialStatus from "./OfficialStatus";
  
export default async function Navbar(){
    return (
        <nav className="sticky flex items-center w-full h-14 bg-white dark:bg-[#19191A] border-b border-[#E4E4E7] dark:border-[#515152] z-50">
            <Link href="/" className="flex items-center gap-[6px] mx-[15px] mr-auto">
                <Image src={logo} className="w-10 h-10" alt="" />
                <span className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[#00AEDF] via-[#8b2dd1] via-[60%] to-[#EC1A23]">Clubblit</span>
            </Link>
            <div className="flex items-center gap-1 mx-auto">
                <OfficialStatus />
                <OrganizationSwitcher />
            </div>
            <Search />
            <div className="flex items-center justify-center gap-5">
                <NotificationBell />
                <OrgSettings />
                <ModeToggle />
            </div>
            <div className="flex items-center ml-auto mr-[10px]">
                <Profile />
            </div>
        </nav>
    )
}
  