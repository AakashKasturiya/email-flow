import React, { useMemo, useState, useEffect } from "react";
import axios from "axios";

export const Templates = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");

  useEffect(() => {
    // Fetch templates from backend
    const fetchTemplates = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/templates");
        setTemplates(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load templates");
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  const categories = useMemo(() => {
    const set = new Set();
    for (const t of templates) {
      if (t?.category) set.add(String(t.category));
    }
    return ["all", ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [templates]);

  const filteredTemplates = useMemo(() => {
    const q = query.trim().toLowerCase();
    return templates.filter((t) => {
      const matchesCategory = category === "all" ? true : String(t?.category || "") === category;
      if (!matchesCategory) return false;

      if (!q) return true;
      const title = String(t?.title || "").toLowerCase();
      const desc = String(t?.description || "").toLowerCase();
      const cat = String(t?.category || "").toLowerCase();
      return title.includes(q) || desc.includes(q) || cat.includes(q);
    });
  }, [templates, query, category]);

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <div className="h-7 w-48 bg-gray-200 rounded-md animate-pulse" />
            <div className="h-4 w-72 bg-gray-200 rounded-md animate-pulse mt-2" />
          </div>
          <div className="h-10 w-56 bg-gray-200 rounded-lg animate-pulse" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="h-36 bg-gray-200 animate-pulse" />
              <div className="p-4">
                <div className="h-4 w-20 bg-gray-200 rounded-md animate-pulse" />
                <div className="h-5 w-40 bg-gray-200 rounded-md animate-pulse mt-3" />
                <div className="h-4 w-full bg-gray-200 rounded-md animate-pulse mt-2" />
                <div className="h-4 w-2/3 bg-gray-200 rounded-md animate-pulse mt-2" />
                <div className="h-9 w-full bg-gray-200 rounded-lg animate-pulse mt-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="max-w-xl mx-auto bg-white border border-red-200 rounded-2xl p-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <i className="ri-error-warning-line text-xl" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-900">Templates couldn’t be loaded</h2>
              <p className="text-sm text-gray-600 mt-1">{error}</p>
              <button
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-800"
                onClick={() => window.location.reload()}
              >
                <i className="ri-refresh-line" />
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Email Templates</h2>
          <p className="text-sm text-gray-600 mt-1">
            Browse templates, preview HTML, and load one into the compose editor.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <div className="relative w-full sm:w-72">
            <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search templates..."
              className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300"
            />
          </div>

          <div className="w-full sm:w-56">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c === "all" ? "All categories" : c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-gray-600">
          Showing <span className="font-semibold text-gray-900">{filteredTemplates.length}</span> of{" "}
          <span className="font-semibold text-gray-900">{templates.length}</span>
        </div>

        <button
          className="hidden sm:inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-800 hover:bg-gray-50"
          onClick={() => {
            setQuery("");
            setCategory("all");
          }}
        >
          <i className="ri-filter-off-line" />
          Reset
        </button>
      </div>

      {/* GRID */}
      {filteredTemplates.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-gray-50 text-gray-700 flex items-center justify-center">
            <i className="ri-inbox-2-line text-2xl" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-gray-900">No templates found</h3>
          <p className="mt-1 text-sm text-gray-600">Try a different search or reset your filters.</p>
          <button
            className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-900 text-white text-sm font-medium hover:bg-gray-800"
            onClick={() => {
              setQuery("");
              setCategory("all");
            }}
          >
            <i className="ri-refresh-line" />
            Reset filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((item) => (
            <div
              key={item._id}
              className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg hover:shadow-gray-900/5 transition-shadow"
              data-category={item.category}
            >
              <div className="relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full" />
                )}

                <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/55 via-black/20 to-transparent">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-lg bg-white/10 text-white text-xs font-medium backdrop-blur capitalize">
                      {item.category || "uncategorized"}
                    </span>
                    <button
                      onClick={() => setSelectedTemplate(item)}
                      className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-white/10 text-white text-xs font-medium backdrop-blur hover:bg-white/15"
                    >
                      <i className="ri-eye-line" />
                      Preview
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-gray-900 capitalize leading-snug">
                  {item.title}
                </h3>

                <p className="text-sm text-gray-600 mt-2 line-clamp-2 min-h-[2.5rem]">
                  {item.description || "No description provided."}
                </p>

                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="inline-flex items-center gap-1">
                      <i className="ri-bar-chart-2-line" />
                      Used {item.usedCount || 0}
                    </span>
                    <span className="text-gray-300">|</span>
                    <span className="inline-flex items-center gap-1">
                      <i className="ri-time-line" />
                      {item.updatedAt ? new Date(item.updatedAt).toLocaleDateString() : "—"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-4">
                  <button
                    className="flex-1 px-3 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-medium hover:bg-gray-800"
                    onClick={() => {
                      localStorage.setItem("selectedTemplateHTML", item.html);
                      window.location.href = "http://localhost:5173/compose";
                    }}
                  >
                    Use Template
                  </button>

                  <button
                    className="w-10 h-10 inline-flex items-center justify-center rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50"
                    onClick={() => setSelectedTemplate(item)}
                    aria-label="Preview template"
                  >
                    <i className="ri-eye-line" />
                  </button>

                </div>
              </div>
            </div>
          ))}
        </div>
      )}


{/* TEMPLATE PREVIEW MODAL */}
{selectedTemplate && (
  <div
    className="fixed inset-0 bg-black/45 flex items-center justify-center p-4 sm:p-6 z-50"
    onClick={() => setSelectedTemplate(null)}
  >
    <div
      className="bg-white w-full max-w-4xl rounded-2xl shadow-xl overflow-hidden max-h-[92vh] flex flex-col"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="px-5 sm:px-6 py-4 border-b border-gray-200 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 capitalize truncate">
            {selectedTemplate.title}
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 mt-0.5 truncate">
            {selectedTemplate.category || "uncategorized"}
          </p>
        </div>
        <button
          onClick={() => setSelectedTemplate(null)}
          className="w-10 h-10 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 inline-flex items-center justify-center"
          aria-label="Close"
        >
          <i className="ri-close-line text-xl" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-5 bg-gray-50">
        <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5">
          <div
            dangerouslySetInnerHTML={{ __html: selectedTemplate.html }}
            className="prose max-w-none max-w-full overflow-x-auto break-words [&_*]:max-w-full [&_img]:h-auto"
          />
        </div>
      </div>

      <div className="px-5 sm:px-6 py-4 border-t border-gray-200 bg-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="text-xs sm:text-sm text-gray-600">
          This will load the HTML into your compose editor.
        </div>
        <div className="flex items-center gap-2 justify-end">
          <button
            className="px-4 py-2 rounded-xl border border-gray-200 text-gray-800 text-sm font-medium hover:bg-gray-50"
            onClick={() => setSelectedTemplate(null)}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
            onClick={() => {
              localStorage.setItem("selectedTemplateHTML", selectedTemplate.html);
              window.location.href = "http://localhost:5173/compose";
            }}
          >
            Select Template
          </button>
        </div>
      </div>
    </div>
  </div>
)}

    </div>
  );
};
