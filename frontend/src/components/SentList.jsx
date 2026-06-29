import { useEffect, useState } from "react";
import axios from "axios";

export const SentList = ({ reload }) => {
  const [emails, setEmails] = useState([]);

  const fetchEmails = async () => {
    try {
      const res = await axios.get("http://localhost:5000/emails");
      setEmails(res.data);
    } catch (err) {
      console.error("Error fetching emails:", err);
    }
  };

  useEffect(() => {
    fetchEmails();
  }, [reload]);

  const deleteEmailLogs = (id) =>{
    const delteLogs = emails.filter((item)=> item.id !== id)
    setEmails(delteLogs);
 
  }

  return (
    <div className="sent-list">
      {emails.length === 0 ? (
        <p>No sent emails yet.</p>
      ) : (
        emails.map((email) => (
          <div className="email-card" key={email.id}>
            <button onClick={()=>deleteEmailLogs(email.id)}>delete</button>
            <p><strong>To:</strong> {email.to}</p>
            <p><strong>Subject:</strong> {email.subject}</p>
            <p><strong>Date:</strong> {new Date(email.date).toLocaleString()}</p>

            <a
              href={`http://localhost:5000/download-email-pdf?id=${email.id}`}
              target="_blank"
              rel="noreferrer"
            >
              Download PDF
            </a>
          </div>
        ))
      )}
    </div>
  );
};
