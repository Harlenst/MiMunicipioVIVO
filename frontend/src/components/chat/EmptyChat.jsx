export default function EmptyChat({ type }) {
  const config = {
    reporte: {
      icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",
      title: "Selecciona un reporte",
      subtitle: "Elige un reporte para comenzar la conversación"
    },
    comunidad: {
      icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0-12l-2.5 2.5m2.5 2.5l2.5 2.5m6-6l2.5-2.5m-2.5-2.5l-2.5-2.5M3 7a4 4 0 018 0M21 7a4 4 0 00-8 0",
      title: "Selecciona una comunidad",
      subtitle: "Únete a discusiones públicas sobre temas locales"
    },
    grupo: {
      icon: "M18 9.5V15m0 0v4.5m0-4.5h-4.5M6 9.5V15m0 0v4.5m0-4.5H1.5m16.5-9l-4.5 4.5m0 0L13.5 9m4.5 4.5L13.5 18M7.5 4.5l4.5 4.5m0 0L16.5 13.5m-4.5-4.5L7.5 13.5",
      title: "Selecciona un grupo",
      subtitle: "Colabora con otros en chats privados"
    }
  };

  const { icon, title, subtitle } = config[type] || config.reporte;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 h-full flex items-center justify-center p-8">
      <div className="text-center max-w-md mx-auto">
        <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d={icon} />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
        <p className="text-gray-500 text-sm">{subtitle}</p>
      </div>
    </div>
  );
}