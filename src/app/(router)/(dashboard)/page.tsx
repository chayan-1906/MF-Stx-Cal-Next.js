import React from "react";
import AppWrapperLayout from "@/components/AppWrapperLayout";
import ServerDashboard from "@/app/(router)/(dashboard)/ServerDashboard";

export const dynamic = 'force-dynamic';

async function DashboardPage() {
    return (
        <AppWrapperLayout>
            <ServerDashboard/>
        </AppWrapperLayout>
    );
}

export default DashboardPage;
