import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import "../styles/globals.css";

export default function PanelLayout({ children }) {
  return (
    <div className="panel-layout">
      <Sidebar />
      <div className="panel-main">
        <Navbar />
        <div className="panel-content">{children}</div>
      </div>
    </div>
  );
}
