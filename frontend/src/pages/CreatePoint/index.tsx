import React, { useState, useEffect, FormEvent } from "react";
import { Link } from "react-router-dom";
import Dropzone from "../../components/Dropzone";
import { FiArrowLeft } from "react-icons/fi";
import { Map, TileLayer, Marker } from "react-leaflet";
import { LeafletMouseEvent } from "leaflet";
import "./styles.css";

import logo from "../../assets/svg/logo.svg";
import api from "../../services/api";
import ibge from "../../services/ibge";

interface Item {
  id: number;
  title: string;
  image: string;
}

interface IBGEUFS {
  id: number;
  sigla: string;
  name: string;
  region: {
    id: number;
    sigla: string;
    name: string;
  };
}

interface IBGECITIES {
  id: number;
  name: string;
}

interface LATLNG {
  lat: number;
  lng: number;
}

const CreatePoint = () => {
  const [file, setFile] = useState<any>();
  const [selectedFile, setSelectedFile] = useState<any>();
  const [items, setItems] = useState<Item[]>([]);
  const [selectedItemsArray, setSelectedItemsArray] = useState<number[]>([]);
  const [ufs, setUfs] = useState<IBGEUFS[]>([]);
  const [selectedUf, setSelectedUf] = useState<number>(0);
  const [allCities, setAllCities] = useState<IBGECITIES[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedLatLng, setSelectedLatLng] = useState<LATLNG>({
    lat: -21.5383665,
    lng: -43.0097713,
  });
  const [name, setName] = useState<string>();
  const [email, setEmail] = useState<string>();
  const [whatsapp, setWhatsapp] = useState<number>();

  useEffect(() => {
    getItems();
    getUfs();
  }, []);

  useEffect(() => {
    getCitiesByUf();
  }, [selectedUf]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setSelectedLatLng({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    });
  }, []);

  const getItems = async () => {
    const response = await api.get("/items");
    setItems(response.data.items);
  };

  const getUfs = async () => {
    const response = await ibge.get("/estados");
    const realUf = response.data.map((uf: any) => {
      return {
        name: uf.nome,
        sigla: uf.sigla,
        region: uf.regiao,
        id: uf.id,
      };
    });
    setUfs(realUf);
  };

  const getCitiesByUf = async () => {
    if (selectedUf) {
      const response = await ibge.get(`/estados/${selectedUf}/municipios`);
      const realData = response.data.map((item: any) => {
        return {
          id: item.id,
          name: item.nome,
        };
      });
      setAllCities(realData);
    }
  };

  const filterArrayItem = (item: number, id: number) => {
    return item !== id;
  };

  const addSelectedItem = (id: number) => {
    const placeholderSelectedItem = selectedItemsArray;
    if (!placeholderSelectedItem.includes(id)) {
      setSelectedItemsArray(placeholderSelectedItem.concat(id));
    } else {
      const placeholder: number[] = [];
      placeholderSelectedItem.forEach((item) => {
        if (item !== id) {
          placeholder.push(item);
        }
      });
      setSelectedItemsArray(placeholder);
    }
  };

  const onMapClick = (event: LeafletMouseEvent) => {
    setSelectedLatLng(event.latlng);
  };

  const onDropFile = (acceptedFiles: any) => {
    setSelectedFile(acceptedFiles[0]);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    let allItemsSanitized = "";
    selectedItemsArray.forEach((item) => {
      if (allItemsSanitized) {
        allItemsSanitized = allItemsSanitized + "," + item.toString();
      } else {
        allItemsSanitized = item.toString();
      }
    });
    const formData = new FormData();
    formData.append("name", String(name));
    formData.append("email", String(email));
    formData.append("whatsapp", String(whatsapp));
    formData.append("items", allItemsSanitized);
    formData.append("city", selectedCity);
    const uf = ufs.filter((uf) => uf.id === selectedUf)[0];
    formData.append("uf", String(uf.sigla));
    formData.append("latitude", String(selectedLatLng.lat));
    formData.append("longitude", String(selectedLatLng.lng));
    formData.append("file", selectedFile);
    const response = await api.post("/points", formData);
  };

  return (
    <div id="page-create-point">
      <header>
        <img src={logo} alt="Ecoleta logo"></img>

        <Link to="/">
          <FiArrowLeft />
          Voltar para home
        </Link>
      </header>
      <form onSubmit={handleSubmit}>
        <h1>
          Cadastro do <br></br> ponto de coleta
        </h1>
        <Dropzone onFileUploaded={onDropFile} />
        <fieldset>
          <legend>
            <h2>Dados</h2>
          </legend>
          <div className="field-group">
            <div className="field">
              <label htmlFor="name">Nome do estabelecimento</label>
              <input
                type="text"
                name="name"
                id="name"
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <div className="field-group">
            <div className="field">
              <label htmlFor="email">E-mail</label>
              <input
                type="text"
                name="email"
                id="email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="name">Whatsapp</label>
              <input
                type="text"
                name="whatsapp"
                id="whatsapp"
                onChange={(e) => setWhatsapp(parseInt(e.target.value))}
              />
            </div>
          </div>
        </fieldset>
        <fieldset>
          <legend>
            <h2>Endereço</h2>
            <span>Selecione o endereço no mapa</span>
          </legend>

          <Map
            center={[selectedLatLng.lat, selectedLatLng.lng]}
            zoom={15}
            onClick={onMapClick}
          >
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[selectedLatLng.lat, selectedLatLng.lng]} />
          </Map>

          <div className="field-group">
            <div className="field">
              <label htmlFor="uf">Estado (UF)</label>
              <select
                onChange={(e) => setSelectedUf(parseFloat(e.target.value))}
                name="uf"
                id="uf"
              >
                {ufs.map((uf) => {
                  return (
                    <option key={uf.id} value={uf.id}>
                      {uf.name}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="field">
              <label htmlFor="city">Cidade</label>
              <select
                onChange={(e) => setSelectedCity(e.target.value)}
                value={selectedCity}
                name="city"
                id="city"
              >
                {allCities.map((city) => (
                  <option key={city.id} value={city.name}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </fieldset>
        <fieldset>
          <legend>
            <h2>Itens de coleta</h2>
            <span>Selecione um ou mais itens abaixo</span>
          </legend>
          <ul className="items-grid">
            {items &&
              items.map((item) => (
                <li
                  className={
                    selectedItemsArray.includes(item.id) ? "selected" : ""
                  }
                  onClick={() => addSelectedItem(item.id)}
                  key={item.id}
                >
                  <img src={`http://localhost:3333/files/${item.image}`}></img>
                  <span>{item.title}</span>
                </li>
              ))}
          </ul>
        </fieldset>

        <button type="submit">Cadastrar ponto de coleta</button>
      </form>
    </div>
  );
};

export default CreatePoint;
