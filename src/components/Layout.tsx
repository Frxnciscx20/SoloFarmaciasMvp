// src/components/Layout.tsx

import React, { useState, useEffect } from 'react'; // <-- Asegúrate de importar useState y useEffect
import Link from 'next/link';
import { useRouter } from 'next/router'; // <-- Importar useRouter
import { supabase } from '../lib/supabaseClient'; // <-- Asegúrate de que esta ruta sea correcta

// Tipos (cópialos de index.tsx)
type SimpleUser = {
  id: string;
  email: string;
}

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState<SimpleUser | null>(null); // <-- useState copiado

  // 1. Lógica para obtener el usuario y escuchar cambios (COPIADO DE index.tsx)
  useEffect(() => {
    // 1.1. Verificación inicial
    supabase.auth.getUser().then(({ data }) => {
      const userData = data.user;
      if (userData?.id && userData?.email) {
        setUser({ id: userData.id, email: userData.email });
      }
    });

    // 1.2. Listener para cambios de estado (onAuthStateChange)
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const sessionUser = session?.user;
      if (sessionUser?.id && sessionUser?.email) {
        setUser({ id: sessionUser.id, email: sessionUser.email });
      } else {
        setUser(null);
      }
    });

    return () => {
      listener?.subscription?.unsubscribe();
    };
  }, []);

  // 2. Función de Logout (COPIADO DE index.tsx)
  const handleLogout = async () => {
    await supabase.auth.signOut();
    // En lugar de window.location.reload(), es mejor usar el router de Next.js
    router.push('/login'); // Redirigir a login después de cerrar sesión
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
        {/* ... TU HEADER CON LA LÓGICA user ? ... : ... */}
        <header className="bg-red-600 text-white py-4 shadow-md">
            <div className="container mx-auto px-4 flex justify-between items-center">
                <div className="flex items-center space-x-6">
                    <Link href="/" className="text-2xl font-bold">💊 SoloFarmacias</Link>
                    <Link href="/quienes-somos" className="hover:underline font-semibold">Quiénes Somos</Link>
                </div>
                <div className="flex items-center space-x-4 text-sm">
                    {/* El resto de tu lógica de usuario con `user` y `handleLogout` */}
                    {user ? (
                        <>
                            <span className="hidden sm:inline">👤 {user.email}</span>
                            <button
                                onClick={handleLogout}
                                className="bg-white text-red-600 px-4 py-1 rounded hover:bg-red-100"
                            >
                                Cerrar sesión
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/login" className="hover:underline">Iniciar sesión</Link>
                            <Link href="/registro" className="hover:underline">Registrarse</Link>
                        </>
                    )}
                </div>
            </div>
        </header>

      {children}
    </div>
  );
};

export default Layout;