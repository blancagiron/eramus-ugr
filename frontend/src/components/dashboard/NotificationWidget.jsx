import { useState, useEffect } from "react";
import { Bell, BellRing, Clock, CheckCircle, AlertCircle, Info, ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function NotificacionesWidget({ email }) {
    const [notificaciones, setNotificaciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandido, setExpandido] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!email) return;
        fetch(`http://localhost:5000/api/notificaciones/${email}`)
            .then(res => res.json())
            .then(data => {
                setNotificaciones(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error cargando notificaciones", err);
                setLoading(false);
            });
    }, [email]);

    const getNotificationIcon = (tipo) => {
        switch (tipo) {
            case "aprobacion": return <CheckCircle className="w-4 h-4 text-green-500" />;
            case "cambio": return <AlertCircle className="w-4 h-4 text-orange-500" />;
            case "recordatorio": return <Clock className="w-4 h-4 text-red-500" />;
            default: return <Info className="w-4 h-4 text-gray-500" />;
        }
    };

    const formatearFecha = (fecha) => {
        const ahora = new Date();
        const fechaNotif = new Date(fecha);
        const diffMs = ahora - fechaNotif;
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffHours < 1) return "Hace poco";
        if (diffHours < 24) return `Hace ${diffHours}h`;
        if (diffDays === 1) return "Ayer";
        if (diffDays < 7) return `Hace ${diffDays}d`;
        return fechaNotif.toLocaleDateString();
    };

    const noLeidasCount = notificaciones.filter(n => !n.leida).length;
    const notificacionesMostradas = expandido ? notificaciones : notificaciones.slice(0, 4);

    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 mt-8">
                <p className="text-gray-500 text-sm">Cargando notificaciones...</p>
            </div>
        );
    }

    return (
        <div className="mt-8">
            <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                {/* Header */}
                <div className="bg-red-100 px-6 py-4 border-b border-red-100 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        {noLeidasCount > 0 ? (
                            <BellRing className="w-6 h-6 text-red-600" />
                        ) : (
                            <Bell className="w-6 h-6 text-gray-600" />
                        )}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800">Notificaciones</h3>
                            {noLeidasCount > 0 && (
                                <p className="text-sm text-red-600">{noLeidasCount} nueva{noLeidasCount !== 1 ? "s" : ""}</p>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {notificaciones.length > 0 && (
                            <button
                                onClick={() => {
                                    fetch(`http://localhost:5000/api/notificaciones/${email}/leer-todas`, { method: "PUT" })
                                        .then(() => setNotificaciones(prev => prev.map(n => ({ ...n, leida: true }))));
                                }}
                                className="text-xs text-gray-600 hover:text-gray-800"
                            >
                                Marcar todas como leídas
                            </button>
                        )}
                        {notificaciones.length > 0 && (
                            <button
                                onClick={() => {
                                    fetch(`http://localhost:5000/api/notificaciones/${email}/limpiar`, { method: "DELETE" })
                                        .then(() => setNotificaciones([]));
                                }}
                                className="text-xs text-red-600 hover:text-red-800"
                            >
                                Limpiar
                            </button>
                        )}
                        {notificaciones.length > 4 && (
                            <button
                                onClick={() => setExpandido(!expandido)}
                                className="flex items-center gap-1 text-red-600 hover:bg-red-100 px-2 py-1 rounded-md text-sm transition"
                            >
                                {expandido ? <>Ver menos <ChevronUp className="w-4 h-4" /></> : <>Ver más <ChevronDown className="w-4 h-4" /></>}
                            </button>
                        )}
                    </div>
                </div>
                {/* Lista de notificaciones */}
                <div className={`p-6 ${expandido ? "max-h-80 overflow-y-auto" : ""}`}>
                    {!notificaciones.length ? (
                        <div className="text-center py-6 text-gray-500 text-sm">No tienes notificaciones por ahora.</div>
                    ) : (
                        <div className="space-y-3">
                            {notificacionesMostradas.map(n => {
                                const esNavegable = n.tipo === "aprobacion" || n.tipo === "cambio" || n.tipo === "envio";
                                return (
                                    <div
                                        key={n._id}
                                        onClick={() => {
                                            if (esNavegable && n.enlace) navigate(n.enlace);
                                        }}
                                        className={`group relative p-4 rounded-xl border transition-all duration-200
                      ${esNavegable ? "cursor-pointer hover:shadow-md hover:border-red-300" : ""}
                      ${n.leida ? "bg-gray-50 border-gray-200" : "bg-red-50 border-red-200"}`}
                                    >
                                        {!n.leida && <div className="absolute top-4 right-4 w-2 h-2 bg-red-500 rounded-full"></div>}

                                        <div className="flex items-start gap-3">
                                            {getNotificationIcon(n.tipo)}
                                            <div className="flex-1 min-w-0">
                                                <h4 className={`text-sm font-medium ${n.leida ? "text-gray-700" : "text-gray-900"}`}>
                                                    {n.titulo}
                                                </h4>
                                                {n.mensaje && <p className="text-xs text-gray-600 line-clamp-2">{n.mensaje}</p>}
                                                <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                                                    <Clock className="w-3 h-3" />
                                                    {formatearFecha(n.fecha_creacion)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
