'use client';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import ComentarioForm from '@/components/ComentarioForm';
import { User } from '@supabase/supabase-js';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import AlertSwitch from '@/components/AlertSwitch';

/* -----------------------------------
   CONFIG API (ajusta para producción)
------------------------------------ */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

/* -----------------------------------
   TIPOS
------------------------------------ */
type Comentario = {
  comentario: string;
  fecha: string;
  usuario: { nombre: string } | null;
};

type Producto = {
  id_medicamento: number;
  nombre: string;
  precio: number;
  precio_normal: number;
  farmacia: string;
  url: string;
  imagen_url?: string;
  laboratorio?: string;
  presentacion?: string;
};

type AlertResponseData = {
  id: string;
  id_usuario: string;
  id_medicamento: number;
  activo: boolean;
};

type AlertResponse = {
  message: string;
  data: AlertResponseData | null;
  error?: string;
  details?: string;
};

/* -----------------------------------
   FETCH Estado inicial de la alerta
------------------------------------ */
const fetchAlertaEstado = async (userId: string, medicamentoId: number) => {
  const { data, error } = await supabase
    .from('alertas')
    .select('id, activo')
    .eq('id_usuario', userId)
    .eq('id_medicamento', medicamentoId)
    .maybeSingle();

  if (error) console.error("Error al cargar alerta inicial:", error);

  return {
    alertId: data?.id || null,
    alertaActiva: data?.activo || false
  };
};

/* -----------------------------------
   GET SERVER SIDE PROPS
------------------------------------ */
export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  const id = context.params?.id;
  const parsedId = Number(id);

  if (!parsedId) return { notFound: true };

  const { data: productoData, error } = await supabase
    .from('vista_productos')
    .select('*')
    .eq('id_medicamento', parsedId)
    .limit(1);

  const { data: comentariosData, error: comentariosError } = await supabase
    .from('comentarios')
    .select(`
      comentario,
      fecha,
      usuario ( nombre )
    `)
    .eq('id_medicamento', parsedId)
    .order('fecha', { ascending: false });

  if (error || comentariosError || !productoData?.length) {
    return { notFound: true };
  }

  return {
    props: {
      producto: productoData[0] as Producto,
      comentarios: comentariosData as unknown as Comentario[],
    },
  };
};

/* -----------------------------------
   ITEM COMENTARIO
------------------------------------ */
function ComentarioItem({ comentario }: { comentario: Comentario }) {
  const hora = comentario.fecha
    ? new Date(comentario.fecha).toLocaleString('es-CL', {
        dateStyle: 'short',
        timeStyle: 'short',
      })
    : '';

  const inicial = comentario.usuario?.nombre?.charAt(0)?.toUpperCase() || 'U';

  return (
    <li className="bg-secondary/80 border border-border rounded-xl p-4 shadow-sm flex gap-3 hover:shadow-md transition-shadow">
      <div className="h-9 w-9 rounded-full bg-primary/90 flex items-center justify-center text-white text-sm font-semibold">
        {inicial}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-semibold">{comentario.usuario?.nombre || 'Usuario'}</p>
          {hora && <p className="text-xs text-foreground/60">{hora}</p>}
        </div>
        <p className="text-sm mt-1">{comentario.comentario}</p>
      </div>
    </li>
  );
}

/* -----------------------------------
   COMPONENTE PRINCIPAL
------------------------------------ */
export default function ProductoDetalle({
  producto,
  comentarios,
}: {
  producto: Producto;
  comentarios: Comentario[];
}) {
  
  const ahorro = producto.precio_normal - producto.precio;
  const hayOferta = ahorro > 0;

  /* Estados */
  const [user, setUser] = useState<User | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  /* Alertas */
  const [alertaActiva, setAlertaActiva] = useState(false);
  const [alertId, setAlertId] = useState<string | null>(null);
  const [loadingAlerta, setLoadingAlerta] = useState(false);
  const [alertaMensaje, setAlertaMensaje] = useState('');

  /* -----------------------------------
     CARGAR USUARIO
  ------------------------------------ */
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  /* -----------------------------------
     CARGAR ESTADO INICIAL DE ALERTA
  ------------------------------------ */
  useEffect(() => {
    if (!user) return;

    let isMounted = true;

    const initAlerta = async () => {
      try {
        const { alertId, alertaActiva } = await fetchAlertaEstado(
          user.id,
          producto.id_medicamento
        );

        if (!isMounted) return;

        setAlertId(alertId);
        setAlertaActiva(alertaActiva);
      } catch (error) {
        console.error("Error al obtener alerta inicial:", error);
      }
    };

    initAlerta();

    return () => {
      isMounted = false;
    };
  }, [user, producto.id_medicamento]);

  /* -----------------------------------
     TOGGLE ALERTA (MEJORADO)
  ------------------------------------ */
  const handleToggleAlerta = async () => {
    if (!user) {
      setAlertaMensaje("❌ Debes iniciar sesión para activar una alerta.");
      return;
    }

    if (loadingAlerta) return;

    setLoadingAlerta(true);
    setAlertaMensaje("");

    const nuevoEstado = !alertaActiva;

    try {
      const response = await fetch(`${API_BASE_URL}/toggle`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idUsuario: user.id,
          idMedicamento: producto.id_medicamento,
          precioAlarma: producto.precio,
          activo: nuevoEstado,
        }),
      });

      const result: AlertResponse = await response.json();

      if (!response.ok) throw new Error(result.details || result.error || "Error desconocido");

      setAlertaActiva(nuevoEstado);

      if (result.data?.id) setAlertId(result.data.id);

      setAlertaMensaje(
        nuevoEstado
          ? "✅ Alerta activada. Te notificaremos cuando baje el precio."
          : "🔕 Alerta desactivada."
      );

    } catch (error: unknown) {
      const err = error as Error;
      console.error(err.message);
      setAlertaMensaje(`❌ Error: ${err.message}`);
    }
  };

  /* -----------------------------------
     RENDER
  ------------------------------------ */

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="max-w-6xl mx-auto mt-8 p-6 bg-secondary rounded-2xl shadow-xl border border-border">

        {/* Breadcrumb */}
        <div className="mb-6 text-sm text-foreground/70 flex items-center gap-2">
          <Link href="/" className="hover:text-primary hover:underline">
            Inicio
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium">{producto.nombre}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Imagen */}
          <div className="flex justify-center lg:sticky lg:top-8">
            <div className="relative w-full max-w-lg">
              <div className="aspect-square rounded-2xl bg-white border border-border shadow-xl overflow-hidden flex items-center justify-center p-8">
                <Image
                  src={
                    producto.imagen_url ||
                    `https://via.placeholder.com/400x300?text=${encodeURIComponent(
                      producto.nombre
                    )}`
                  }
                  alt={producto.nombre}
                  width={500}
                  height={500}
                  className="object-contain w-full h-full"
                  priority
                />
              </div>

              <div className="absolute top-4 right-4 bg-primary/90 text-white px-4 py-2 rounded-full text-sm shadow-lg">
                {producto.farmacia}
              </div>
            </div>
          </div>

          {/* Información */}
          <div className="space-y-6">
            
            <h1 className="text-4xl font-bold">{producto.nombre}</h1>

            {(producto.laboratorio || producto.presentacion) && (
              <p className="text-sm text-foreground/60 flex gap-2">
                {producto.laboratorio && (
                  <>
                    <span className="font-medium">{producto.laboratorio}</span>
                  </>
                )}
                {producto.presentacion && <>• {producto.presentacion}</>}
              </p>
            )}

            {/* Precio */}
            <div className="relative rounded-2xl bg-primary/5 border border-primary/20 p-6 shadow-lg">
              <p className="text-xs uppercase text-foreground/50">Precio actual</p>
              <p className="text-5xl font-bold text-primary">
                ${producto.precio.toLocaleString('es-CL')}
              </p>
              <p className="text-sm text-foreground/60 line-through">
                Precio normal: $
                {producto.precio_normal.toLocaleString('es-CL')}
              </p>

              {hayOferta && (
                <div className="mt-3">
                  <p className="text-sm line-through text-foreground/40">
                    ${producto.precio_normal.toLocaleString('es-CL')}
                  </p>
                  <p className="text-green-600 font-semibold mt-1">
                    Ahorras ${ahorro.toLocaleString('es-CL')}
                  </p>
                </div>
              )}
            </div>

            {/* Botón Ver farmacia */}
            <a
              href={producto.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center gap-3 w-full px-6 py-4 bg-primary hover:bg-primary/90 text-white rounded-xl transition shadow-lg"
            >
              <span>Ver en {producto.farmacia}</span>
              <svg
                className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>

            {/* Acciones */}
            <div className="space-y-3 pt-4 border-t border-border">
              {user ? (
                <>
                  {/* Comentario */}
                  <button
                    onClick={() => setMostrarFormulario(!mostrarFormulario)}
                    className="w-full bg-background hover:bg-accent/50 border border-border rounded-xl px-5 py-3 flex items-center justify-center gap-3"
                  >
                    💬
                    <span>
                      {mostrarFormulario ? 'Ocultar opinión' : 'Dar opinión de compra'}
                    </span>
                  </button>

                  {/* Alerta */}
                  <div className="relative rounded-xl bg-amber-500/5 border border-amber-500/20 p-4">
                    <div className="flex items-center gap-4">

                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        alertaActiva ? 'bg-amber-500/20' : 'bg-foreground/10'
                      }`}>
                        <span className={`text-2xl ${alertaActiva ? 'animate-pulse' : ''}`}>
                          {loadingAlerta ? '⏳' : '🔔'}
                        </span>
                      </div>

                      <div className="flex-1">
                        <h3 className="font-semibold flex items-center gap-2">
                          Alerta de precio
                          {alertaActiva && (
                            <span className="px-2 py-0.5 text-xs bg-green-500/10 text-green-600 rounded-full">
                              Activa
                            </span>
                          )}
                        </h3>

                        <p className="text-xs text-foreground/60">
                          {alertaActiva
                            ? "Te avisaremos por email cuando el precio baje."
                            : "Activa para recibir notificaciones de descuentos."}
                        </p>

                        {alertaMensaje && (
                          <p
                            className={`text-xs mt-2 ${
                              alertaMensaje.startsWith("❌")
                                ? "text-red-500"
                                : "text-green-600"
                            }`}
                          >
                            {alertaMensaje}
                          </p>
                        )}
                      </div>

                      <AlertSwitch
                        checked={alertaActiva}
                        onChange={handleToggleAlerta}
                        disabled={loadingAlerta}
                      />

                    </div>
                  </div>
                </>
              ) : (
                <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl flex gap-3">
                  🔐
                  <p className="text-sm">Inicia sesión para comentar y recibir alertas.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Comentarios */}
        <div className="mt-12">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            💬 Opiniones
            <span className="text-xs text-foreground/60">
              ({comentarios.length})
            </span>
          </h3>

          {user && mostrarFormulario && (
            <div className="mb-6 bg-background border border-border rounded-xl p-4">
              <ComentarioForm idMedicamento={producto.id_medicamento} />
            </div>
          )}

          {comentarios.length ? (
            <ul className="space-y-4">
              {comentarios.map((c, i) => (
                <ComentarioItem key={i} comentario={c} />
              ))}
            </ul>
          ) : (
            <p className="text-sm text-foreground/70">
              Aún no hay comentarios. Sé el primero en opinar.
            </p>
          )}
        </div>

        {/* 🔙 Volver */}
        <div className="text-center mt-10">
          <Link
            href="/"
            className="inline-block bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90"
          >
            ← Volver al inicio
          </Link>
        </div>
      </main>
    </div>
  );
}
