import {Layout} from './layout/Layout';
import { EmailSender } from "./pages/EmailSender";
import { Routes, Route } from "react-router-dom";
import { Dashboard } from "./pages/Dashboard";
import { ComposeEmail } from './pages/ComposeEmail';
import { Templates } from './pages/Templates';

export default function App() {
  return (
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="compose" element={<ComposeEmail />} />
          <Route path="templates" element={<Templates />} />
        </Route>
      </Routes>
  );
}
