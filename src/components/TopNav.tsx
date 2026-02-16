import { NavLink } from "react-router-dom";
import { useState } from "react";
import {
  User,
  Briefcase,
  CheckCircle2,
  BarChart3,
  LineChart,
  MessageSquare,
  Menu,
  X,
} from "lucide-react";

type Tab = {
  name: string;
  path: string;
  icon: React.ElementType;
};

const tabs: Tab[] = [
  { name: "Profile", path: "/profile", icon: User },
  { name: "Business Plan", path: "/business-plan", icon: Briefcase },
  { name: "Decisions", path: "/decisions", icon: CheckCircle2 },
  { name: "Results", path: "/results", icon: BarChart3 },
  { name: "Analysis", path: "/analysis", icon: LineChart },
  { name: "Communication", path: "/communication", icon: MessageSquare },
];

const TopNav: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full flex justify-center mt-2 md:mt-4 px-2">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden absolute left-4 top-4 z-50 p-2 hover:bg-slate-100 rounded-lg"
      >
        {isOpen ? (
          <X size={24} className="text-slate-900" />
        ) : (
          <Menu size={24} className="text-slate-900" />
        )}
      </button>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-2 px-3 py-3 rounded-2xl backdrop-blur-xl bg-white/70 border border-white/40 shadow-[0_8px_30px_rgba(0,0,0,0.06)] overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => {
          const Icon = tab.icon;

          return (
            <NavLink
              key={tab.path}
              to={tab.path}
              className={({ isActive }) =>
                `
                relative flex items-center gap-2
                px-4 py-2.5 rounded-xl
                text-lg font-semibold
                transition-all duration-300
                whitespace-nowrap
                ${
                  isActive
                    ? "text-white"
                    : "text-black hover:text-blue-600"
                }
              `
              }
            >
              {({ isActive }) => (
                <>
                  {/* Active Background Pill */}
                  <span
                    className={`
                    absolute inset-0 rounded-xl
                    transition-all duration-300
                    ${
                      isActive
                        ? "bg-gradient-to-r from-blue-600 to-indigo-500 shadow-lg scale-100 opacity-100"
                        : "scale-90 opacity-0"
                    }
                  `}
                  />

                  {/* Content */}
                  <span className="relative flex items-center gap-2 z-10">
                    <Icon
                      size={18}
                      className={`transition ${
                        isActive ? "text-white" : "text-slate-500"
                      }`}
                    />
                    {tab.name}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-white border-b border-slate-200 shadow-lg z-40">
          <div className="flex flex-col p-4 space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <NavLink
                  key={tab.path}
                  to={tab.path}
                  className={({ isActive }) =>
                    `
                    flex items-center gap-3
                    px-4 py-3 rounded-lg
                    text-base font-medium
                    transition-all
                    ${
                      isActive
                        ? "bg-blue-600 text-white"
                        : "text-slate-700 hover:bg-slate-100"
                    }
                  `
                  }
                  onClick={() => setIsOpen(false)}
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        size={20}
                        className={`transition ${
                          isActive ? "text-white" : "text-slate-500"
                        }`}
                      />
                      {tab.name}
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default TopNav;
