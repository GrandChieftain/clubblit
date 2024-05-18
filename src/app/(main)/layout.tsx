import Navbar from "@/components/navigation/Navbar";

export default function Layout({children}: {children: React.ReactNode}) {
    return (
        <div className="h-screen bg-[#DAE0E6] dark:bg-background dark:text-white">
            <Navbar />
            {children}
        </div>
    )
}