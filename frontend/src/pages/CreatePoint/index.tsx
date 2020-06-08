import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Dropzone from "../../components/Dropzone";
import { FiArrowLeft } from "react-icons/fi";
import "./styles.css";

import logo from "../../assets/svg/logo.svg";
import api from "../../services/api";

interface Item {
  id: number;
  title: string;
  image: string;
}

const CreatePoint = () => {
  const [file, setFile] = useState<any>();
  const [selectedFile, setSelectedFile] = useState<File>();
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    getItems();
  }, []);

  const getItems = async () => {
    const response = await api.get("/items");
    setItems(response.data.items);
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
      <form>
        <h1>
          Cadastro do <br></br> ponto de coleta
        </h1>
        <Dropzone onFileUploaded={setSelectedFile} />
        <fieldset>
          <legend>
            <h2>Dados</h2>
          </legend>
          <div className="field-group">
            <div className="field">
              <label htmlFor="name">Nome do estabelecimento</label>
              <input type="text" name="name" id="name"></input>
            </div>
          </div>

          <div className="field-group">
            <div className="field">
              <label htmlFor="email">E-mail</label>
              <input type="text" name="email" id="email"></input>
            </div>
            <div className="field">
              <label htmlFor="name">Whatsapp</label>
              <input type="text" name="whatsapp" id="whatsapp"></input>
            </div>
          </div>
        </fieldset>
        <fieldset>
          <legend>
            <h2>Endereço</h2>
            <span>Selecione o endereço no mapa</span>
          </legend>

          <div className="field-group">
            <div className="field">
              <label htmlFor="uf">Estado (UF)</label>
              <select name="uf" id="uf">
                <option value="0">Selecione uma UF</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="city">Estado (UF)</label>
              <select name="city" id="city">
                <option value="0">Selecione uma cidade</option>
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
                <li key={item.id}>
                  <img src={`http://localhost:3333/files/${item.image}`}></img>
                  <span>{item.title}</span>
                </li>
              ))}
          </ul>
        </fieldset>
      </form>
    </div>
  );
};

export default CreatePoint;
