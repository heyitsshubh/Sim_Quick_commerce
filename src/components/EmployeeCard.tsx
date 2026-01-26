import React from "react";
import { Check, Lock, Briefcase, Star } from "lucide-react";

interface Employee {
  _id: string;
  name: string;
  role: string;
  expertise: string;
  profileImage: string;
  salaryPerMonth: number;
}

interface EmployeeCardProps {
  emp: Employee;
  selected: boolean;
  onToggle: (id: string) => void;
  fixed: boolean;
}

export default function EmployeeCard({
  emp,
  selected,
  onToggle,
  fixed
}: EmployeeCardProps) {
  return (
    <div
      onClick={!fixed ? () => onToggle(emp._id) : undefined}
      className={`
        relative overflow-hidden rounded-xl border transition-all duration-300
        ${!fixed ? "cursor-pointer" : "cursor-default"}
        ${
          fixed
            ? "border-purple-200 bg-purple-50 shadow-sm hover:shadow-md"
            : selected
            ? "border-blue-400 bg-blue-50 shadow-md"
            : "border-slate-200 bg-white hover:border-blue-300 hover:shadow-sm"
        }
      `}
    >
      {/* Top Gradient Bar */}
      <div
        className={`h-0.5 w-full ${
          fixed ? "bg-purple-400" : "bg-blue-400"
        }`}
      />

      {/* Content Container */}
      <div className="flex flex-col items-center p-3 space-y-2.5">
        {/* Profile Image & Status */}
        <div className="relative">
          <div
            className={`
              h-14 w-14 rounded-full overflow-hidden border-3 transition-all
              ${
                fixed
                  ? "border-purple-300"
                  : selected
                  ? "border-blue-400"
                  : "border-slate-200"
              }
            `}
          >
            <img
              src={emp.profileImage}
              alt={emp.name}
              className="h-full w-full object-cover"
            />
          </div>

          {/* Selection/Fixed Indicator */}
          {fixed ? (
            <div className="absolute -top-1 -right-1 bg-purple-500 text-white rounded-full p-0.5 shadow-md">
              <Lock size={10} />
            </div>
          ) : selected ? (
            <div className="absolute -top-1 -right-1 bg-blue-500 text-white rounded-full p-0.5 shadow-md animate-pulse">
              <Check size={10} />
            </div>
          ) : null}
        </div>

        {/* Employee Info */}
        <div className="text-center space-y-1 w-full">
          {/* Name */}
          <h3 className="text-xs font-bold text-slate-800 line-clamp-1">{emp.name}</h3>

          {/* Role */}
          <div className="flex items-center justify-center gap-0.5">
            <Briefcase size={10} className="text-blue-500 flex-shrink-0" />
            <p className="text-xs font-semibold text-slate-600 line-clamp-1">{emp.role}</p>
          </div>

          {/* Expertise Badge */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-full px-1.5 py-0.5 inline-flex items-center gap-0.5 w-fit mx-auto border border-amber-100">
            <Star size={8} className="fill-amber-500 text-amber-500" />
            <p className="text-xs font-semibold text-amber-700 line-clamp-1">{emp.expertise}</p>
          </div>
        </div>

        {/* Salary */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg px-1.5 py-1 border border-green-200 w-full text-center">
          <p className="text-xs text-green-600 font-bold">₹{(emp.salaryPerMonth / 1000).toFixed(0)}K</p>
        </div>

        {/* Status Badge & Button */}
        {fixed ? (
          <div className="bg-purple-100 border border-purple-200 rounded-lg px-2 py-1 flex items-center justify-center gap-0.5 w-full">
            <Lock size={9} className="text-purple-600" />
            <span className="text-xs font-semibold text-purple-700">Mandatory</span>
          </div>
        ) : selected ? (
          <div className="bg-blue-100 border border-blue-200 rounded-lg px-2 py-1 flex items-center justify-center gap-0.5 w-full">
            <Check size={9} className="text-blue-600" />
            <span className="text-xs font-semibold text-blue-700">Selected</span>
          </div>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggle(emp._id);
            }}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-2 py-1 text-xs font-semibold transition-all"
          >
            Add
          </button>
        )}
      </div>
    </div>
  );
}