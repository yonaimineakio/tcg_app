import SideBar from "@/components/sideBar";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen">
            {/* サイドバー */}
            <SideBar />

            {children}
        </div>
    )
}