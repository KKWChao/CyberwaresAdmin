import DummyChart from "@/components/Charts/DummyChart";
import Layout from "@/components/Layout";
import { useSession } from "next-auth/react";
import LineChart from "@/components/Charts/LineChart";
import BarChart from "@/components/Charts/BarChart";
import DonutChart from "@/components/Charts/DonutChart";

const PrimaryChart =
  "lg:h-[620px] md:h-[320px] md:col-span-3 rounded-md shadow-md px-10 py-5 border border-gray-300";
const SecondaryChart =
  "lg:h-[340px] md:h-[320px] rounded-md shadow-md px-10 py-5 border border-gray-300";

export default function Home() {
  const { data: session } = useSession();

  return (
    <Layout>
      {/* TITLE BAR */}
      <div className="text-blue-900 flex justify-between">
        <h2>
          Hello, <b>{session?.user?.name}</b>
        </h2>
        <div className="flex bg-gray-300 text-black gap-2 rounded-lg overflow-hidden">
          <img
            src={session?.user?.image}
            alt={session?.user?.name}
            className="w-6 h-6 "
          />
          <span className="px-2">{session?.user?.name}</span>
        </div>
      </div>
      {/* DASHBOARD ITEMS */}
      <div className="p-10 md:my-10 md:grid md:grid-cols-3 rounded-lg flex flex-col gap-10">
        {/* MAIN CHART */}
        <div className={PrimaryChart}>
          <BarChart />
        </div>
        {/* 3 BOTTOM CHARTS  */}
        <div className={SecondaryChart}>
          <DonutChart />
        </div>
        <div className={SecondaryChart}>
          <LineChart />
        </div>
        <div className={SecondaryChart}>
          <DummyChart />
        </div>
      </div>
    </Layout>
  );
}
