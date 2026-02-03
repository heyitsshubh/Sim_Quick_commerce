import { NavLink } from "react-router-dom";

type Tab = {
  name: string;
  path: string;
};

const tabs: Tab[] = [
  { name: "PROFILE", path: "/profile" },
  { name: "BUSINESS PLAN", path: "/business-plan" },
  { name: "DECISIONS", path: "/decisions" },
  { name: "RESULTS", path: "/results" },
  { name: "ANALYSIS", path: "/analysis" },
  { name: "COMMUNICATION", path: "/communication" },
];

const TopNav: React.FC = () => {
  return (
    <div className="bg-white">
      <div className="mx-auto w-full max-w-50xl flex items-center justify-center gap-2 overflow-x-auto whitespace-nowrap px-4 sm:px-6 py-4 border border-blue-100 rounded-xl bg-blue-50/60 shadow-sm">
        {tabs.map((tab) => (
          <NavLink
            key={tab.path}
            to={tab.path}
            className={({ isActive }) =>
              `px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base font-bold tracking-wide transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 ${
                isActive
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-blue-600 hover:bg-blue-50"
              }`
            }
          >
            {tab.name}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default TopNav;
