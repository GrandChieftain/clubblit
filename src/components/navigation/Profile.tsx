import { currentUser, auth } from "@clerk/nextjs"
import UserButton from "./UserButton";

export default async function Profile(){
    const user = await currentUser();
    const { orgRole } = await auth();
    const fullName = user?.firstName + ' ' + user?.lastName;
    const abbrevFirst = user?.firstName + ' ' + user?.lastName![0];
    const abbrevLast = user?.firstName![0] + '. ' + user?.lastName
    const name = fullName.length <= 20 ? fullName : abbrevFirst.length <= 20 ? abbrevFirst : abbrevLast.length <= 20 ? abbrevLast : user?.firstName![0] + '. ' + user?.lastName![0] + '.';
    const role = orgRole == undefined ? "Student" : orgRole == 'admin' ? "Admin" : "Member"

    return (
        <div className="flex relative rounded-md items-center hover:cursor-pointer w-[200px] h-10 hover:bg-black/[0.04] dark:hover:bg-white/[0.04]">
            <div className="absolute flex flex-col h-8 labels left-11 -z-10">
                <label className="text-xs font-medium leading-snug name dark:text-white">{name}</label>
                <label className="text-xs leading-snug dark:text-[#C2C2C2]">{role}</label>
            </div>
            <UserButton />
        </div>
    )
}