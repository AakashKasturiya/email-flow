import { useEffect, useMemo, useState } from "react";
import axios from "axios";

export const EmailLogs = ({ reload }) => {
  const [emails, setEmails] = useState([]);

  const quickStats = useMemo(() => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

    let sentToday = 0;
    let failed = 0;

    for (const e of emails) {
      const d = e?.date ? new Date(e.date) : null;
      if (d && !Number.isNaN(d.getTime()) && d >= startOfToday && d < endOfToday) {
        sentToday += 1;
        const status = (e?.status || "delivered").toString().toLowerCase();
        if (status === "failed") failed += 1;
      }
    }

    const successRate = sentToday === 0 ? 0 : ((sentToday - failed) / sentToday) * 100;
    return {
      sentToday,
      failed,
      successRate,
    };
  }, [emails]);

const fetchEmails = async () => {
    try {
      const res = await axios.get("http://localhost:5000/emails");
      setEmails(res.data);
    } catch (err) {
      console.error("Error fetching emails:", err);
    }
  };

  const clearAllLogs = async () => {
    try {
      await axios.delete("http://localhost:5000/emails");
      setEmails([]);
    } catch (err) {
      console.error("Error clearing emails:", err);
    }
  };

  useEffect(() => {
    fetchEmails();
  }, [reload]);

  const deleteEmailLogs = (id) => {
    const updated = emails.filter((item) => item.id !== id);
    setEmails(updated);
  };

  const getStatusStyles = (status) => {
    switch ((status || "delivered").toString().toLowerCase()) {
      case "delivered":
        return {
          bg: "bg-green-50",
          dot: "bg-green-500",
          title: "Email Delivered",
        };
      case "opened":
        return {
          bg: "bg-blue-50",
          dot: "bg-blue-500",
          title: "Email Opened",
        };
      case "queued":
        return {
          bg: "bg-yellow-50",
          dot: "bg-yellow-500",
          title: "Email Queued",
        };
      case "failed":
        return {
          bg: "bg-red-50",
          dot: "bg-red-500",
          title: "Email Failed",
        };
      default:
        return {
          bg: "bg-green-50",
          dot: "bg-green-500",
          title: "Email Delivered",
        };
    }
  };

  return (
    <aside className="w-full lg:w-80 bg-white p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Activity Log</h3>

          <div className="flex items-center gap-2">
            {emails.length > 0 && (
              <button
                onClick={clearAllLogs}
                className="px-3 py-1.5 text-xs font-medium text-red-600 border border-red-200 hover:bg-red-50 rounded-lg"
              >
                Clear All
              </button>
            )}
            <button
              onClick={fetchEmails}
              className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded"
              aria-label="Refresh"
            >
              <i className="ri-refresh-line"></i>
            </button>
          </div>
        </div>

        <div className="space-y-3 max-h-80 overflow-y-auto">
          {emails.length === 0 ? (
            <p className="text-sm text-gray-600">No Activity Logs</p>
          ) : (
            emails.map((email) => {
              const { bg, dot, title } = getStatusStyles(email.status);

              return (
                <div
                  key={email.id}
                  className={`flex items-start space-x-3 p-3 rounded-lg ${bg}`}
                >
                  <div className={`w-2 h-2 rounded-full mt-2 ${dot}`}></div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800">{title}</p>
                    <p className="text-xs text-gray-600 truncate">
                      {email.to}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(email.date).toLocaleString()}
                    </p>
                  </div>

                  {/* DELETE BUTTON */}
                  <button
                    onClick={() => deleteEmailLogs(email.id)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    <i className="ri-delete-bin-line"></i>
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>

            <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-800 mb-4">Quick Stats</h3>
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Emails sent today</span>
                        <span className="font-semibold text-gray-800">{quickStats.sentToday}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Success rate</span>
                        <span className="font-semibold text-green-600">{quickStats.successRate.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Failed deliveries</span>
                        <span className="font-semibold text-red-600">{quickStats.failed}</span>
                    </div>
                </div>
            </div>
    </aside>
  );
};
