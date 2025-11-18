import "./App.scss";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/Home";
import AboutPage from "./pages/About";
import ASLReferencePage from "./pages/ASLReference";
import PlayPage from "./pages/Play";
import ProfilePage from "./pages/Profile";
import NotFoundPage from "./pages/NotFound";
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
          <Route path="/play" element={<PlayPage />} />
          {/* Consider using dynamic page names for user profiles. */}
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<NotFoundPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </Layout>
    </Router>
  );
}