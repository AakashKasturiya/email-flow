import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";


export const Form = ({ onSent, setPreviewData }) => {
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const fileInputRef = useRef(null);


// Load template first
useEffect(() => {
  const template = localStorage.getItem("selectedTemplateHTML");
  if (template) {
    setMessage(template);   // Autofill textarea
    localStorage.removeItem("selectedTemplateHTML"); // Clear after use
  }
}, []);

// 🔥 Send data to Preview component without changing design
useEffect(() => {
  setPreviewData({
    to: email,
    subject: subject,
    content: message,
  });
}, [email, subject, message, setPreviewData]);



  const handleFileUpload = (e) => {
    setAttachment(e.target.files[0]);
  };


const handleSend = async () => {
  if (!email || !subject || !message) {
    Swal.fire({
      icon: "warning",
      title: "Missing Fields",
      text: "Please fill all fields before sending.",
      confirmButtonColor: "#3b82f6",
    });
    return;
  }

  if (isSending) return;
  setIsSending(true);

  const formData = new FormData();
  formData.append("to", email);
  formData.append("subject", subject);
  formData.append("text", message);
  if (attachment) formData.append("pdf", attachment);

  try {
    await axios.post("http://localhost:5000/send-email", formData);

    Swal.fire({
      icon: "success",
      title: "Email Sent!",
      text: "Your email has been sent successfully.",
      confirmButtonColor: "#3b82f6",
    });

    if (onSent) onSent();

    setEmail("");
    setSubject("");
    setMessage("");
    setAttachment(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  } catch (err) {
    console.error(err);

    Swal.fire({
      icon: "error",
      title: "Failed",
      text: "There was an error sending email.",
      confirmButtonColor: "#ef4444",
    });
  } finally {
    setIsSending(false);
  }
};

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8 ">
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          
          {/* EMAIL INPUT */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
            <input
              type="email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg  focus:border-transparent"
              placeholder="Enter recipient email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* SUBJECT INPUT */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
            <div className="relative">
              <input
                type="text"
                maxLength={100}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg  focus:border-transparent pr-16"
                placeholder="Enter email subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                {subject.length}/100
              </span>
            </div>
          </div>

          {/* MESSAGE INPUT */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
            <div className="max-w-full overflow-x-auto">

              <textarea
                rows="12"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 resize-none"
                placeholder="Write your email message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              ></textarea>
            </div>
          </div>

          {/* FILE UPLOAD */}
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="w-12 h-12 flex items-center justify-center mx-auto mb-3 text-gray-400">
              <i className="ri-attachment-line ri-2x"></i>
            </div>
            <p className="text-gray-600 mb-2">Click to browse files</p>
            <input
              type="file"
              id="file-upload"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileUpload}
            />

            {/* filename preview */}
            {attachment && (
              <p className="text-sm text-primary mt-2">{attachment.name}</p>
            )}
          </div>

        </form>
      </div>

      {/* SENDING BUTTONS (FOOTER) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4">
        <div className="flex items-center justify-center space-x-4">
          <button
            onClick={handleSend}
            disabled={isSending}
            className="w-64 px-8 py-3 bg-blue-500 text-white rounded-button font-medium hover:bg-opacity-90 transition-colors whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <i className="ri-send-plane-line mr-2"></i>
            {isSending ? "Sending..." : "Send Now"}
          </button>
        </div>
      </div>
    </>
  );
};
