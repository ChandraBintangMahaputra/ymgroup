import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App.tsx";
import Login from "./components/landing-page/auth-page/Login.tsx";
import Beranda from "./components/landing-page/admin/Beranda.tsx";
import Payment from "./components/landing-page/admin/Payment.tsx";
import Data from "./components/landing-page/admin/Data.tsx";
import { SidebarProvider } from "./contexts/SidebarContext.tsx";
import "./index.css";
import Student from "./components/landing-page/admin/Student.tsx";
import ProgressPanitia from "./components/landing-page/admin/ProgressPanitia.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <SidebarProvider>
      <Router basename="/">
        <Routes>
          <Route path="/admin/login" element={<Login />} />
          <Route path="/" element={<App />} />
          <Route path="/admin/beranda" element={<Beranda />} />
          <Route path="/admin/payment" element={<Payment />} />
          <Route path="/admin/data" element={<Data />} />
          <Route path="/admin/students" element={<Student />} />
          <Route path="/progress" element={<ProgressPanitia />} />
        </Routes>
      </Router>
    </SidebarProvider>
  </React.StrictMode>
);
