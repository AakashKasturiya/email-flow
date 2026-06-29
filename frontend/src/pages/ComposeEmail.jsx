import React, { useState } from "react";
import { Form } from "../components/Form";
import { Preview } from "../components/Preview";
import { EmailLogs } from "../components/EmailLogs";

export const ComposeEmail = () => {

  const [reload, setReload] = useState(false);

  const [previewData, setPreviewData] = useState({
    to: "",
    subject: "",
    content: "",
  });

  return (
    <>
    <div className="flex flex-col lg:flex-row gap-6"> 
        <div className="w-full lg:w-[75%] overflow-y-auto">
         <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Compose New Email
         </h2>

         <Form 
          onSent={() => setReload(!reload)} 
          setPreviewData={setPreviewData}
         />

         <Preview preview={previewData} />
        </div>
       <div className="w-full lg:w-auto">
         <EmailLogs reload={reload} />
       </div>
     </div>
    </>
  );
}
