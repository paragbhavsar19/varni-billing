import Link from "next/link";
import { ReactNode } from "react";

type DashboardCardProps = {
  title: string;
  description: string;
  icon: ReactNode;
  href: string;
  colorScheme: "amber" | "green";
};

export default function DashboardCard({
  title,
  description,
  icon,
  href,
  colorScheme,
}: DashboardCardProps) {
  const bgColor = colorScheme === "amber" ? "bg-amber-100" : "bg-green-100";
  const iconColor = colorScheme === "amber" ? "text-amber-600" : "text-green-600";
  const buttonColor =
    colorScheme === "amber"
      ? "bg-amber-500 hover:bg-amber-600"
      : "bg-green-500 hover:bg-green-600";

  return (
    <Link href={href}>
      <div className="bg-white rounded-xl shadow-lg p-8 cursor-pointer hover:shadow-2xl transition-all transform hover:-translate-y-2">
        <div className="flex flex-col items-center text-center">
          <div className={`${bgColor} p-6 rounded-full mb-4`}>
            <div className={iconColor}>{icon}</div>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">{title}</h3>
          <p className="text-gray-600 mb-4">{description}</p>
          <button
            className={`${buttonColor} text-white px-6 py-2 rounded-lg transition-colors`}
          >
            Open
          </button>
        </div>
      </div>
    </Link>
  );
}