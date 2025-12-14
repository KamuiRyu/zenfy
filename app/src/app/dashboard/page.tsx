import LogoutButton from "@/components/auth/logout_button";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatCard from "@/components/dashboard/StatCard";
import ChartCard from "@/components/dashboard/ChartCard";
import ActivityCard from "@/components/dashboard/ActivityCard";

export default function DashboardPage() {
    return (
        <div className="min-h-screen bg-surface p-6">
            <div className="container-fluid w-full">
                <div className="flex gap-6">
                    <main className="flex-1">
                        <div className="flex items-center justify-between mb-6">
                            <DashboardHeader />
                            <LogoutButton />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                            <div className="lg:col-span-8">
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                                    <StatCard title="Balance" value="$4,509">
                                        <svg className="w-full h-full" viewBox="0 0 60 40" fill="none"><rect width="60" height="40" rx="6" fill="#4353FF"/></svg>
                                    </StatCard>
                                    <StatCard title="Sells" value="$4,509">
                                        <svg className="w-full h-full" viewBox="0 0 60 40" fill="none"><rect width="60" height="40" rx="6" fill="#FF6B9A"/></svg>
                                    </StatCard>
                                    <StatCard title="Revenue" value="$4,509">
                                        <svg className="w-full h-full" viewBox="0 0 60 40" fill="none"><rect width="60" height="40" rx="6" fill="#FFD66B"/></svg>
                                    </StatCard>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    <ChartCard title="Sale">
                                        <div className="h-full bg-gradient-to-b from-blue-50 to-transparent rounded-lg" />
                                    </ChartCard>
                                    <ChartCard title="Payments">
                                        <div className="h-full bg-gradient-to-b from-yellow-50 to-transparent rounded-lg" />
                                    </ChartCard>
                                </div>
                            </div>

                            <aside className="lg:col-span-4 flex flex-col gap-4">
                                <ActivityCard />
                                <div className="bg-white p-6 rounded-xl shadow-sm">
                                    <h3 className="font-medium mb-3">Goals</h3>
                                    <div className="flex flex-col gap-3">
                                        <div className="bg-gray-50 p-3 rounded-md">Business Funding <div className="text-sm text-muted-foreground">70%</div></div>
                                        <div className="bg-pink-50 p-3 rounded-md">Top Up Balance <div className="text-sm text-muted-foreground">70%</div></div>
                                    </div>
                                </div>
                            </aside>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}