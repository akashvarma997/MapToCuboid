import React, { useRef, useEffect, useState } from "react";
import Map, { Marker } from "react-map-gl";
import BabylonScene from "./components/BabylonScene.jsx";

const MAPBOX_TOKEN =
  "pk.eyJ1IjoiYWthc2g5OTciLCJhIjoiY2wwbDVjOHpzMHN5ZjNrdW9tMTF3NnJyayJ9.bVamGEfsQXURR40Vw3077A";

export default function App() {
  //useRef hook is used to create a ref for Map component.
  const mapRef = useRef();
  const [searchValue, setSearchValue] = useState("");
  const [fixedLocation, setFixedLocation] = useState({
    latitude: 37.8,
    longitude: -122.4,
  });
  const [viewState, setViewState] = React.useState({
    latitude: 37.8,
    longitude: -122.4,
    zoom: 6,
  });
  const [image, setImage] = useState("");
  const [mapStyle, setMapStyle] = useState(
    "mapbox://styles/mapbox/outdoors-v11"
  );
  const [isSatellite, setIsSatellite] = useState(false);

  //The captureMap function is defined to capture the map as an image.
  function captureMap() {
    const map = mapRef.current.getMap();
    if (map) {
      map.once("render", function () {
        const canvas = map.getCanvas();
        if (canvas) {
          const image = canvas.toDataURL("image/png");
          setImage(image);
        }
      });
      map.triggerRepaint();
    }
  }

  //The toggleMapStyle function is defined to toggle between map styles.
  function toggleMapStyle() {
    if (mapStyle === "mapbox://styles/mapbox/outdoors-v11") {
      setMapStyle("mapbox://styles/mapbox/satellite-v9");
      setIsSatellite(true);
    } else {
      setMapStyle("mapbox://styles/mapbox/outdoors-v11");
      setIsSatellite(false);
    }
  }

  //The handleSearch function is defined to handle the search operation when the user searches for a location.
  async function handleSearch() {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${searchValue}.json?access_token=${MAPBOX_TOKEN}`
    );
    console.log(response);
    const data = await response.json();
    const newLongitude = data["features"][0]["center"][0];
    const newLatitude = data["features"][0]["center"][1];
    setFixedLocation({
      longitude: newLongitude,
      latitude: newLatitude,
    });
    setViewState({
      longitude: newLongitude,
      latitude: newLatitude,
      zoom: 6,
    });
  }

  return (
    //Map component from react-map-gl package, a Marker component to display a marker on the map at a fixed location, and 3 buttons for searching, capturing and toggling-mapStyle.
    <div className="container">
      <div>
        <div className="Map">
          <Map
            {...viewState}
            onMove={(evt) => setViewState(evt.viewState)}
            ref={mapRef}
            style={{ width: 500, height: 500 }}
            mapStyle={mapStyle}
            mapboxAccessToken={MAPBOX_TOKEN}
          >
            <Marker
              longitude={fixedLocation.longitude}
              latitude={fixedLocation.latitude}
              color="red"
            />
          </Map>
        </div>
        <div className="btn">
          <input
            type="text"
            placeholder="Enter Location"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
          <button onClick={captureMap}>Capture Map</button>
          <button onClick={toggleMapStyle}>
            {isSatellite ? "Normal-view" : "Satellite-view"}
          </button>
        </div>
      </div>
      <div>
        <BabylonScene image={image} />
      </div>
    </div>
  );
}
