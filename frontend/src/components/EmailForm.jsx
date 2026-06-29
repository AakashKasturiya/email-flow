import { useState } from "react";
import axios from "axios";
// import "../styles.css";

export const EmailForm = ({ onSent }) => {
  const [email, setEmail] = useState("aakashkasturiya@gmail.com");
  const [subject, setSubject] = useState("test");
  const [html, setHtml] = useState("");
  const [attachment, setAttachment] = useState(null);

  const handleSend = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("to", email);
    formData.append("subject", subject);
    formData.append("text", html);
    if (attachment) formData.append("pdf", attachment);

    try {
      await axios.post("http://localhost:5000/send-email", formData);
      alert("Email Sent!");
      onSent();
    } catch (err) {
      console.log(err);
      alert("Error sending email");
    }
  };

  return (
    <>
      <form className="email-form" onSubmit={handleSend}>
        <input
          type="email"
          placeholder="Recipient Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
        />

        <textarea
          placeholder="Write your HTML Email content"
          value={html}
          onChange={(e) => setHtml(e.target.value)}
          rows="10"
          required
        ></textarea>

        <input type="file" onChange={(e) => setAttachment(e.target.files[0])} />
        <button type="submit">Send Email</button>
      </form>
     {html && (
      <div className="email-preview" style={{ marginTop: "20px" }}>
        <h3>Email Preview:</h3>
        <div
          className="preview-box"
          style={{ border: "1px solid #ccc", padding: "10px" }}
          dangerouslySetInnerHTML={{ __html: html }}
        ></div>
      </div>
      )}
    </>
  );
}
