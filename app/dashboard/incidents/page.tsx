
"use client";

import { useEffect, useState } from "react";
import {
  BadgeCheck,
  XCircle,
  Search,
  Filter,
  Share2,
  MessageSquare,
  ChevronDown,
  Clock
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Incident = {
  id: number;
  end: string | null;
  monitor: {
    name: string;
    url: string;
  } | null;
  monitorId: number;
  reason: string;
  start: string;
};

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const pageSize = 10;

  useEffect(() => {
    async function fetchIncidents() {
      try {
        const res = await fetch(`/api/incidents?page=${page}`);
        if (res.ok) {
          const data = await res.json();
          setIncidents(data.incidents);
          setTotalPages(data.totalPages);
        }
      } catch (error) {
        console.error("Failed to fetch incidents:", error);
      }
    }
    fetchIncidents();
  }, [page]);

  const filteredIncidents = incidents.filter(incident =>
    incident.monitor?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    incident.monitor?.url.toLowerCase().includes(searchQuery.toLowerCase())
  );

  function formatDuration(start: string, end: string) {
    const ms = new Date(end).getTime() - new Date(start).getTime();
    const s = Math.floor(ms / 1000);
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h}h ${m}m ${sec}s`;
  }

  function formatDate(dateStr: string) {
    const date = new Date(dateStr);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }) + " GMT+2";
  }

  function getRootCauseCode(reason: string) {
    const codeMatch = reason.match(/HTTP (\d+)/);
    if (codeMatch) return codeMatch[1];
    if (reason.includes("Timeout")) return "T/O";
    if (reason.includes("Forbidden")) return "403";
    return "ERR";
  }

  function getRootCauseText(reason: string) {
    if (reason.includes("Service Unavailable")) return "Service Unavailable";
    if (reason.includes("Connection Timeout")) return "Connection Timeout";
    if (reason.includes("Forbidden")) return "Forbidden";
    return reason.split(':').pop()?.trim() || reason;
  }

  return (
    <div className="min-h-screen bg-[#0d1117] text-gray-300">
      <div className="px-4 md:px-8 py-6 md:py-10 max-w-[1400px] mx-auto">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center">
            Incidents<span className="text-primary font-black">.</span>
          </h1>

          <div className="flex flex-wrap items-center gap-2 md:gap-3">
            <div className="relative group w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-white transition-colors" />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-[#161b22] border border-gray-800 rounded-md pl-10 pr-4 py-2 text-sm w-full md:w-64 focus:outline-none focus:border-gray-600 transition-all placeholder:text-gray-600"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
              <button className="flex items-center gap-2 bg-[#161b22] border border-gray-800 px-3 py-2 rounded-md text-sm hover:bg-[#1f2937] transition-colors whitespace-nowrap">
                <span className="text-gray-400"><Clock className="w-4 h-4" /></span>
                All tags
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>

              <button className="flex items-center gap-2 bg-[#161b22] border border-gray-800 px-3 py-2 rounded-md text-sm hover:bg-[#1f2937] transition-colors whitespace-nowrap">
                Started
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>

              <button className="flex items-center gap-2 bg-[#161b22] border border-gray-800 px-3 py-2 rounded-md text-sm hover:bg-[#1f2937] transition-colors whitespace-nowrap">
                <Filter className="w-4 h-4 text-gray-500" />
                Filter
              </button>

              <button className="flex items-center justify-center p-2 bg-[#161b22] border border-gray-800 rounded-md hover:bg-[#1f2937] transition-colors">
                <Share2 className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>
        </div>

        {/* Table Section - Desktop */}
        <div className="hidden lg:block rounded-xl border border-gray-800 bg-[#0d1117] overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[11px] uppercase tracking-wider text-gray-500 border-b border-gray-800 font-semibold">
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Monitor</th>
                <th className="px-6 py-4">Root Cause</th>
                <th className="px-6 py-4 text-center">Comments</th>
                <th className="px-6 py-4">Started</th>
                <th className="px-6 py-4">Resolved</th>
                <th className="px-6 py-4">Duration</th>
                <th className="px-6 py-4">Visibility</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {filteredIncidents.map((incident) => (
                <tr key={incident.id} className="hover:bg-[#161b22]/50 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {incident.end ? (
                      <div className="flex items-center gap-2 text-green-500 font-medium text-sm">
                        <BadgeCheck className="w-4 h-4" />
                        Resolved
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-red-500 font-medium text-sm">
                        <XCircle className="w-4 h-4 animate-pulse" />
                        Active
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-gray-200 font-medium text-sm">
                      {incident.monitor?.name || incident.monitor?.url || `Monitor #${incident.monitorId}`}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center justify-center bg-[#b91c1c] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm min-w-[28px]">
                        {getRootCauseCode(incident.reason)}
                      </span>
                      <span className="text-xs text-gray-400">
                        {getRootCauseText(incident.reason)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center text-xs text-gray-500">
                    <div className="flex items-center justify-center gap-1.5">
                      0
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                    {formatDate(incident.start)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                    {incident.end ? formatDate(incident.end) : "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-400 font-mono">
                    {incident.end ? formatDuration(incident.start, incident.end) : "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-xs text-gray-500 bg-gray-800/30 px-2 py-1 rounded">
                      Included
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Card Section - Mobile */}
        <div className="lg:hidden space-y-4">
          {filteredIncidents.map((incident) => (
            <div key={incident.id} className="bg-[#161b22] border border-gray-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {incident.end ? (
                    <div className="flex items-center gap-1.5 text-green-500 font-semibold text-xs uppercase tracking-tight">
                      <BadgeCheck className="w-3.5 h-3.5" />
                      Resolved
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-red-500 font-semibold text-xs uppercase tracking-tight">
                      <XCircle className="w-3.5 h-3.5 animate-pulse" />
                      Active
                    </div>
                  )}
                </div>
                <span className="text-[10px] text-gray-500 font-mono">#{incident.id}</span>
              </div>

              <div>
                <h3 className="text-gray-200 font-bold text-base mb-1">
                  {incident.monitor?.name || `Monitor #${incident.monitorId}`}
                </h3>
                <p className="text-xs text-gray-500 truncate">{incident.monitor?.url}</p>
              </div>

              <div className="flex items-center gap-3 bg-[#0d1117] p-3 rounded-lg border border-gray-800/50">
                <span className="inline-flex items-center justify-center bg-[#b91c1c] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm min-w-[32px]">
                  {getRootCauseCode(incident.reason)}
                </span>
                <span className="text-xs text-gray-400 font-medium">
                  {getRootCauseText(incident.reason)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-800/50">
                <div>
                  <div className="text-[10px] uppercase text-gray-600 font-bold mb-1">Started</div>
                  <div className="text-[11px] text-gray-400">{formatDate(incident.start).replace(/ GMT\+2$/, '')}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase text-gray-600 font-bold mb-1">Duration</div>
                  <div className="text-[11px] text-gray-200 font-mono">
                    {incident.end ? formatDuration(incident.start, incident.end) : "Ongoing"}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredIncidents.length === 0 && (
          <div className="px-6 py-20 text-center text-gray-500 bg-[#161b22]/30 rounded-xl border border-dashed border-gray-800">
            <div className="flex flex-col items-center gap-2">
              <div className="p-4 bg-gray-800/20 rounded-full">
                <Filter className="w-8 h-8 opacity-20" />
              </div>
              <p className="font-medium">No incidents found matching your criteria.</p>
            </div>
          </div>
        )}

        {/* Pagination Section */}
        {totalPages > 1 && (
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 mt-8">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                className="bg-[#161b22] border-gray-800 hover:bg-[#1f2937] text-xs h-8"
              >
                Previous
              </Button>
              <div className="flex gap-1 overflow-x-auto max-w-[200px] md:max-w-none scrollbar-hide py-1">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`min-w-[32px] h-8 rounded text-xs transition-colors shrink-0 ${page === i + 1
                      ? 'bg-primary text-white font-bold'
                      : 'bg-[#161b22] border border-gray-800 text-gray-500 hover:border-gray-600'
                      }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                disabled={page === totalPages}
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                className="bg-[#161b22] border-gray-800 hover:bg-[#1f2937] text-xs h-8"
              >
                Next
              </Button>
            </div>
            <span className="text-[10px] text-gray-600 uppercase font-bold tracking-widest">
              Page {page} of {totalPages}
            </span>
          </div>
        )}
      </div>

      {/* Floating Chat Button (Mock) */}
      <button className="fixed bottom-6 right-6 p-4 bg-[#161b22] border border-gray-800 rounded-2xl shadow-2xl hover:bg-[#1f2937] transition-all group z-50">
        <MessageSquare className="w-6 h-6 text-white" />
        <div className="absolute top-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0d1117]" />
      </button>
    </div>
  );
}
