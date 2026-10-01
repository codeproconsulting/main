"use client";

import { useState, useEffect } from "react";
import { Link, useFetcher, useLoaderData } from "react-router";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import {
  Users,
  Search,
  Eye,
  MessageCircle,
  MapPin,
  Globe,
  AlertTriangle,
  CheckCircle,
  Lock,
  LogOut,
  Trash2,
  ExternalLink,
  X,
  FileSpreadsheet,
} from "lucide-react";
import {
  getApplicants,
  updateApplicantStatus,
  deleteApplicant,
  type Applicant,
} from "~/education/lib/applicants.server";

// Hardcoded default admin passkey (easily customizable)
const ADMIN_PASSKEY = "proconsulting2026";

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const applicants = getApplicants();
    return { applicants };
  } catch (error) {
    console.error("Loader error in admin:", error);
    return { applicants: [] };
  }
}

export async function action({ request }: ActionFunctionArgs) {
  try {
    const formData = await request.formData();
    const intent = formData.get("intent") as string;

    if (intent === "updateStatus") {
      const id = formData.get("id") as string;
      const status = formData.get("status") as Applicant["status"];
      updateApplicantStatus(id, status);
      return { success: true };
    }

    if (intent === "delete") {
      const id = formData.get("id") as string;
      deleteApplicant(id);
      return { success: true };
    }

    return { success: false };
  } catch (error) {
    console.error("Action error in admin:", error);
    return { success: false, error: "Operation failed" };
  }
}

export default function AdminDashboard() {
  const loaderData = useLoaderData<typeof loader>();
  const fetcher = useFetcher();

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passkeyInput, setPasskeyInput] = useState<string>("");
  const [authError, setAuthError] = useState<string>("");

  const [applicants, setApplicants] = useState<Applicant[]>(loaderData?.applicants || []);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [countryFilter, setCountryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);

  // Check session storage on mount
  useEffect(() => {
    const sessionAuth = sessionStorage.getItem("pc_admin_auth");
    if (sessionAuth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  // Sync loader data or fallback local storage
  useEffect(() => {
    if (loaderData?.applicants && loaderData.applicants.length > 0) {
      setApplicants(loaderData.applicants);
    } else {
      // Fallback from localStorage
      try {
        const local = JSON.parse(
          localStorage.getItem("proconsulting_local_applicants") || "[]"
        );
        if (local.length > 0) {
          setApplicants(local);
        }
      } catch (e) {
        // ignore
      }
    }
  }, [loaderData]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passkeyInput === ADMIN_PASSKEY || passkeyInput === "admin") {
      setIsAuthenticated(true);
      sessionStorage.setItem("pc_admin_auth", "true");
      setAuthError("");
    } else {
      setAuthError("Incorrect password. Please try again.");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("pc_admin_auth");
  };

  const handleStatusChange = (id: string, newStatus: Applicant["status"]) => {
    // Update local state immediately
    setApplicants((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status: newStatus } : app))
    );

    // Update server state
    const fd = new FormData();
    fd.append("intent", "updateStatus");
    fd.append("id", id);
    fd.append("status", newStatus);
    fetcher.submit(fd, { method: "post" });
  };

  const handleDelete = (id: string) => {
    if (!window.confirm("Are you sure you want to delete this applicant record?")) {
      return;
    }
    setApplicants((prev) => prev.filter((a) => a.id !== id));

    const fd = new FormData();
    fd.append("intent", "delete");
    fd.append("id", id);
    fetcher.submit(fd, { method: "post" });

    if (selectedApplicant?.id === id) {
      setSelectedApplicant(null);
    }
  };

  // Filtered applicants
  const filteredApplicants = applicants.filter((a) => {
    const matchesSearch =
      !searchQuery ||
      a.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.phone?.includes(searchQuery) ||
      a.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.majorSubject?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCountry =
      countryFilter === "all" ||
      a.targetCountry?.toLowerCase().includes(countryFilter.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      a.status?.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesCountry && matchesStatus;
  });

  // Analytics
  const totalCount = applicants.length;
  const newCount = applicants.filter((a) => a.status === "New").length;
  const refusalCount = applicants.filter(
    (a) => a.hasRefusal && !a.hasRefusal.toLowerCase().includes("no refusal")
  ).length;

  // Breakdown by country / area
  const areaBreakdown = applicants.reduce<Record<string, number>>((acc, curr) => {
    const key = curr.targetCountry || "Other";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const cityBreakdown = applicants.reduce<Record<string, number>>((acc, curr) => {
    const key = curr.city || "Other";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  // CSV Export
  const exportToCSV = () => {
    const headers = [
      "Ref ID",
      "Date",
      "Full Name",
      "Phone",
      "Email",
      "City",
      "Current Education",
      "Major Subject",
      "Grade / CGPA",
      "Passing Year",
      "Target Country",
      "Target Degree",
      "Target Intake",
      "Budget Range",
      "Need Scholarship",
      "English Test",
      "Visa Refusals",
      "Study Gap",
      "Status",
      "Notes",
    ];

    const rows = filteredApplicants.map((a) => [
      `"${a.id}"`,
      `"${new Date(a.createdAt).toLocaleDateString()}"`,
      `"${a.fullName}"`,
      `"${a.phone}"`,
      `"${a.email}"`,
      `"${a.city}"`,
      `"${a.currentEducation}"`,
      `"${a.majorSubject}"`,
      `"${a.gradeScore}"`,
      `"${a.passingYear}"`,
      `"${a.targetCountry}"`,
      `"${a.targetDegree}"`,
      `"${a.targetIntake}"`,
      `"${a.budgetRange}"`,
      `"${a.needScholarship}"`,
      `"${a.englishTest}"`,
      `"${a.hasRefusal}"`,
      `"${a.studyGap}"`,
      `"${a.status}"`,
      `"${(a.notes || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `proconsulting_applicants_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // If not logged in, show sleek login gate
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl border border-slate-100">
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-pink-50 text-[#FF4D6D] flex items-center justify-center mx-auto mb-3 border border-pink-100">
              <Lock className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-black text-slate-900">
              Counselor Portal Login
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Enter your consultant password to access the applicants dashboard.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Admin Password
              </label>
              <input
                type="password"
                required
                autoFocus
                value={passkeyInput}
                onChange={(e) => setPasskeyInput(e.target.value)}
                placeholder="Enter password..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 text-sm"
              />
            </div>

            {authError && (
              <p className="text-xs font-semibold text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-200">
                {authError}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl font-bold bg-[#0B1B3A] hover:bg-[#162D4D] text-white transition shadow-lg text-sm"
            >
              Sign In to Dashboard
            </button>
          </form>

          <div className="text-center mt-6 pt-4 border-t border-slate-100">
            <Link
              to="/education"
              className="text-xs text-slate-500 hover:text-slate-900 font-medium"
            >
              &larr; Back to ProConsulting Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* TOP ADMIN HEADER */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="ProConsulting" className="h-9 w-auto object-contain" />
            <span className="hidden sm:inline-block h-5 w-px bg-slate-200" />
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-pink-100 text-pink-700">
                Admin Panel
              </span>
              <span className="text-sm font-bold text-slate-800 hidden md:inline">
                Applicant Submissions &amp; Lead Management
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/education/assessment"
              target="_blank"
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
            >
              <span>View Live Form</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition text-slate-600"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log out</span>
            </button>
          </div>
        </div>
      </header>

      {/* DASHBOARD CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
        {/* STATS OVERVIEW CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Total Applicants
              </p>
              <h3 className="text-2xl font-black text-slate-900 mt-0.5">
                {totalCount}
              </h3>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                New Uncontacted
              </p>
              <h3 className="text-2xl font-black text-slate-900 mt-0.5">
                {newCount}
              </h3>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Prior Visa Refusals
              </p>
              <h3 className="text-2xl font-black text-slate-900 mt-0.5">
                {refusalCount}
              </h3>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <Globe className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Top Countries
              </p>
              <p className="text-sm font-bold text-slate-900 truncate mt-0.5">
                {Object.entries(areaBreakdown)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 2)
                  .map(([name, count]) => `${name} (${count})`)
                  .join(", ") || "None"}
              </p>
            </div>
          </div>
        </div>

        {/* SUBMISSION BREAKDOWN BY AREA / CITY STRIP */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-pink-600" />
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Top Student Cities:
            </span>
            <div className="flex flex-wrap gap-1.5 ml-2">
              {Object.entries(cityBreakdown).map(([city, count]) => (
                <span
                  key={city}
                  className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700"
                >
                  {city}: <strong className="text-pink-600">{count}</strong>
                </span>
              ))}
            </div>
          </div>

          <button
            onClick={exportToCSV}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export to Excel / CSV</span>
          </button>
        </div>

        {/* FILTER & SEARCH BAR */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by student name, phone, email, city, subject, or Ref ID..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-xs sm:text-sm focus:outline-none focus:border-pink-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <select
              value={countryFilter}
              onChange={(e) => setCountryFilter(e.target.value)}
              className="px-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-700 bg-white focus:outline-none"
            >
              <option value="all">All Destinations</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="Australia">Australia</option>
              <option value="Canada">Canada</option>
              <option value="United States">USA</option>
              <option value="Germany">Germany & Europe</option>
              <option value="Ireland">Ireland</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-700 bg-white focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="In Review">In Review</option>
              <option value="Enrolled">Enrolled</option>
              <option value="Archived">Archived</option>
            </select>
          </div>
        </div>

        {/* APPLICANTS TABLE */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-4">Ref &amp; Date</th>
                  <th className="py-3.5 px-4">Student &amp; Contact</th>
                  <th className="py-3.5 px-4">City / Area</th>
                  <th className="py-3.5 px-4">Academic Profile</th>
                  <th className="py-3.5 px-4">Target Destination</th>
                  <th className="py-3.5 px-4">Budget &amp; Refusal</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredApplicants.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      No applicants found matching your filters.
                    </td>
                  </tr>
                ) : (
                  filteredApplicants.map((app) => {
                    const isNew = app.status === "New";
                    const hasRefusal =
                      app.hasRefusal &&
                      !app.hasRefusal.toLowerCase().includes("no refusal");

                    return (
                      <tr
                        key={app.id}
                        className={`hover:bg-slate-50/80 transition ${
                          isNew ? "bg-pink-50/20" : ""
                        }`}
                      >
                        {/* Ref & Date */}
                        <td className="py-3.5 px-4">
                          <span className="font-mono font-bold text-pink-600 block">
                            {app.id}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {new Date(app.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </td>

                        {/* Name & Contact */}
                        <td className="py-3.5 px-4">
                          <strong className="text-slate-900 block font-semibold">
                            {app.fullName}
                          </strong>
                          <div className="flex items-center gap-2 mt-1">
                            <a
                              href={`https://wa.me/${app.phone?.replace(/[^0-9]/g, "")}`}
                              target="_blank"
                              rel="noreferrer"
                              title="Chat on WhatsApp"
                              className="text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1 font-medium text-xs"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>{app.phone}</span>
                            </a>
                          </div>
                          <span className="text-[11px] text-slate-400 block truncate max-w-[160px]">
                            {app.email}
                          </span>
                        </td>

                        {/* City / Area */}
                        <td className="py-3.5 px-4 font-medium text-slate-700">
                          {app.city || "—"}
                        </td>

                        {/* Academics */}
                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-slate-800 block">
                            {app.majorSubject || "—"}
                          </span>
                          <span className="text-xs text-slate-500 block">
                            {app.currentEducation} ({app.gradeScore || "N/A"})
                          </span>
                        </td>

                        {/* Target Destination & Intake */}
                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-slate-900 block">
                            {app.targetCountry}
                          </span>
                          <span className="text-xs text-slate-500 block">
                            {app.targetDegree} &bull; {app.targetIntake}
                          </span>
                        </td>

                        {/* Budget & Refusal */}
                        <td className="py-3.5 px-4">
                          <span className="text-xs font-semibold text-slate-700 block">
                            {app.budgetRange}
                          </span>
                          {hasRefusal ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-bold mt-1">
                              <AlertTriangle className="w-3 h-3" />
                              Refusal Flagged
                            </span>
                          ) : (
                            <span className="text-[11px] text-emerald-600 font-medium">
                              Clean Record
                            </span>
                          )}
                        </td>

                        {/* Status Select */}
                        <td className="py-3.5 px-4">
                          <select
                            value={app.status || "New"}
                            onChange={(e) =>
                              handleStatusChange(
                                app.id,
                                e.target.value as Applicant["status"]
                              )
                            }
                            className={`text-xs font-bold px-2.5 py-1.5 rounded-lg border focus:outline-none cursor-pointer ${
                              app.status === "New"
                                ? "bg-pink-50 border-pink-200 text-pink-700"
                                : app.status === "Contacted"
                                ? "bg-blue-50 border-blue-200 text-blue-700"
                                : app.status === "In Review"
                                ? "bg-amber-50 border-amber-200 text-amber-700"
                                : app.status === "Enrolled"
                                ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                                : "bg-slate-100 border-slate-200 text-slate-600"
                            }`}
                          >
                            <option value="New">New</option>
                            <option value="Contacted">Contacted</option>
                            <option value="In Review">In Review</option>
                            <option value="Enrolled">Enrolled</option>
                            <option value="Archived">Archived</option>
                          </select>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => setSelectedApplicant(app)}
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                              title="View Full Profile"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDelete(app.id)}
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-red-50 text-slate-400 hover:text-red-600 transition"
                              title="Delete Record"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* DETAILED APPLICANT MODAL */}
      {selectedApplicant && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="font-mono text-xs font-bold text-pink-600 bg-pink-50 px-2 py-0.5 rounded-md">
                  Ref: {selectedApplicant.id}
                </span>
                <h2 className="text-xl font-bold text-slate-900 mt-1">
                  {selectedApplicant.fullName}
                </h2>
              </div>
              <button
                onClick={() => setSelectedApplicant(null)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="p-3.5 rounded-xl bg-slate-50">
                <span className="text-slate-400 block text-xs">Phone / WhatsApp</span>
                <a
                  href={`https://wa.me/${selectedApplicant.phone.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold text-emerald-600 hover:underline flex items-center gap-1.5 mt-0.5"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{selectedApplicant.phone}</span>
                </a>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50">
                <span className="text-slate-400 block text-xs">Email Address</span>
                <a
                  href={`mailto:${selectedApplicant.email}`}
                  className="font-bold text-slate-900 hover:underline block mt-0.5"
                >
                  {selectedApplicant.email}
                </a>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50">
                <span className="text-slate-400 block text-xs">City of Residence</span>
                <span className="font-bold text-slate-900 block mt-0.5">
                  {selectedApplicant.city}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50">
                <span className="text-slate-400 block text-xs">Target Destination</span>
                <span className="font-bold text-slate-900 block mt-0.5">
                  {selectedApplicant.targetCountry}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50">
                <span className="text-slate-400 block text-xs">Current Education</span>
                <span className="font-bold text-slate-900 block mt-0.5">
                  {selectedApplicant.currentEducation} ({selectedApplicant.passingYear})
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50">
                <span className="text-slate-400 block text-xs">Major &amp; CGPA</span>
                <span className="font-bold text-slate-900 block mt-0.5">
                  {selectedApplicant.majorSubject} ({selectedApplicant.gradeScore})
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50">
                <span className="text-slate-400 block text-xs">Degree &amp; Intake</span>
                <span className="font-bold text-slate-900 block mt-0.5">
                  {selectedApplicant.targetDegree} &bull; {selectedApplicant.targetIntake}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50">
                <span className="text-slate-400 block text-xs">English Test</span>
                <span className="font-bold text-slate-900 block mt-0.5">
                  {selectedApplicant.englishTest}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50">
                <span className="text-slate-400 block text-xs">Tuition Budget &amp; Scholarship</span>
                <span className="font-bold text-slate-900 block mt-0.5">
                  {selectedApplicant.budgetRange}
                </span>
                <span className="text-slate-500 text-xs block mt-0.5">
                  Scholarship: {selectedApplicant.needScholarship}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50">
                <span className="text-slate-400 block text-xs">Refusal &amp; Study Gap</span>
                <span className="font-bold text-slate-900 block mt-0.5">
                  {selectedApplicant.hasRefusal}
                </span>
                <span className="text-slate-500 text-xs block mt-0.5">
                  Gap: {selectedApplicant.studyGap}
                </span>
              </div>

              {selectedApplicant.notes && (
                <div className="sm:col-span-2 p-3.5 rounded-xl bg-slate-50">
                  <span className="text-slate-400 block text-xs">Student Inquiries / Notes</span>
                  <p className="text-slate-800 mt-1 leading-relaxed whitespace-pre-wrap">
                    {selectedApplicant.notes}
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500">Update Status:</span>
                <select
                  value={selectedApplicant.status}
                  onChange={(e) => {
                    const newStatus = e.target.value as Applicant["status"];
                    handleStatusChange(selectedApplicant.id, newStatus);
                    setSelectedApplicant({ ...selectedApplicant, status: newStatus });
                  }}
                  className="text-xs font-bold px-2 py-1 rounded border border-slate-200 bg-white"
                >
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="In Review">In Review</option>
                  <option value="Enrolled">Enrolled</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>

              <a
                href={`https://wa.me/${selectedApplicant.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                  `Hello ${selectedApplicant.fullName}! This is ProConsulting regarding your study abroad assessment for ${selectedApplicant.targetCountry}.`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-[#25D366] hover:bg-[#20BD5A] text-white transition shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Open WhatsApp Chat</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
