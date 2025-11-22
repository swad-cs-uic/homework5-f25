import Challenge1 from "./components/Challenge1";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Challenge2 from "./components/Challenge2";
import Challenge3 from "./components/Challenge3";
import Challenge4 from "./components/Challenge4";
import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<Challenge1 />} />
        <Route path="/challenge2" element={<Challenge2 />} />
        <Route path="/challenge3" element={<Challenge3 />} />
        <Route path="/challenge4" element={<Challenge4 />} />
      </Routes>
    </BrowserRouter>
  );
}
