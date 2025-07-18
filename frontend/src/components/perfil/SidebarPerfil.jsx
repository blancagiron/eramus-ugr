export default function SidebarPerfil({ editando, setEditando, guardarCambios, cancelarCambios }) {
    return (
      <aside className="w-full md:w-64 bg-white rounded-xl shadow p-4">
        <div className="mt-6 flex flex-col gap-2">
          {!editando ? (
            <button
              onClick={() => setEditando(true)}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            >
              Editar Perfil
            </button>
          ) : (
            <>
              <button
                onClick={guardarCambios}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
              >
                Guardar Cambios
              </button>
              <button
                onClick={cancelarCambios}
                className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
              >
                Cancelar
              </button>
            </>
          )}
          <button
            onClick={() => {
              localStorage.removeItem("usuario");
              window.location.href = "/auth";
            }}
            className="mt-2 bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded"
          >
            Cerrar sesión
          </button>
        </div>
      </aside>
    );
  }
  