import AppRouter from "./routes/AppRouter";
import { AuthProvider } from "./context/AuthContext";
import "leaflet/dist/leaflet.css";

export default function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}