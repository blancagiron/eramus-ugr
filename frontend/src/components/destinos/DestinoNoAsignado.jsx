import { useEffect, useState } from "react";
import { MapPin, AlertCircle, Heart, ArrowRight, Star, Globe, Clock } from "lucide-react";

export default function DestinoNoAsignado() {
    const [usuario, setUsuario] = useState(null);
    const [favoritos, setFavoritos] = useState([]);

    useEffect(() => {
        const raw = localStorage.getItem("usuario");
        if (!raw) return;

        const localUser = JSON.parse(raw);
        fetch(`http://localhost:5000/usuarios/${localUser.email}`)
            .then((res) => res.json())
            .then((backendUser) => {
                setUsuario(backendUser);

                const favoritosCodigos = backendUser.destinos_favoritos || [];
                if (favoritosCodigos.length === 0) return;

                fetch("http://localhost:5000/api/destinos")
                    .then((res) => res.json())
                    .then((destinos) => {
                        const encontrados = destinos.filter((d) =>
                            favoritosCodigos.includes(d.codigo)
                        );
                        setFavoritos(encontrados);
                    });
            });
    }, []);

    if (!usuario) {
        return (
            <div className="max-w-4xl mx-auto px-6 py-10">
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                    <p className="ml-3 text-gray-600">Cargando información...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-6 py-12">
            {/* Card principal con gradiente */}
            <div className="relative bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 rounded-3xl shadow-xl border border-orange-100/50 overflow-hidden">
                {/* Decoración de fondo */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-orange-200/20 to-transparent rounded-full transform translate-x-32 -translate-y-32"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-red-200/20 to-transparent rounded-full transform -translate-x-24 translate-y-24"></div>

                <div className="relative z-10 p-8">
                    {/* Header con icono mejorado */}
                    <div className="flex items-start gap-4 mb-6">
                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                            <Clock className="text-white w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                No tienes un destino asignado
                            </h1>
                            <p className="text-gray-600 leading-relaxed">
                                Cuando tengas un destino confirmado para tu intercambio académico,
                                podrás ver toda la información detallada aquí. Mientras tanto,
                                puedes revisar tus destinos favoritos y seguir explorando opciones.
                            </p>
                        </div>
                    </div>

                    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-white/50">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-gray-800">Estado del proceso</h3>
                            <span className={`px-3 py-1 text-sm font-medium rounded-full ${usuario.estado_proceso === "con destino"
                                    ? "bg-green-100 text-green-700"
                                    : usuario.estado_proceso === "en revisión"
                                        ? "bg-orange-100 text-orange-700"
                                        : usuario.estado_proceso === "finalizado"
                                            ? "bg-blue-100 text-blue-700"
                                            : "bg-gray-100 text-gray-500"
                                }`}>
                                {usuario.estado_proceso || "Desconocido"}
                            </span>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className={`w-2 h-2 rounded-full ${usuario.estado_proceso !== "no iniciado" ? "bg-green-500" : "bg-gray-300"
                                    }`}></div>
                                <span className={`text-sm ${usuario.estado_proceso !== "no iniciado" ? "text-gray-600" : "text-gray-400"
                                    }`}>
                                    Solicitud recibida
                                </span>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className={`w-2 h-2 rounded-full ${["en revisión", "con destino", "finalizado"].includes(usuario.estado_proceso)
                                        ? "bg-orange-500"
                                        : "bg-gray-300"
                                    }`}></div>
                                <span className={`text-sm ${["en revisión", "con destino", "finalizado"].includes(usuario.estado_proceso)
                                        ? "text-gray-600"
                                        : "text-gray-400"
                                    }`}>
                                    Evaluando opciones disponibles
                                </span>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className={`w-2 h-2 rounded-full ${["con destino", "finalizado"].includes(usuario.estado_proceso)
                                        ? "bg-green-600"
                                        : "bg-gray-300"
                                    }`}></div>
                                <span className={`text-sm ${["con destino", "finalizado"].includes(usuario.estado_proceso)
                                        ? "text-gray-600"
                                        : "text-gray-400"
                                    }`}>
                                    Asignación de destino
                                </span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Sección de favoritos */}
            {favoritos.length > 0 && (
                <div className="mt-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                            <Heart className="text-white w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Tus destinos favoritos</h2>
                            <p className="text-gray-600 text-sm">Mientras esperas, revisa las universidades que te interesan</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {favoritos.map((uni, index) => (
                            <div
                                key={uni.codigo}
                                className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100/50 overflow-hidden hover:-translate-y-1"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                {/* Header de la card */}
                                <div className="bg-gradient-to-r from-red-500 to-red-600 p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Globe className="w-5 h-5 text-white/90" />
                                            <span className="text-white/90 text-sm font-medium">Universidad</span>
                                        </div>
                                        <Heart className="w-4 h-4 text-red-200 fill-current" />
                                    </div>
                                </div>

                                {/* Contenido */}
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <h3 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-red-600 transition-colors">
                                                {uni.nombre_uni}
                                            </h3>
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <MapPin className="w-4 h-4 text-red-500" />
                                                <span className="text-sm">{uni.pais || 'País no especificado'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Información adicional */}
                                    <div className="space-y-2 mb-4">
                                        {uni.idioma && (
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                                                <span>Idioma: {uni.idioma}</span>
                                            </div>
                                        )}
                                        {uni.tipo_programa && (
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                                                <span>Programa: {uni.tipo_programa}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Botón de acción */}
                                    <button
                                        onClick={() => window.location.href = `/destinos/${encodeURIComponent(uni.nombre_uni)}`}
                                        className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl group-hover:scale-105"
                                    >
                                        Ver detalles
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Mensaje cuando no hay favoritos */}
            {favoritos.length === 0 && (
                <div className="mt-8 text-center">
                    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Heart className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Sin favoritos aún</h3>
                        <p className="text-gray-600 mb-6">
                            Explora nuestro catálogo de destinos y marca los que más te interesen
                        </p>
                        <button
                            onClick={() => window.location.href = "/destinos"}
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                        >
                            Explorar destinos
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}