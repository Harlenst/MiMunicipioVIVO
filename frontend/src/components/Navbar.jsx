// import React, { useState, useEffect, useRef } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import Notificaciones from "./Notificaciones";
// import { useAuth } from "../context/AuthContext";
// import { useNavigate } from "react-router-dom";
// import {
//   FaHome,
//   FaChartBar,
//   FaListAlt,
//   FaCog,
//   FaComments,
//   FaSignInAlt,
//   FaSignOutAlt,
//   FaBars,
//   FaTimes,
//   FaSearch,
// } from "react-icons/fa";
// import { NavLink } from "react-router-dom";

// const Navbar = () => {
//   const { user, logout } = useAuth();
//   const [menuAbierto, setMenuAbierto] = useState(false);
//   const [busqueda, setBusqueda] = useState("");
//   const [sidebarAbierto, setSidebarAbierto] = useState(false);
//   const navigate = useNavigate();
//   const sidebarRef = useRef(null);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
//         setSidebarAbierto(false);
//       }
//     };

//     if (sidebarAbierto) {
//       document.addEventListener("mousedown", handleClickOutside);
//       return () => document.removeEventListener("mousedown", handleClickOutside);
//     }
//   }, [sidebarAbierto]);

//   const handleLogout = () => {
//     logout();
//     navigate("/login");
//     setSidebarAbierto(false);
//   };

//   const handleSearch = (e) => {
//     setBusqueda(e.target.value);
//   };

//   const sidebarLinks = [
//     { to: "/", icon: <FaHome size={20} />, label: "Inicio" },
//     { to: "/panel/reportes", icon: <FaListAlt size={20} />, label: "Reportes" },
//     { to: "/panel/estadisticas", icon: <FaChartBar size={20} />, label: "Estadísticas" },
//     { to: "/panel/configuracion", icon: <FaCog size={20} />, label: "Configuración" },
//     { to: "/panel/chat/1", icon: <FaComments size={20} />, label: "Chat" },
//   ];

//   const sidebarVariants = {
//     hidden: { x: "-100%" },
//     visible: { x: 0, transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] } },
//     exit: { x: "-100%", transition: { duration: 0.2, ease: "easeInOut" } },
//   };

//   return (
//     <>
//       <AnimatePresence>
//         {sidebarAbierto && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
//             onClick={() => setSidebarAbierto(false)}
//           />
//         )}
//       </AnimatePresence>

//       <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-800 text-white border-b border-gray-700 shadow-md">
//         <div className="flex items-center justify-between px-4 md:px-8 h-16">
//           <div className="flex items-center gap-3">
//             <button
//               className="p-2 rounded-full text-white hover:bg-gray-700 focus:ring-2 focus:ring-blue-400 transition z-50"
//               onClick={() => setSidebarAbierto(!sidebarAbierto)}
//               aria-label="Toggle menú lateral"
//             >
//               {sidebarAbierto ? <FaTimes size={20} /> : <FaBars size={20} />}
//             </button>
//             <h3
//               onClick={() => {
//                 navigate("/");
//                 setSidebarAbierto(false);
//               }}
//               className="text-xl font-semibold cursor-pointer select-none"
//             >
//               🏛️ Mi Municipio Vivo
//             </h3>
//           </div>

//           <div className="hidden md:flex flex-1 justify-center max-w-2xl">
//             <div className="flex items-center w-full max-w-lg bg-gray-700 rounded-full px-4 py-2 focus-within:ring-2 focus-within:ring-blue-400 transition">
//               <FaSearch className="text-gray-300 mr-2" />
//               <input
//                 type="text"
//                 placeholder="Buscar reportes, usuarios o lugares..."
//                 className="bg-transparent outline-none w-full text-sm text-white"
//                 value={busqueda}
//                 onChange={handleSearch}
//               />
//             </div>
//           </div>

//           <div className="flex items-center gap-4">
//             <Notificaciones />
//             <div className="relative">
//               <button
//                 onClick={() => setMenuAbierto(!menuAbierto)}
//                 className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-gray-700 focus:ring-2 focus:ring-blue-400 transition"
//                 aria-expanded={menuAbierto}
//                 aria-label="Menú de usuario"
//               >
//                 <FaUserCircle className="text-blue-300 text-2xl" />
//                 <span className="hidden md:inline text-white font-medium">
//                   {user ? user.nombre || user.correo || "Invitado" : "Invitado"}
//                 </span>
//               </button>

//               <AnimatePresence>
//                 {menuAbierto && (
//                   <motion.div
//                     initial={{ opacity: 0, y: -10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0, y: -10 }}
//                     className="absolute right-0 mt-2 w-56 bg-gray-800 border border-gray-700 shadow-lg rounded-lg py-2"
//                   >
//                     {user ? (
//                       <>
//                         <button
//                           onClick={() => {
//                             navigate("/panel/perfil");
//                             setMenuAbierto(false);
//                           }}
//                           className="w-full text-left px-4 py-2 hover:bg-gray-700 text-white transition"
//                         >
//                           👤 Ver perfil
//                         </button>
//                         <button
//                           onClick={() => {
//                             navigate("/panel/mis-reportes");
//                             setMenuAbierto(false);
//                           }}
//                           className="w-full text-left px-4 py-2 hover:bg-gray-700 text-white transition"
//                         >
//                           📝 Mis reportes
//                         </button>
//                         <button
//                           onClick={() => {
//                             navigate("/panel/configuracion");
//                             setMenuAbierto(false);
//                           }}
//                           className="w-full text-left px-4 py-2 hover:bg-gray-700 text-white transition"
//                         >
//                           ⚙️ Configuración
//                         </button>
//                         <button
//                           onClick={handleLogout}
//                           className="w-full text-left px-4 py-2 hover:bg-red-700 text-white transition"
//                         >
//                           🚪 Cerrar sesión
//                         </button>
//                       </>
//                     ) : (
//                       <>
//                         <button
//                           onClick={() => {
//                             navigate("/login");
//                             setMenuAbierto(false);
//                           }}
//                           className="w-full text-left px-4 py-2 hover:bg-gray-700 text-white transition"
//                         >
//                           🔑 Iniciar sesión
//                         </button>
//                         <button
//                           onClick={() => {
//                             navigate("/registro");
//                             setMenuAbierto(false);
//                           }}
//                           className="w-full text-left px-4 py-2 hover:bg-gray-700 text-white transition"
//                         >
//                           🧾 Registrarme
//                         </button>
//                       </>
//                     )}
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </div>
//           </div>
//         </div>
//       </nav>

//       <div className="pt-16" />
//     </>
//   );
// };

// export default Navbar;