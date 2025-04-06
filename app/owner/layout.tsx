import SideBar from "@/components/sideBar";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="h-screen justify-center w-full">
            {/* サイドバー */}
            <SideBar />

            {children}
        </div>
    )
}