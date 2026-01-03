"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MdDashboard, MdLogout, MdArrowBack } from "react-icons/md";

type HeaderProps = {
  showBackButton?: boolean;
};

export default function Header({ showBackButton = false }: HeaderProps) {
  const router = useRouter();

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem("isLoggedIn");
      sessionStorage.removeItem("username");
    }
    router.push("/login");
  };

  return (
    <div className="bg-[#d8cb9e] h-14 fixed top-0 left-0 right-0 z-50 shadow-md">
      <div className="flex justify-between items-center px-4 py-2 max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          <h1 className="text-orange-900 font-bold text-xl">OCBIS</h1>
        </div>

        <div className="flex items-center gap-4">
          {showBackButton && (
            <Link href="/dashboard">
              <MdArrowBack
                size={28}
                className="text-orange-900 hover:text-orange-700 cursor-pointer"
                title="Back to Dashboard"
              />
            </Link>
          )}
          <Link href="/dashboard">
            <MdDashboard
              size={28}
              className="text-orange-900 hover:text-orange-700 cursor-pointer"
              title="Dashboard"
            />
          </Link>
          <MdLogout
            size={28}
            className="text-orange-900 hover:text-orange-700 cursor-pointer"
            onClick={handleLogout}
            title="Logout"
          />
        </div>
      </div>
    </div>
  );
}