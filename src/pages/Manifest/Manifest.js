import React, { useEffect, useState } from "react";
import apiServices from "../../services/apiServives";
import { useNavigate } from "react-router-dom";


function Manifest() {

  const [manifest, setManifest] = useState([]);
  const [selectedManifests, setSelectedManifests] = useState([]);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();


  const handleCloseModal = (action) => {
    console.log(`Conferência foi: ${action}`);
    setShowModal(false);
  };

  useEffect(() => {
    const fetchManifest = async () => {
      try {

        const data = await apiServices.getManifestActive();

        console.log(data)
        setManifest(data);
        

      } catch (error) {
        setError('Erro ao carregar manifestos.');
      }

    };

    fetchManifest();
  }, [])


   // Bloqueio para impedir o fechamento da aba enquanto o modal estiver aberto
    useEffect(() => {
      const handleBeforeUnload = (e) => {
        if (showModal) {
          const message = "Você está em uma conferência. Se sair, ela será interrompida.";
          e.returnValue = message; // Para navegadores modernos
          return message; // Para navegadores mais antigos
        }
      };
  
      window.addEventListener("beforeunload", handleBeforeUnload);
  
      // Cleanup ao desmontar o componente
      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
      };
    }, [showModal]);
  



  // Função para alternar seleção de um manifesto
  const toggleSelection = (id) => {
    setSelectedManifests((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((manifestId) => manifestId !== id) // Deseleciona
        : [...prevSelected, id] // Seleciona
    );
  };

  // Verifica se um manifesto está selecionado
  const isSelected = (id) => selectedManifests.includes(id);

  const startConference = () => {
    alert(`Conferência iniciada para os manifestos: ${selectedManifests.join(', ')}`);
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
            onClick={() => navigate('/conference')}
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
