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
    <div className="bg-[#d8cb9e] h-[50px] z-50 shadow-md">
      <div className="flex justify-between items-center px-4 py-1.5 max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          <p className="text-orange-900 font-bold text-xl">OCBIS</p>
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