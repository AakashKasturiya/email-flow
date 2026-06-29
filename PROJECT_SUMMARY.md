# Project Summary

**Mailer-Setup** is a full-stack web application for sending emails and managing email templates.

### Architecture
- **Frontend**: React + Vite + Tailwind CSS.
  - Pages: Dashboard, Compose Email, Templates, Contact Lists, Analytics.
  - Routing: React Router.
- **Backend**: Node.js + Express.
  - Database: MongoDB (for templates) and LowDB (for email logs).
  - Key Libraries: `nodemailer` (sending emails), `puppeteer` (PDF generation), `multer` (file uploads).
  - API: RESTful endpoints for templates and email operations.

### Key Features
- **Email Composition**: Rich text editing (inferred from `email.html` prototype) and attachment support.
- **Template Management**: Create, read, update, and delete email templates with image previews.
- **PDF Generation**: Convert emails to PDF.
- **Dashboard**: View email stats (delivered, opened, failed).
