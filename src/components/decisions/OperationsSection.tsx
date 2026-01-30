/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Users, Award, DollarSign, } from "lucide-react";
import { getHRData, saveHRConfig } from "../../api/hrApi";
import EmployeeCard from "../EmployeeCard";
import Slider from "../Slider";

export default function OperationsSection() {
  type Employee = {
    _id: string;
    name: string;
    role: string;
    expertise: string;
    profileImage: string;
    salaryPerMonth: number;
    [key: string]: any;
  };

  const [topManagement, setTopManagement] = useState<Employee[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [training, setTraining] = useState(0);
  const [bonus, setBonus] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getHRData().then((res: any) => {
      setTopManagement(res.data.topManagement);
      setEmployees(res.data.employees);
      setLoading(false);
    });
  }, []);

  const toggleEmployee = (id: string) => {
    setSelectedEmployees(prev =>
      prev.includes(id)
        ? prev.filter(x => x !== id)
        : [...prev, id]
    );
  };

  const totalSalary = employees
    .filter(e => selectedEmployees.includes(e._id))
    .reduce((sum, e) => sum + e.salaryPerMonth, 0);

  const topManagementSalary = topManagement.reduce((sum, e) => sum + e.salaryPerMonth, 0);

  const totalTrainingCost = selectedEmployees.length * training;
  const totalBonusCost = selectedEmployees.length * bonus;
  const totalHRCost = totalSalary + topManagementSalary + totalTrainingCost + totalBonusCost;

  // Display total HR cost
  <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-2xl p-4 flex items-center gap-3">
    <div className="bg-green-200 p-2 rounded-lg">
      <DollarSign size={18} className="text-green-700" />
    </div>
    <div>
      <p className="text-xs text-green-600 font-medium">Total HR Cost</p>
      <p className="text-lg font-bold text-green-900">₹{(totalHRCost / 100000).toFixed(1)}L / month</p>
    </div>
  </div>

  const submitHR = async () => {
    try {
      setSaving(true);
      const res = await saveHRConfig({
        selectedEmployees,
        trainingBudgetPerEmployee: training,
        bonusPerEmployee: bonus
      });

      console.log(res.data.summary);
    } catch (error) {
      console.error("Failed to save HR config", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center space-y-4">
          <div className="inline-block animate-spin">
            <Users className="text-blue-600" size={40} />
          </div>
          <p className="text-slate-600 font-medium">Loading HR data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}

        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-3">
            <div>
              <h2 className="text-4xl font-bold tracking-tight">HR & Operations</h2>
              <p className="text-black-100 text-sm mt-1">Build and develop your team</p>
            </div>
          </div>
        </div>
     

      {/* Top Management Section */}
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 p-2.5 rounded-xl">
              <Award size={22} className="text-purple-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800">Top Management</h3>
              <p className="text-xs text-slate-500">Mandatory team members</p>
            </div>
          </div>
          <div className="sm:ml-auto">
            <span className="bg-purple-100 text-purple-700 px-3 py-1.5 rounded-full text-xs font-semibold">
              {topManagement.length} members
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {topManagement.map(emp => (
            <EmployeeCard
              key={emp._id}
              emp={emp}
              selected={true}
              fixed={true}
              onToggle={() => {}}
            />
          ))}
        </div>
      </div>

      {/* Employees Section */}
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2.5 rounded-xl">
              <Users size={22} className="text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800">Build Your Team</h3>
              <p className="text-xs text-slate-500">Select employees to hire</p>
            </div>
          </div>
          <div className="sm:ml-auto">
            <span className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full text-xs font-semibold">
              {selectedEmployees.length} / {employees.length} selected
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {employees.map(emp => (
            <EmployeeCard
              key={emp._id}
              emp={emp}
              selected={selectedEmployees.includes(emp._id)}
              onToggle={toggleEmployee}
              fixed={false}
            />
          ))}
        </div>
      </div>

      {/* Budget Allocation */}
      <div className="space-y-6 bg-gradient-to-br from-slate-50 via-white to-slate-50 p-8 rounded-3xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-green-100 p-2.5 rounded-xl">
            <DollarSign size={24} className="text-green-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800">Budget Allocation</h3>
            <p className="text-xs text-slate-500">Employee benefits & development</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Slider
            label="Training Budget per Employee"
            value={training}
            max={50000}
            onChange={setTraining}
            icon="📚"
          />

          <Slider
            label="Bonus per Employee"
            value={bonus}
            max={100000}
            onChange={setBonus}
            icon="🎁"
          />
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={submitHR}
        disabled={saving}
        className={`
          w-full py-4 rounded-2xl font-bold text-base transition-all duration-300
          flex items-center justify-center gap-3 shadow-lg
          ${
            saving
              ? "bg-slate-300 text-slate-600 cursor-not-allowed shadow-sm"
              : "w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl"
          }
        `}
      >
      
        <span>{saving ? "Saving..." : "Save "}</span>
      </button>
    </div>
  );
}