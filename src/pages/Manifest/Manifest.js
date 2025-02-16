import React, { useEffect, useState } from "react";
import apiServices from "../../services/apiServices";
import { useNavigate } from "react-router-dom";


function Manifest() {

  const [manifest, setManifest] = useState([]);
  const [selectedManifests, setSelectedManifests] = useState([]);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  const navigate = useNavigate();


  useEffect(() => {
    const fetchManifest = async () => {
      try {

        const data = await apiServices.getManifestActive();
        setManifest(data);
        

      } catch (error) {
        setError('Erro ao carregar manifestos.');
      }

    };

    fetchManifest();
  }, [])




  // Função para alternar seleção de um manifesto
  const toggleSelection = (id) => {
    console.log(id)
    setSelectedManifests((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((manifestId) => manifestId !== id) // Deseleciona
        : [...prevSelected, id] // Seleciona
    );
  };

  const startConference = () => {
    
    navigate("/home/conference" , {state : {manifestId :selectedManifests}})
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">manifestos em aberto</h1>
      {error && <p className="text-danger text-center">{error}</p>}

      {/* Tabela com os manifestos */}
      <div className="table-responsive"
        style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid #ddd' }}>
        <table className="table table-striped table-bordered">

          <thead className="thead-light">
            <tr>
              <th scope="col">Selecionar</th>
              <th scope="col">Número do Manifesto</th>
              <th scope="col">Quantidade de Itens</th>
            </tr>
          </thead>
          <tbody>
            {manifest.map((manifest) => (
              <tr key={manifest.id}
              className={selectedManifests.includes(manifest.id) ? 'table-primary' : ''}>
                <td className="text-center">
                  <button
                    className="btn"
                    style={{
                      backgroundColor: selectedManifests.includes(manifest.id)
                        ? "#dc3545" // Cor vermelha para "Desselecionar"
                        : "#007bff", // Cor azul para "Selecionar"
                      color: "#fff",
                      padding: "5px 10px",
                      fontSize: "12px",
                      width: "110px",
                      borderRadius: "5px",
                    }}
                    onClick={() => toggleSelection(manifest.id)}
                  >
                    {selectedManifests.includes(manifest.id)
                      ? "Desselecionar"
                      : "Selecionar"}
                  </button>
                </td>
                <td style={{ textAlign: 'center' }}>{manifest.manifestName}</td>
                <td style={{ textAlign: 'center' }}>{manifest.quantity || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>

      {/* Botão "Iniciar Conferência" */}

      {selectedManifests.length > 0 && (
        <div className="mt-4">
          <button
            onClick={startConference}
            className="btn btn-primary btn-lg"
          >
            Iniciar Conferência
          </button>
          
        </div>
      )}


    </div>
  );
}

export default Manifest;
