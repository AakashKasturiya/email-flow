import React from "react";

export const Preview = ({ preview }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 ">
      {/* Header with device buttons */}
      <div className="flex items-center justify-between  px-6 py-4 border-b  border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">Email Preview</h3>

      </div>

      {/* Email content section */}
      <div className="bg-white min-h-[24rem] max-h-[60vh] overflow-auto max-w-full">
        {/* Email header */}
        <div className="p-6 border-b border-gray-200">
        <div className=" ">
          <div className="text-sm text-gray-600 mb-1">
            From: singleInterface.com
          </div>
          <div className="text-sm text-gray-600 mb-1">
            To: <span>{preview.to || "recipient@example.com"}</span>
          </div>
          <div className="text-lg font-semibold text-gray-800">
            {preview.subject || "Subject will appear here"}
          </div>
        </div>
         </div>
        {/* Email body */}
        <div
          className="text-gray-800 p-6 max-w-full overflow-x-auto break-words [&_*]:max-w-full [&_img]:h-auto"
          dangerouslySetInnerHTML={{
            __html:
              preview.content ||
              "<p>Your email content will appear here...</p>",
          }}
        ></div>
      </div>
    </div>
  );
};
