import React from "react";
import Sidebar from "@/components/dashboard/sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="min-h-screen bg-surface">
				<div className="flex gap-6">
					<Sidebar />
					<div className="flex-1">
						{children}
				</div>
			</div>
		</div>
	);
}

