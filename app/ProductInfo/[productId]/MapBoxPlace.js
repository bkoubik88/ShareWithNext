"use client";
import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
mapboxgl.accessToken = `${process.env.NEXT_PUBLIC_MAPBOX}`;

export default function MapBoxPlace({ product }) {
  const mapContainer = useRef();
  const map = useRef(null);

  useEffect(() => {
    sessionStorage.setItem("productId", product._id);
  }, [product]);

  useEffect(() => {
    if (mapContainer?.current) {
      if (map.current) return;
      map.current = new mapboxgl.Map({
        container: mapContainer?.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [product?.lngLat[0].longitude, product?.lngLat[0].latitude],
        zoom: 12,
      });

      const nav = new mapboxgl.NavigationControl({
        visualizePitch: true,
      });
      map.current.addControl(nav, "bottom-right");

      new mapboxgl.Marker()
        .setLngLat([product?.lngLat[0].longitude, product?.lngLat[0].latitude])
        .addTo(map.current);
    }
  }, [mapContainer?.current, product]);

  return (
    <div>
      <div className="map-container w-full h-96" ref={mapContainer} />
    </div>
  );
}
