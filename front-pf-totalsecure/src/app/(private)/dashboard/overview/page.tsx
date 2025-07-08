import { IncidentByDayChart } from "./components/incident-by-day-chart";
import { SectionCards } from "./components/section-cards";
import { CaseByDayChart } from "./components/case-by-day-chart";
import { BotsSummaryChart } from "./components/bots-summary-chart";
import { CaseByStateChart } from "./components/cases-by-state-chart";
import { DashboardFilterProvider } from "@/contexts/dashboard-filter-provider";
import ProfessionalDashboard from "./components/professional-dashboard";
import { CasesByBotChart } from "./components/cases-by-bot-chart";
import { DashboardFilters } from "./components/dashboard-filters";

export default function OverviewPage() {
  return (
    <DashboardFilterProvider>
      <div className="flex flex-1 flex-col gap-4">
        <DashboardFilters />
        <ProfessionalDashboard />
        <CasesByBotChart />
        {/* <SectionCards /> */}
        <div className="grid auto-rows-min gap-4 md:grid-cols-2">
          <IncidentByDayChart />
          <CaseByDayChart />
        </div>
        <div className="grid auto-rows-min gap-4 md:grid-cols-2">
          <CaseByStateChart />
          <BotsSummaryChart />
        </div>
      </div>
    </DashboardFilterProvider>
  );
}
