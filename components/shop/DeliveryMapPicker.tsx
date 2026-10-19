"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  MapPin,
  Search,
  CheckCircle2,
  AlertCircle,
  Compass,
  Loader2,
  Navigation,
  Route,
  Sparkles,
  X
} from "lucide-react";

interface DeliveryMapPickerProps {
  initialAddress: string;
  storeLat?: number;
  storeLng?: number;
  onLocationChange: (data: {
    address: string;
    lat: number;
    lng: number;
    distanceMiles: number;
    googleMapsUrl: string;
  }) => void;
}

interface MapboxSuggestion {
  id: string;
  place_name: string;
  text: string;
  center: [number, number]; // [lng, lat]
}

// Coordenadas del centro logístico de despacho principal por defecto
const DEFAULT_STORE_LAT = 29.6521;
const DEFAULT_STORE_LNG = -95.1706;

// Cálculo Haversine de respaldo (si la API de rutas no responde)
function calculateHaversineMiles(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3958.8;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 1.25 * 10) / 10;
}

export function DeliveryMapPicker({
  initialAddress,
  storeLat = DEFAULT_STORE_LAT,
  storeLng = DEFAULT_STORE_LNG,
  onLocationChange,
}: DeliveryMapPickerProps) {
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "";

  const [addressInput, setAddressInput] = useState(initialAddress || "");
  const [lat, setLat] = useState<number>(storeLat + 0.04);
  const [lng, setLng] = useState<number>(storeLng + 0.04);

  const [searching, setSearching] = useState(false);
  const [calculatingRoute, setCalculatingRoute] = useState(false);
  const [suggestions, setSuggestions] = useState<MapboxSuggestion[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [geocodedSuccess, setGeocodedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [distanceMiles, setDistanceMiles] = useState<number>(0);
  const [estimatedMinutes, setEstimatedMinutes] = useState<number | null>(null);

  const [isMapSdkLoaded, setIsMapSdkLoaded] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const storeMarkerRef = useRef<any>(null);
  const searchDebounceRef = useRef<NodeJS.Timeout | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // 1. Carga Asíncrona de Mapbox GL JS y CSS (SSR-Safe y Zero-Bloat)
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Verificar si el CSS ya está en el <head>
    const cssId = "mapbox-gl-css";
    if (!document.getElementById(cssId)) {
      const link = document.createElement("link");
      link.id = cssId;
      link.rel = "stylesheet";
      link.href = "https://api.mapbox.com/mapbox-gl-js/v3.4.0/mapbox-gl.css";
      document.head.appendChild(link);
    }

    // Verificar si el SDK ya fue cargado
    if ((window as any).mapboxgl) {
      setIsMapSdkLoaded(true);
      return;
    }

    const scriptId = "mapbox-gl-js";
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://api.mapbox.com/mapbox-gl-js/v3.4.0/mapbox-gl.js";
      script.async = true;
      script.onload = () => setIsMapSdkLoaded(true);
      script.onerror = () => setErrorMsg("No se pudo cargar el visor de mapas interactivo.");
      document.body.appendChild(script);
    } else {
      script.addEventListener("load", () => setIsMapSdkLoaded(true));
    }
  }, []);

  // Notificar al componente padre
  const notifyParent = useCallback(
    (newAddress: string, newLat: number, newLng: number, miles: number) => {
      setDistanceMiles(miles);
      const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${newLat},${newLng}`;
      onLocationChange({
        address: newAddress,
        lat: newLat,
        lng: newLng,
        distanceMiles: miles,
        googleMapsUrl,
      });
    },
    [onLocationChange]
  );

  // 2. Navigation Directions API (Cálculo de ruta por carretera y dibujo en mapa)
  const calculateDrivingRoute = useCallback(
    async (destLng: number, destLat: number, currentAddressText: string) => {
      setCalculatingRoute(true);

      if (!mapboxToken) {
        const fallbackMiles = calculateHaversineMiles(storeLat, storeLng, destLat, destLng);
        notifyParent(currentAddressText, destLat, destLng, fallbackMiles);
        setCalculatingRoute(false);
        return;
      }

      try {
        const directionsUrl = `https://api.mapbox.com/directions/v5/mapbox/driving/${storeLng},${storeLat};${destLng},${destLat}?access_token=${mapboxToken}&geometries=geojson&overview=full`;
        const res = await fetch(directionsUrl);
        const data = await res.json();

        if (data.routes && data.routes.length > 0) {
          const route = data.routes[0];
          const miles = Math.round((route.distance / 1609.34) * 10) / 10;
          const minutes = Math.round(route.duration / 60);

          setEstimatedMinutes(minutes);
          notifyParent(currentAddressText, destLat, destLng, miles);

          // Trazar la línea de la ruta en el mapa si la instancia existe
          const map = mapInstanceRef.current;
          if (map && map.getSource) {
            const routeGeoJSON = {
              type: "Feature",
              properties: {},
              geometry: route.geometry,
            };

            if (map.getSource("delivery-route")) {
              map.getSource("delivery-route").setData(routeGeoJSON);
            } else if (map.isStyleLoaded()) {
              map.addSource("delivery-route", {
                type: "geojson",
                data: routeGeoJSON,
              });
              map.addLayer({
                id: "delivery-route-line",
                type: "line",
                source: "delivery-route",
                layout: {
                  "line-join": "round",
                  "line-cap": "round",
                },
                paint: {
                  "line-color": "#D4AF37",
                  "line-width": 4,
                  "line-opacity": 0.85,
                },
              });
            }

            // Ajustar vista para encuadrar boutique y destino
            const mapboxgl = (window as any).mapboxgl;
            if (mapboxgl) {
              const bounds = new mapboxgl.LngLatBounds();
              bounds.extend([storeLng, storeLat]);
              bounds.extend([destLng, destLat]);
              map.fitBounds(bounds, { padding: 45, maxZoom: 15 });
            }
          }
        } else {
          const fallbackMiles = calculateHaversineMiles(storeLat, storeLng, destLat, destLng);
          notifyParent(currentAddressText, destLat, destLng, fallbackMiles);
        }
      } catch (err) {
        console.error("Error consultando Directions API:", err);
        const fallbackMiles = calculateHaversineMiles(storeLat, storeLng, destLat, destLng);
        notifyParent(currentAddressText, destLat, destLng, fallbackMiles);
      } finally {
        setCalculatingRoute(false);
      }
    },
    [mapboxToken, storeLat, storeLng, notifyParent]
  );

  // 3. Reverse Geocoding (Cuando el cliente arrastra el pin o hace clic en el mapa)
  const handleReverseGeocode = useCallback(
    async (newLng: number, newLat: number) => {
      setLat(newLat);
      setLng(newLng);
      setGeocodedSuccess(true);
      setErrorMsg("");

      if (!mapboxToken) {
        const fallbackText = addressInput || `Ubicación GPS (${newLat.toFixed(4)}, ${newLng.toFixed(4)})`;
        calculateDrivingRoute(newLng, newLat, fallbackText);
        return;
      }

      try {
        const reverseUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${newLng},${newLat}.json?access_token=${mapboxToken}&types=address,poi,postcode,place&language=es,en`;
        const res = await fetch(reverseUrl);
        const data = await res.json();

        let resolvedAddress = addressInput;
        if (data.features && data.features.length > 0) {
          resolvedAddress = data.features[0].place_name;
          setAddressInput(resolvedAddress);
        }

        await calculateDrivingRoute(newLng, newLat, resolvedAddress);
      } catch (err) {
        console.error("Error en Reverse Geocode:", err);
        await calculateDrivingRoute(newLng, newLat, addressInput);
      }
    },
    [mapboxToken, addressInput, calculateDrivingRoute]
  );

  // 4. Inicialización del Mapa Mapbox GL JS
  useEffect(() => {
    if (!isMapSdkLoaded || !mapContainerRef.current) return;
    if (mapInstanceRef.current) return; // Evitar reinicialización doble

    const mapboxgl = (window as any).mapboxgl;
    if (!mapboxgl) return;

    if (mapboxToken) {
      mapboxgl.accessToken = mapboxToken;
    }

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [lng, lat],
      zoom: 13,
      attributionControl: false,
    });

    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "top-right");

    // Marcador del Centro de Despacho (Origen fijo)
    const storeEl = document.createElement("div");
    storeEl.className = "flex items-center justify-center w-7 h-7 bg-black text-white rounded-full shadow-lg border-2 border-[#D4AF37] text-xs font-black";
    storeEl.innerHTML = "🏢";
    storeEl.title = "Aldri Shop / Centro de Despacho Logístico";
    storeMarkerRef.current = new mapboxgl.Marker({ element: storeEl })
      .setLngLat([storeLng, storeLat])
      .addTo(map);

    // Marcador Principal Arrastrable para la Entrega (Champagne Gold Stitch)
    const marker = new mapboxgl.Marker({
      draggable: true,
      color: "#D4AF37",
    })
      .setLngLat([lng, lat])
      .addTo(map);

    markerRef.current = marker;
    mapInstanceRef.current = map;

    // Evento al soltar el pin arrastrado
    marker.on("dragend", () => {
      const pos = marker.getLngLat();
      handleReverseGeocode(pos.lng, pos.lat);
    });

    // Evento al hacer clic directo en el mapa
    map.on("click", (e: any) => {
      marker.setLngLat(e.lngLat);
      handleReverseGeocode(e.lngLat.lng, e.lngLat.lat);
    });

    map.on("load", () => {
      if (initialAddress) {
        calculateDrivingRoute(lng, lat, initialAddress);
      }
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isMapSdkLoaded, mapboxToken, storeLat, storeLng, handleReverseGeocode, calculateDrivingRoute]);

  // Cerrar sugerencias al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 5. Search Geocoding Autocomplete (Mientras el cliente escribe)
  const handleAddressInputChange = (text: string) => {
    setAddressInput(text);
    setErrorMsg("");

    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }

    if (!text.trim() || text.length < 3 || !mapboxToken) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    searchDebounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const searchUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          text.trim()
        )}.json?access_token=${mapboxToken}&proximity=${storeLng},${storeLat}&types=address,poi,postcode,place&language=es,en&limit=5`;

        const res = await fetch(searchUrl);
        const data = await res.json();

        if (data.features && data.features.length > 0) {
          setSuggestions(
            data.features.map((f: any) => ({
              id: f.id,
              place_name: f.place_name,
              text: f.text,
              center: f.center,
            }))
          );
          setShowDropdown(true);
        } else {
          setSuggestions([]);
          setShowDropdown(false);
        }
      } catch (err) {
        console.error("Error en búsqueda autocompletada Mapbox:", err);
      } finally {
        setSearching(false);
      }
    }, 320);
  };

  // Al seleccionar una opción del autocompletado
  const handleSelectSuggestion = (suggestion: MapboxSuggestion) => {
    setAddressInput(suggestion.place_name);
    setShowDropdown(false);
    setSuggestions([]);
    setGeocodedSuccess(true);

    const [newLng, newLat] = suggestion.center;
    setLat(newLat);
    setLng(newLng);

    if (mapInstanceRef.current && markerRef.current) {
      markerRef.current.setLngLat([newLng, newLat]);
      mapInstanceRef.current.flyTo({
        center: [newLng, newLat],
        zoom: 15,
        essential: true,
      });
    }

    calculateDrivingRoute(newLng, newLat, suggestion.place_name);
  };

  // Limpiar dirección
  const handleClear = () => {
    setAddressInput("");
    setSuggestions([]);
    setShowDropdown(false);
    setGeocodedSuccess(false);
    setDistanceMiles(0);
  };

  return (
    <div className="space-y-4 bg-[#FAF8F5] dark:bg-[#121215] p-5 rounded-2xl border border-[#EAE4DC] dark:border-white/10">
      {/* Encabezado e Indicador */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b pb-3 border-[#EAE4DC] dark:border-white/10">
        <label className="text-xs font-extrabold uppercase tracking-wider text-gray-900 dark:text-white flex items-center gap-1.5">
          <MapPin size={16} className="text-[#D4AF37]" /> Dirección y Ubicación Exacta para Entrega
        </label>

        <span className="text-[11px] font-semibold text-gray-500 dark:text-zinc-400 flex items-center gap-1">
          <Sparkles size={13} className="text-[#D4AF37]" /> Pin interactivo de alta precisión
        </span>
      </div>

      {/* Alerta si falta el Token de Mapbox */}
      {!mapboxToken && (
        <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl text-xs text-amber-800 dark:text-amber-200 flex items-start gap-2">
          <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Aviso para el Administrador:</p>
            <p className="text-[11px] opacity-90 mt-0.5">
              Configura <code className="bg-amber-100 dark:bg-amber-900 px-1 py-0.5 rounded font-mono">NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN</code> en tus variables de entorno para activar la búsqueda satelital de alta resolución y el trazado de rutas.
            </p>
          </div>
        </div>
      )}

      {/* 1. Buscador Predictivo (Search Autocomplete) */}
      <div className="space-y-1.5 relative" ref={dropdownRef}>
        <div className="relative">
          <input
            type="text"
            name="address"
            value={addressInput}
            onChange={(e) => handleAddressInputChange(e.target.value)}
            onFocus={() => {
              if (suggestions.length > 0) setShowDropdown(true);
            }}
            placeholder="Escribe la dirección, calle, urbanización o código postal..."
            className="w-full p-3.5 pr-20 border border-[#EAE4DC] dark:border-white/10 rounded-2xl text-sm font-semibold text-gray-900 dark:text-white bg-white dark:bg-[#161619] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] transition-all"
            required
            autoComplete="off"
          />

          <div className="absolute right-2.5 top-2.5 bottom-2.5 flex items-center gap-1">
            {searching ? (
              <Loader2 size={16} className="animate-spin text-[#D4AF37] mr-2" />
            ) : addressInput ? (
              <button
                type="button"
                onClick={handleClear}
                className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                title="Limpiar dirección"
              >
                <X size={15} />
              </button>
            ) : (
              <Search size={16} className="text-gray-400 mr-2" />
            )}
          </div>
        </div>

        {/* Dropdown de Sugerencias Autocompletadas */}
        {showDropdown && suggestions.length > 0 && (
          <div className="absolute z-30 left-0 right-0 mt-1 bg-white dark:bg-[#161619] border border-[#EAE4DC] dark:border-white/10 rounded-2xl shadow-xl overflow-hidden max-h-60 overflow-y-auto divide-y divide-[#EAE4DC] dark:divide-white/10">
            {suggestions.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelectSuggestion(item)}
                className="w-full text-left p-3.5 hover:bg-amber-500/10 dark:hover:bg-white/5 transition-colors flex items-start gap-2.5"
              >
                <MapPin size={16} className="text-[#D4AF37] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-gray-900 dark:text-white">{item.text}</p>
                  <p className="text-[11px] text-gray-500 dark:text-zinc-400 leading-snug line-clamp-1">
                    {item.place_name}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Badge de confirmación de dirección y distancia en carretera */}
        {geocodedSuccess && (
          <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-900/50 text-[11px] font-bold text-emerald-800 dark:text-emerald-300 flex flex-wrap items-center justify-between gap-2">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-emerald-600" />
              Dirección localizada en mapa
            </span>
            <div className="flex items-center gap-2">
              {estimatedMinutes !== null && (
                <span className="bg-emerald-100 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200 px-2 py-0.5 rounded-full text-[10px]">
                  ⏱️ ~{estimatedMinutes} min en auto
                </span>
              )}
              <span className="bg-emerald-600 text-white px-2.5 py-0.5 rounded-full text-[10px] flex items-center gap-1">
                <Route size={11} /> {distanceMiles} Millas por Carretera
              </span>
            </div>
          </div>
        )}

        {errorMsg && (
          <p className="text-[11px] font-bold text-red-500 flex items-center gap-1 pt-0.5">
            <AlertCircle size={13} /> {errorMsg}
          </p>
        )}
      </div>

      {/* 2. Visor Interactivo Mapbox GL JS con Marcador Arrastrable */}
      <div className="space-y-2">
        <div className="relative rounded-2xl overflow-hidden border border-[#EAE4DC] dark:border-white/10 shadow-sm h-64 bg-stone-100 dark:bg-[#161619]">
          <div ref={mapContainerRef} className="w-full h-full" />

          {/* Banner de Instrucción Táctil / Mouse */}
          <div className="absolute bottom-3 left-3 right-3 sm:right-auto bg-black/80 backdrop-blur-md text-white text-[11px] font-medium px-3 py-1.5 rounded-xl border border-white/10 shadow-md flex items-center gap-2 pointer-events-none">
            <Navigation size={13} className="text-[#D4AF37] flex-shrink-0 animate-pulse" />
            <span>Arrastra el pin dorado con el dedo o haz clic para ubicar la puerta exacta.</span>
          </div>

          {/* Badge Flotante Superior de Millas & Estado */}
          <div className="absolute top-3 left-3 bg-white/95 dark:bg-[#161619]/95 text-gray-900 dark:text-white backdrop-blur-md px-3 py-1.5 rounded-full border border-[#EAE4DC] dark:border-white/10 shadow-md flex items-center gap-1.5 text-xs font-black">
            <Compass size={14} className="text-[#D4AF37]" />
            <span>
              {calculatingRoute
                ? "Calculando ruta..."
                : distanceMiles > 0
                ? `📍 ${distanceMiles} Millas desde Tienda`
                : "📍 Selecciona el destino"}
            </span>
          </div>
        </div>

        <p className="text-[11px] font-semibold text-gray-600 dark:text-zinc-400 italic flex items-center gap-1.5">
          <span>💡</span> Las millas se calculan automáticamente por ruta de carretera real y se aplican a la tarifa de entrega.
        </p>
      </div>
    </div>
  );
}
