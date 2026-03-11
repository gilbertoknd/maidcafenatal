import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { MapContainer, TileLayer, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { X, MapPin, Loader2, Check } from "lucide-react";
import styles from "./styles.module.css";

// Definimos o centro inicial: Natal/RN
const DEFAULT_CENTER: [number, number] = [-5.805, -35.209];

export interface AddressData {
  address: string;
  lat: number;
  lng: number;
}

interface AddressMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: AddressData) => void;
}

// Sub-componente mágico do Leaflet para observar o movimento livre do mapa
function MapEventListener({
  onMoveEnd,
}: {
  onMoveEnd: (center: [number, number]) => void;
}) {
  const map = useMapEvents({
    moveend: () => {
      const center = map.getCenter();
      onMoveEnd([center.lat, center.lng]);
    },
  });
  return null;
}

export function AddressMapModal({
  isOpen,
  onClose,
  onConfirm,
}: AddressMapModalProps) {
  const [centerMap, setCenterMap] = useState<[number, number]>(DEFAULT_CENTER);
  const [currentAddress, setCurrentAddress] = useState<string>("Carregando endereço...");
  const [isGeocoding, setIsGeocoding] = useState<boolean>(false);
  
  // Timeout para "debounce", não ficar pesando a API pública enquanto a pessoa arrasta rápido
  const geocodeTimeout = useRef<number | null>(null);

  // Usa Nominatim/OSM para transformar Lat/Lng em rua
  const reverseGeocode = useCallback(async (lat: number, lng: number) => {
    try {
      setIsGeocoding(true);
      // Nominatim public API endpoint
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();

      let displayName = "Endereço desconhecido";
      
      // Limpeza pra retornar algo bonitinho (ex: Rua João, Tirol, Natal)
      if (data && data.address) {
        const road = data.address.road || data.address.pedestrian || "";
        const suburb = data.address.suburb || data.address.neighbourhood || "";
        
        // Forma simples e bonita
        if (road && suburb) {
           displayName = `${road}, ${suburb}`;
        } else if (road) {
           displayName = road;
        } else if (data.name) {
           displayName = data.name; // Locais públicos
        } else {
           displayName = data.display_name.split(',')[0]; //Fallback genérico
        }
      }
      setCurrentAddress(displayName);
    } catch (error) {
      console.error(error);
      setCurrentAddress("Erro ao buscar Rua. (Você vai preencher depois)");
    } finally {
      setIsGeocoding(false);
    }
  }, []);

  // Quando o mapa terminar de mover, aciona a busca do Nominatim
  const handleMapMoveEnd = (coords: [number, number]) => {
    setCenterMap(coords);
    setCurrentAddress("Buscando..."); // Feedback visual
    
    if (geocodeTimeout.current) {
        clearTimeout(geocodeTimeout.current);
    }
    
    // Espera 600ms parado antes de chamar API, pra poupar bateria/dados
    geocodeTimeout.current = window.setTimeout(() => {
        reverseGeocode(coords[0], coords[1]);
    }, 600);
  };

  // Setup inicial: Pegar o GPS local ou fazer o primeiro geocoding de Natal
  useEffect(() => {
    if (isOpen) {
        // Tenta pegar o GPS pra ajudar
        if (navigator.geolocation && window.isSecureContext) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const newCenter: [number, number] = [pos.coords.latitude, pos.coords.longitude];
                    setCenterMap(newCenter);
                    reverseGeocode(newCenter[0], newCenter[1]);
                },
                () => {
                    // Sem permissão de GPS, cairemos no DEFAULT_CENTER
                    reverseGeocode(DEFAULT_CENTER[0], DEFAULT_CENTER[1]);
                },
                { timeout: 5000 }
            );
        } else {
            reverseGeocode(DEFAULT_CENTER[0], DEFAULT_CENTER[1]);
        }
    }
  }, [isOpen, reverseGeocode]);


  if (!isOpen) return null;

  return createPortal(
    <div
      className={styles.modalOverlay}
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
    >
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3>📍 Onde devemos entregar?</h3>
          <button className={styles.closeButton} onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className={styles.mapWrapper}>
          <MapContainer
            center={centerMap}
            zoom={16}
            className={styles.mapContainer}
            zoomControl={false}
            // Retirar interações pesadas padrão se quiser, mas assim tá ótimo
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {/* O evento de movimento */}
            <MapEventListener onMoveEnd={handleMapMoveEnd} />
          </MapContainer>

          {/* O Pino customizado parado sempre bem no meio do flexbox, fixo sobre o mapa */}
          <div className={styles.centerCrosshair}>
             <MapPin size={48} />
          </div>
        </div>

        <div className={styles.footer}>
          <p className={styles.confirmMessage}>
            Arraste o mapa até o Pino estar em cima da sua casa.
          </p>
          
          <h4 className={styles.currentAddressText}>
            {isGeocoding ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <Loader2 size={16} className={styles.loadingSpinner} /> Lendo mapa...
                </span>
            ) : (
                currentAddress
            )}
          </h4>

          <button
            className={styles.confirmButton}
            disabled={isGeocoding}
            onClick={() => {
              onConfirm({
                address: currentAddress,
                lat: centerMap[0],
                lng: centerMap[1]
              });
            }}
          >
            <Check size={20} />
            Confirmar este local
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
