import { Routes, Route, BrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import ASLReference from "./pages/ASLReference";
import Learn from "./pages/Practice";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Header from "./components/Header";
import Footer from "./components/Footer";
import styles from "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <div className="screen">
        <Header />
        <main className={styles.main}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/asl-reference" element={<ASLReference />} />
            <Route path="/practice" element={<Learn />} />
            {/* Consider using those dynamic page names we talked about on the 15th for user profiles. */}
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}