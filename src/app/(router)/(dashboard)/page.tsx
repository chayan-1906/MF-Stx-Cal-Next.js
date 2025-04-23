import React from "react";
import Logout from "@/components/Logout";
import {getUserFromDb} from "@/lib/db/user-storage";
import DeleteAccount from "@/components/DeleteAccount";
import {getMfSipsByToken} from "@/lib/db/mf-sips-storage";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import MonthlyOverview from "@/components/dashboard/MonthlyOverview";
import {redirect} from "next/navigation";
import routes from "@/lib/routes";
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
