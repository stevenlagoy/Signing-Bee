import "./App.scss";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import HomePage from "./pages/Home/Home";
import AboutPage from "./pages/About/About";
import ASLReferencePage from "./pages/ASLReference/ASLReference";
import PracticePage from "./pages/Practice/Practice";
import ProfilePage from "./pages/Profile/Profile";
import NotFoundPage from "./pages/NotFound/NotFound";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";

const Layout = ({ children }) => (
  <div className="screen">
    <Header />
    <main>
      {children}
    </main>
    <Footer />
  </div>
);

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/asl-reference" element={<ASLReferencePage />} />
          <Route path="/practice" element={<PracticePage />} />
          {/* Consider using dynamic page names for user profiles. */}
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<NotFoundPage />} />
          <Route path ="/login" element={<Login />} />
          <Route path ="/signup" element={<Signup />} />
        </Routes>
      </Layout>
    </Router>
  );
}