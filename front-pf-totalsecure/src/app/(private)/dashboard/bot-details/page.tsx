import { BotCasesTotalChart } from "./components/bot-cases-total-chart";
import { BotIncidentsTotalChart } from "./components/bot-incidents-total-chart";
import { BotByDateTabsChart } from "./components/bot-by-date-tabs-chart";

export default function BotDetailsPage() {
  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="grid auto-rows-min gap-4 md:grid-cols-2">
        <BotCasesTotalChart />
        <BotIncidentsTotalChart />
      </div>
      <div>
        <BotByDateTabsChart />
      </div>
    </div>
  );
}
