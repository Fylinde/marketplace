import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet's marker icon import issue
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIconShadow from "leaflet/dist/images/marker-shadow.png";

L.Marker.prototype.options.icon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerIconShadow,
});

// Interface for delivery steps
interface DeliveryStep {
  status: string;
  location: string;
  timestamp: string;
  latitude: number;
  longitude: number;
}

const DeliveryTimeline = ({ timeline }: { timeline: DeliveryStep[] }) => {
  if (!timeline.length) {
    return <p>No delivery data available.</p>;
  }

  const lastKnownLocation = timeline[timeline.length - 1];

  return (
    <div>
      <h4>Delivery Timeline</h4>
      <ul>
        {timeline.map((step, index) => (
          <li key={index}>
            <strong>{step.status}</strong> - {step.location} ({step.timestamp})
          </li>
        ))}
      </ul>
      <h4>Delivery Map</h4>
      <MapContainer
        center={[lastKnownLocation.latitude, lastKnownLocation.longitude]}
        zoom={13}
        style={{ height: "400px", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {timeline.map((step, index) => (
          <Marker
            key={index}
            position={[step.latitude, step.longitude]}
          >
            <Popup>
              <strong>{step.status}</strong><br />
              {step.location}<br />
              {step.timestamp}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default DeliveryTimeline;
