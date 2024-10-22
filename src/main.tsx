// import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App.tsx";
import Login from "./components/landing-page/auth-page/Login.tsx";
import { SidebarProvider } from "./contexts/SidebarContext.tsx";
import "./index.css";
import Register from "./components/landing-page/auth-page/Register.tsx";
import { VerifyEmail } from "./components/landing-page/auth-page/VerifyEmail.tsx";
import { EmailConfirmed } from "./components/landing-page/auth-page/EmailConfirmed.tsx";
import ResetPassword from "./components/landing-page/auth-page/ResetPassword.tsx";
import MasterAuthorization from "./components/landing-page/superadmin-scaleup/MasterAuthorization.tsx";
import Beranda from "./components/landing-page/superadmin-scaleup/Beranda.tsx";
import MasterFaculty from "./components/landing-page/superadmin-scaleup/MasterFaculty.tsx";
import MasterProdi from "./components/landing-page/superadmin-scaleup/MasterProdi.tsx";
import MasterRole from "./components/landing-page/superadmin-scaleup/MasterRole.tsx";
import Discussion from "./components/landing-page/user-scaleup/Discussion.tsx";
import ListArticle from "./components/landing-page/user-scaleup/ListArticle.tsx";
import AddArticle from "./components/landing-page/user-scaleup/AddArticle.tsx";
import EditArticle from "./components/landing-page/user-scaleup/EditArticle.tsx";
import DisplayArticle from "./components/landing-page/user-scaleup/DisplayArticle.tsx";
import ViewArticle from "./components/landing-page/user-scaleup/ViewArticle.tsx";
import { DarkModeProvider } from "./constants/DarkModeProvider.tsx";
import ListCourse from "./components/landing-page/user-scaleup/ListCourse.tsx";
import AddCourse from "./components/landing-page/user-scaleup/AddCourse.tsx";
import EditCourse from "./components/landing-page/user-scaleup/EditCourse.tsx";
import AddCourseMenu from "./components/landing-page/user-scaleup/AddCourseMenu.tsx";
import SubMenu from "./components/landing-page/user-scaleup/ListSubMenu.tsx";
import AddCourseSubMenu from "./components/landing-page/user-scaleup/AddCourseSubMenu.tsx";
import EditSubMenu from "./components/landing-page/user-scaleup/EditSubMenu.tsx";
import DisplayCourse from "./components/landing-page/user-scaleup/DisplayCourse.tsx";
import ViewCourse from "./components/landing-page/user-scaleup/ViewCourse.tsx";
import RegisterNonIpb from "./components/landing-page/auth-page/RegisterNonIpb.tsx";
import Profile from "./components/landing-page/user-scaleup/Profile.tsx";
import Setting from "./components/landing-page/user-scaleup/Setting.tsx";
import ReportArticle from "./components/landing-page/superadmin-scaleup/ReportArticle.tsx";
import ReportCourse from "./components/landing-page/superadmin-scaleup/ReportCourse.tsx";
import ReportDiscuss from "./components/landing-page/superadmin-scaleup/ReportDiscuss.tsx";
import Reportcomment from "./components/landing-page/superadmin-scaleup/ReportComment.tsx";
import ReportReplyComment from "./components/landing-page/superadmin-scaleup/ReportReplyComment.tsx";
import Report from "./components/landing-page/superadmin-scaleup/Report.tsx";
import DetailReport from "./components/landing-page/superadmin-scaleup/DetailReport.tsx";
import SendEmailReport from "./components/landing-page/superadmin-scaleup/SendEmail.tsx";
import AddSendEmail from "./components/landing-page/superadmin-scaleup/AddSendEmail.tsx";
import TokenAdmin from "./components/landing-page/superadmin-scaleup/TokenAdmin.tsx";
import AddCourseQuiz from "./components/landing-page/user-scaleup/AddQuizMenu.tsx";
import DetailCourse from "./components/landing-page/user-scaleup/DetailCourse.tsx";
import ListQuizQuestion from "./components/landing-page/user-scaleup/ListQuizQuestion.tsx";
import AddQuestion from "./components/landing-page/user-scaleup/AddQuestion.tsx";
import EditQuestion from "./components/landing-page/user-scaleup/EditQuestion.tsx";
import ListQuizCourse from "./components/landing-page/user-scaleup/ListQuizCourse.tsx";
import QuizIntro from "./components/landing-page/user-scaleup/IntroQuiz.tsx";
import StartQuiz from "./components/landing-page/user-scaleup/StartQuiz.tsx";
import ProtectedRoute from "./components/landing-page/auth-page/ProtectedRoute.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
    <SidebarProvider>
      <DarkModeProvider> {/* Membungkus dengan DarkModeProvider */}
        <Router basename="/">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<App />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/email-confirm/:id" element={<EmailConfirmed />} />
            <Route path="/reset-password/:id" element={<ResetPassword />} />
            <Route path="/register-non-ipb" element={<RegisterNonIpb />} />


            <Route path="/beranda" element={<ProtectedRoute><Beranda /></ProtectedRoute>} />

            <Route path="/master-authorization" element={<ProtectedRoute><MasterAuthorization /></ProtectedRoute>} />
            <Route path="/master-role" element={<ProtectedRoute><MasterRole /></ProtectedRoute>} />
            <Route path="/master-faculty" element={<ProtectedRoute><MasterFaculty /></ProtectedRoute>} />
            <Route path="/master-prodi" element={<ProtectedRoute><MasterProdi /></ProtectedRoute>} />

            <Route path="/discussion" element={<ProtectedRoute><Discussion /></ProtectedRoute>} />

            <Route path="/list-article" element={<ProtectedRoute><ListArticle /></ProtectedRoute>} />
            <Route path="/add-article" element={<ProtectedRoute><AddArticle /></ProtectedRoute>} />
            <Route path="/edit-article/:id" element={<ProtectedRoute><EditArticle /></ProtectedRoute>} />
            <Route path="/display-article" element={<ProtectedRoute><DisplayArticle /></ProtectedRoute>} />
            <Route path="/view-article/:id" element={<ProtectedRoute><ViewArticle /></ProtectedRoute>} />

            <Route path="/list-course" element={<ProtectedRoute><ListCourse /></ProtectedRoute>} />
            <Route path="/add-course" element={<ProtectedRoute><AddCourse /></ProtectedRoute>} />
            <Route path="/edit-course/:id" element={<ProtectedRoute><EditCourse /></ProtectedRoute>} />
            <Route path="/menu-course/:id" element={<ProtectedRoute><AddCourseMenu /></ProtectedRoute>} />
            <Route path="/sub-menu-course/:id" element={<ProtectedRoute><SubMenu /></ProtectedRoute>} />
            <Route path="/add-submenu/:id" element={<ProtectedRoute><AddCourseSubMenu /></ProtectedRoute>} />
            <Route path="/edit-submenu/:id" element={<ProtectedRoute><EditSubMenu /></ProtectedRoute>} />
            <Route path="/display-course" element={<ProtectedRoute><DisplayCourse /></ProtectedRoute>} />
            <Route path="/view-course/:id" element={<ProtectedRoute><ViewCourse /></ProtectedRoute>} />

            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/setting" element={<ProtectedRoute><Setting /></ProtectedRoute>} />

            <Route path="/report-article" element={<ProtectedRoute><ReportArticle /></ProtectedRoute>} />
            <Route path="/report-course" element={<ProtectedRoute><ReportCourse /></ProtectedRoute>} />
            <Route path="/report-discuss" element={<ProtectedRoute><ReportDiscuss /></ProtectedRoute>} />
            <Route path="/report-comment/:id" element={<ProtectedRoute><Reportcomment /></ProtectedRoute>} />
            <Route path="/report-reply-comment/:id" element={<ProtectedRoute><ReportReplyComment /></ProtectedRoute>} />
            <Route path="/report-pelanggaran" element={<ProtectedRoute><Report /></ProtectedRoute>} />
            <Route path="/detail-report/:id" element={<ProtectedRoute><DetailReport /></ProtectedRoute>} />
            <Route path="/send-email" element={<ProtectedRoute><SendEmailReport /></ProtectedRoute>} />
            <Route path="/add-send-email" element={<ProtectedRoute><AddSendEmail /></ProtectedRoute>} />
            <Route path="/generate-token-admin" element={<ProtectedRoute><TokenAdmin /></ProtectedRoute>} />

            <Route path="/quiz-course/:id" element={<ProtectedRoute><AddCourseQuiz /></ProtectedRoute>} />
            <Route path="/detail/:id" element={<ProtectedRoute><DetailCourse /></ProtectedRoute>} />
            <Route path="/list-question/:id" element={<ProtectedRoute><ListQuizQuestion /></ProtectedRoute>} />
            <Route path="/add-question/:id" element={<ProtectedRoute><AddQuestion /></ProtectedRoute>} />
            <Route path="/edit-question/:id" element={<ProtectedRoute><EditQuestion /></ProtectedRoute>} />
            <Route path="/list-quiz-course/:id" element={<ProtectedRoute><ListQuizCourse /></ProtectedRoute>} />
            <Route path="/quiz-intro/:id" element={<ProtectedRoute><QuizIntro /></ProtectedRoute>} />
            <Route path="/start-quiz/:id" element={<ProtectedRoute><StartQuiz /></ProtectedRoute>} />


            
          </Routes>
        </Router>
      </DarkModeProvider>
    </SidebarProvider>
  // </React.StrictMode>
);
