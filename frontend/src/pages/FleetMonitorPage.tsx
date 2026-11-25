import React, { useState, useMemo } from 'react';
import { cn } from '../utils/cn';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge, RiskBadge, MachineStatusBadge } from '../components/ui/Badge';
import { Progress } from '../components/ui/Progress';
import { useApp } from '../context/AppContext';
import { mockFleetMachines, FleetMachineRecord } from '../services/mock/mockData';
import {
  Layers,
  Search,
  SlidersHorizontal,
  LayoutGrid,
  List,
  Cpu,
  Flame,
  RotateCw,
  Gauge,
  Wrench,
  ArrowUpDown,
  Filter,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const FleetMonitorPage: React.FC = () => {
  const { setSelectedMachine } = useApp();
  const navigate = useNavigate();

  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [riskFilter, setRiskFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'riskDesc' | 'riskAsc' | 'toolWear' | 'id'>('riskDesc');

  // Filter & Sort Logic
  const filteredMachines = useMemo(() => {
    return mockFleetMachines
      .filter((m) => {
        const matchesSearch =
          m.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          m.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          m.primaryRisk.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'ALL' || m.status === statusFilter;
        const matchesType = typeFilter === 'ALL' || m.type === typeFilter;

        let matchesRisk = true;
        if (riskFilter === 'CRITICAL') matchesRisk = m.riskScore >= 0.7;
        else if (riskFilter === 'HIGH') matchesRisk = m.riskScore >= 0.42 && m.riskScore < 0.7;
        else if (riskFilter === 'MEDIUM') matchesRisk = m.riskScore >= 0.2 && m.riskScore < 0.42;
        else if (riskFilter === 'LOW') matchesRisk = m.riskScore < 0.2;

        return matchesSearch && matchesStatus && matchesType && matchesRisk;
      })
      .sort((a, b) => {
        if (sortBy === 'riskDesc') return b.riskScore - a.riskScore;
        if (sortBy === 'riskAsc') return a.riskScore - b.riskScore;
        if (sortBy === 'toolWear') return b.toolWear - a.toolWear;
        if (sortBy === 'id') return a.id.localeCompare(b.id);
        return 0;
      });
  }, [searchTerm, statusFilter, riskFilter, typeFilter, sortBy]);

  const handleDiagnose = (e: React.MouseEvent, m: FleetMachineRecord) => {
    e.stopPropagation();
    navigate(
      `/predict?type=${m.type}&air=${m.airTemp}&proc=${m.processTemp}&speed=${m.speed}&torque=${m.torque}&wear=${m.toolWear}&id=${m.id}`
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Filter & Search Bar */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            {/* Search */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search machine, ID, bay location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#0a0d13] border border-slate-800 rounded pl-9 pr-3 py-2 text-xs font-mono text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* View Mode & Sorter */}
            <div className="flex items-center gap-2 w-full md:w-auto justify-end">
              <div className="flex items-center gap-1 bg-[#0a0d13] border border-slate-800 rounded p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded text-xs transition-colors ${
                    viewMode === 'grid' ? 'bg-slate-800 text-cyan-400' : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="Grid View"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-1.5 rounded text-xs transition-colors ${
                    viewMode === 'table' ? 'bg-slate-800 text-cyan-400' : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="Table View"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-[#0a0d13] border border-slate-800 rounded px-2.5 py-1.5 text-xs font-mono text-slate-300 focus:outline-none"
              >
                <option value="riskDesc">Sort: Highest Failure Risk</option>
                <option value="riskAsc">Sort: Lowest Risk First</option>
                <option value="toolWear">Sort: Tool Wear Time</option>
                <option value="id">Sort: Machine ID</option>
              </select>
            </div>
          </div>

          {/* Quick Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/60 text-xs">
            <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1 mr-1">
              <Filter className="w-3.5 h-3.5" /> Filters:
            </span>

            {/* Status filters */}
            {['ALL', 'OPERATIONAL', 'WARNING', 'CRITICAL', 'MAINTENANCE'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
                  statusFilter === st
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {st}
              </button>
            ))}

            <div className="w-px h-4 bg-slate-800 mx-1 hidden sm:block" />

            {/* Risk Tier Filters */}
            {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((rf) => (
              <button
                key={rf}
                onClick={() => setRiskFilter(rf)}
                className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
                  riskFilter === rf
                    ? 'bg-amber-950 text-amber-300 border border-amber-800'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                Risk: {rf}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredMachines.map((m) => {
            const riskLevel =
              m.riskScore >= 0.7 ? 'CRITICAL' : m.riskScore >= 0.42 ? 'HIGH' : m.riskScore >= 0.2 ? 'MEDIUM' : 'LOW';

            return (
              <div
                key={m.id}
                onClick={() => setSelectedMachine(m)}
                className={cn(
                  'rounded p-3.5 space-y-3 cursor-pointer transition-colors group border',
                  m.riskScore >= 0.7
                    ? 'bg-rose-950/25 border-rose-800/80 hover:border-rose-600'
                    : m.riskScore >= 0.42
                    ? 'bg-amber-950/20 border-amber-800/60 hover:border-amber-600'
                    : 'bg-[#111622] border-slate-800 hover:border-slate-700'
                )}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-xs font-bold text-slate-200 group-hover:text-sky-400 transition-colors">
                        {m.id}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 border border-slate-800 px-1 rounded">
                        {m.type}-Series
                      </span>
                    </div>
                    <h3 className="text-xs font-medium text-slate-100 truncate max-w-[160px] mt-0.5">{m.name}</h3>
                    <span className="text-[10px] text-slate-400 truncate block">{m.location}</span>
                  </div>
                  <MachineStatusBadge status={m.status} />
                </div>

                {/* Risk Bar */}
                <div className="space-y-1 p-2 rounded bg-[#0b0e14] border border-slate-800/80">
                  <div className="flex justify-between items-center text-[10px] font-mono tabular-nums">
                    <span className="text-slate-400">Risk Assessment:</span>
                    <span className={cn('font-bold', m.riskScore >= 0.7 ? 'text-rose-400' : m.riskScore >= 0.42 ? 'text-amber-400' : 'text-slate-300')}>
                      {(m.riskScore * 100).toFixed(0)}%
                    </span>
                  </div>
                  <Progress value={m.riskScore * 100} threshold={42} variant="risk" size="sm" />
                </div>

                {/* Mini Telemetry Grid */}
                <div className="grid grid-cols-2 gap-1.5 text-[10px] font-mono text-slate-300 tabular-nums">
                  <div className="flex items-center justify-between p-1 rounded bg-slate-900/60 border border-slate-800/60">
                    <span className="text-slate-400">Speed:</span>
                    <span>{m.speed} rpm</span>
                  </div>
                  <div className="flex items-center justify-between p-1 rounded bg-slate-900/60 border border-slate-800/60">
                    <span className="text-slate-400">Torque:</span>
                    <span>{m.torque} Nm</span>
                  </div>
                  <div className="flex items-center justify-between p-1 rounded bg-slate-900/60 border border-slate-800/60">
                    <span className="text-slate-400">Temp:</span>
                    <span>{m.processTemp} K</span>
                  </div>
                  <div className="flex items-center justify-between p-1 rounded bg-slate-900/60 border border-slate-800/60">
                    <span className="text-slate-400">Wear:</span>
                    <span className={m.toolWear >= 200 ? 'text-rose-400 font-bold' : ''}>{m.toolWear} min</span>
                  </div>
                </div>

                {/* Action Footer */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-slate-400 truncate max-w-[130px] font-mono">{m.primaryRisk}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 text-[10px] px-2 text-sky-400 hover:text-sky-300 hover:bg-slate-800 font-mono"
                    onClick={(e) => handleDiagnose(e, m)}
                  >
                    Diagnose
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#0b0e14] border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Machine ID & Name</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Failure Risk</th>
                  <th className="py-3 px-3">Spindle Speed</th>
                  <th className="py-3 px-3">Load Torque</th>
                  <th className="py-3 px-3">Process Temp</th>
                  <th className="py-3 px-3">Tool Wear</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70 text-slate-200">
                {filteredMachines.map((m) => (
                  <tr
                    key={m.id}
                    onClick={() => setSelectedMachine(m)}
                    className="hover:bg-slate-800/40 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-100">{m.id}</div>
                      <div className="text-[11px] text-slate-400 font-sans">{m.name}</div>
                    </td>
                    <td className="py-3 px-3">
                      <MachineStatusBadge status={m.status} />
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <RiskBadge
                          level={
                            m.riskScore >= 0.7
                              ? 'CRITICAL'
                              : m.riskScore >= 0.42
                              ? 'HIGH'
                              : m.riskScore >= 0.2
                              ? 'MEDIUM'
                              : 'LOW'
                          }
                          size="sm"
                        />
                        <span className="font-bold">{(m.riskScore * 100).toFixed(0)}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-3">{m.speed} rpm</td>
                    <td className="py-3 px-3">{m.torque} Nm</td>
                    <td className="py-3 px-3">{m.processTemp} K</td>
                    <td className="py-3 px-3">
                      <span className={m.toolWear >= 200 ? 'text-rose-400 font-bold' : ''}>
                        {m.toolWear} min
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="h-7 text-xs px-2.5"
                        onClick={(e) => handleDiagnose(e, m)}
                      >
                        Diagnose
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};
