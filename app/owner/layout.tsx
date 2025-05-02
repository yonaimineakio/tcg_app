import Sidebar from '@/components/sidebar';

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="h-screen justify-center w-full">
            {/* サイドバー */}
            <Sidebar />

            {children}
        </div>
    )
}