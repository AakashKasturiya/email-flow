import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export const Dashboard = () => {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const res = await axios.get("http://localhost:5000/emails");
        setEmails(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchEmails();
  }, []);

  const stats = useMemo(() => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

    let sentToday = 0;
    let failedToday = 0;

    for (const e of emails) {
      const d = e?.date ? new Date(e.date) : null;
      if (!d || Number.isNaN(d.getTime())) continue;

      if (d >= startOfToday && d < endOfToday) {
        sentToday += 1;
        const status = (e?.status || "delivered").toString().toLowerCase();
        if (status === "failed") failedToday += 1;
      }
    }

    const successRate = sentToday === 0 ? 0 : ((sentToday - failedToday) / sentToday) * 100;
    return {
      sentToday,
      failedToday,
      successRate,
      total: emails.length,
    };
  }, [emails]);

  const recent = useMemo(() => {
    return [...emails]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 8);
  }, [emails]);

  if (loading) {
    return <div className="text-sm text-gray-600">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="text-sm text-red-600">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-600 mt-1">Overview of your recent email activity.</p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/compose"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-900 text-white text-sm font-medium hover:bg-gray-800"
          >
            <i className="ri-edit-line" />
            Compose
          </Link>
          <Link
            to="/templates"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-800 hover:bg-gray-50"
          >
            <i className="ri-file-text-line" />
            Templates
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">Sent today</div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <i className="ri-send-plane-2-line" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-gray-900">{stats.sentToday}</div>
          <div className="mt-1 text-xs text-gray-500">Emails sent since midnight</div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">Success rate</div>
            <div className="w-10 h-10 rounded-xl bg-green-50 text-green-700 flex items-center justify-center">
              <i className="ri-shield-check-line" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-gray-900">{stats.successRate.toFixed(1)}%</div>
          <div className="mt-1 text-xs text-gray-500">Based on today’s sends</div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">Failed today</div>
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <i className="ri-error-warning-line" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-gray-900">{stats.failedToday}</div>
          <div className="mt-1 text-xs text-gray-500">Needs attention</div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">Total logs</div>
            <div className="w-10 h-10 rounded-xl bg-gray-50 text-gray-700 flex items-center justify-center">
              <i className="ri-inbox-archive-line" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-gray-900">{stats.total}</div>
          <div className="mt-1 text-xs text-gray-500">All-time activity logs</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200">
          <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Recent activity</h2>
            <span className="text-xs text-gray-500">Last {recent.length} items</span>
          </div>
          <div className="p-5">
            {recent.length === 0 ? (
              <div className="text-sm text-gray-600">No activity yet. Send an email to see logs here.</div>
            ) : (
              <div className="space-y-3">
                {recent.map((e) => {
                  const status = (e?.status || "delivered").toString().toLowerCase();
                  const badge =
                    status === "failed"
                      ? "bg-red-50 text-red-700"
                      : status === "queued"
                      ? "bg-yellow-50 text-yellow-700"
                      : status === "opened"
                      ? "bg-blue-50 text-blue-700"
                      : "bg-green-50 text-green-700";

                  return (
                    <div key={e.id} className="flex items-start justify-between gap-3 p-4 rounded-xl border border-gray-200">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-medium px-2 py-1 rounded-lg ${badge}`}>{status}</span>
                          <div className="text-sm font-semibold text-gray-900 truncate">{e.subject || "(no subject)"}</div>
                        </div>
                        <div className="text-xs text-gray-600 mt-1 truncate">To: {e.to}</div>
                      </div>
                      <div className="text-xs text-gray-500 whitespace-nowrap">{e.date ? new Date(e.date).toLocaleString() : "—"}</div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200">
          <div className="px-5 py-4 border-b border-gray-200">
            <h2 className="font-semibold text-gray-900">Quick actions</h2>
          </div>
          <div className="p-5 space-y-3">
            <Link
              to="/compose"
              className="flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <i className="ri-edit-line" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900">Compose email</div>
                  <div className="text-xs text-gray-600">Write and send a new email</div>
                </div>
              </div>
              <i className="ri-arrow-right-line text-gray-400" />
            </Link>

            <Link
              to="/templates"
              className="flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                  <i className="ri-file-text-line" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900">Browse templates</div>
                  <div className="text-xs text-gray-600">Pick a ready-to-use template</div>
                </div>
              </div>
              <i className="ri-arrow-right-line text-gray-400" />
            </Link>

            <a
              href="http://localhost:5000/emails"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gray-50 text-gray-700 flex items-center justify-center">
                  <i className="ri-code-s-slash-line" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900">Open logs API</div>
                  <div className="text-xs text-gray-600">View raw email logs JSON</div>
                </div>
              </div>
              <i className="ri-external-link-line text-gray-400" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
