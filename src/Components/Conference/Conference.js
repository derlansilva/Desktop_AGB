import React, { useEffect, useState } from "react";
import { data, useLocation, useNavigate } from "react-router-dom";
import apiServices from "../../services/apiServices";

import 'bootstrap/dist/css/bootstrap.min.css';

import "./styles/style.css"

const Conference = () => {

  const location = useLocation();
  // Estado para controlar os inputs
  const [barCode, setBarCode] = useState(""); // Código de barras da caixa
  const [scannedItems, setScannedItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showModalInterroper, setShowModalInterroper] = useState(false);

  const [quantidade, setQuantidade] = useState(""); // Quantidade do produto
  const [showQuantidade, setShowQuantidade] = useState(false); // Controle de exibição do campo de quantidade
  const [produtoDescricao, setProdutoDescricao] = useState("");


  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [itemManifest, setItemsManifest] = useState([]);

  const [manifests, setManifests] = useState([])
  const [manifestStart, setManifestStart] = useState([])

  const { manifestId } = location.state || { manifestId: [] };
  const [quantity, setQuantity] = useState(0);

  const [total, setTotal] = useState();
  const [confered, setConferid] = useState(0)
  const [faltas, setFaltas] = useState(0)

  useEffect(() => {
    const fetchManifest = async () => {

      try {
        //const idManifest = manifestId.join(","); // "1,2,3"
        const response = await Promise.all(
          manifestId.map(id => apiServices.getManifestById(id))
        )

        setManifestStart(response)

        const allProducts = response.flatMap(manifest => manifest.itemManifest || []);

        const totalItems = response.reduce((sum, product) =>
          sum + (product.itemManifest?.reduce((subSum, item) => subSum + item.quantity, 0) || 0), 0);


        setProducts(allProducts)
        setItemsManifest(allProducts);
        setTotal(totalItems)
        setFaltas(totalItems)

      } catch (error) {
        //setError('Erro ao carregar manifestos.');
      }

    };

    fetchManifest();
  }, [])


  const sounds = {
    success: new Audio("/assets/success.mp3"),
    error: new Audio("/assets/error.mp3"),
  };

  const playSound = (type) => {
    if (sounds[type]) {
      sounds[type].currentTime = 0;
      sounds[type].play();
    }
  }

  // Função para lidar com a leitura do código de b arras da caixa
  const handleBarCode = (e) => {

    const valor = e.target.value;
    //playerSound();
    setBarCode(valor);

    // Simula a busca pela descrição do produto com base no código de barras da caixa
    const findedProduct = products.find((item) => item.code == valor);
    const now = new Date().toISOString()
    if (findedProduct) {
      playSound("success");
      setProdutoDescricao(findedProduct.description); // Exibe a descrição do produto
      setQuantity(findedProduct.quantity)
      setShowQuantidade(true); // Exibe o campo de quantidade
      // Limpa o campo de código de barras

    } else {
      playSound("error")
      setProdutoDescricao(""); // Limpa a descrição se o código não for encontrado
      setShowQuantidade(false); // Esconde o campo de quantidade
    }
  };

  const handleUpdateManifest = (value) => {

    const manifestCopy = structuredClone(manifestStart);  

    manifestCopy.flatMap((items) => {
      items.itemManifest.map(product => {
        if(product.code === barCode){
          product.quantity -= value;
          product.quantityConfered += value
        }
      })
    })

    setManifestStart(manifestCopy);

  };

  // Função para lidar com o campo de quantidade
  const handleQuantityChange = (e) => {

    const valor = e.target.value;  // Quantidade informada
    const quantidadeInformada = parseInt(valor); // Converte para inteiro
    
    handleUpdateManifest(quantidadeInformada)
    
    // Verifica se a quantidade informada é válida
    if (quantidadeInformada > 0) {
      // Mapeia os produtos e atualiza a quantidade do produto correto
      const updatedProducts = products.map((item) => {
        if (item.code === String(barCode)) {

          setConferid(confered + quantidadeInformada)
          setFaltas(faltas - quantidadeInformada)

          //atualiza a lista para envio ao back end
          setScannedItems((prev) => {
            const itemExist = prev.find((scanner) => scanner.code === barCode);
            const now = new Date().toISOString()
            if (itemExist) {
              return prev.map((scanner) =>
                scanner.code === barCode
                  ? { ...scanner, quantity: scanner.quantity + quantidadeInformada, capture: now }
                  : scanner

              );
            } else {

              return [...prev, { code: barCode, description: item.description, quantity: quantidadeInformada, capture: now }]
            }

          })
          // Verifica se a quantidade informada é menor ou igual à quantidade disponível
          if (item.quantity >= quantidadeInformada) {
            setBarCode("")
            playSound("success")
           
            return {
              ...item,
              quantity: item.quantity - quantidadeInformada ,// Subtrai a quantidade informada
              quantityConfered:item.quantityConfered + quantidadeInformada
            };
          } else {
            playSound("error")
            //aqui aparecer um modal de error
            setQuantidade("")
            return;
          }
        }
        
        return item; // Retorna o item não alterado
      });

      const filterProducts = updatedProducts.filter(item => item.quantity > 0);
      setProducts(filterProducts); // Atualiza o estado com o novo array de produtos
      setQuantidade(""); // Limpa o campo de entrada
      setShowQuantidade(false); // Esconde o campo de quantidade
    } else {
      alert("Quantidade inválida!");
      setQuantidade(""); // Limpa o campo de entrada se a quantidade for inválida
    }


  }

  const playerSound = () => {
    const audio = new Audio("../../assets/soundOK.mp3");

    audio.play()
  }

  const handleInterromper = async () => {
    try {
      await Promise.all(
        manifestStart.map(async (manifest) => {
          const payload =  manifest;
          console.log("Dados enviados:", JSON.stringify(payload, null, 2));
  
          console.log("Enviando manifesto para o backend:", payload);
  
          const response = await apiServices.updateManifest(
            payload, 
            manifest.id,
            { headers: { "Content-Type": "application/json" } }
          );
  
          console.log("Resposta do backend:", response);
          
          return response;
        })
      );
  
      console.log("Todos os manifestos foram atualizados com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar manifestos:", error);
    }
  };
  

  const handleFinnishConference = async () => {
    try {
      console.log(scannedItems)
    } catch (error) {

    }
  }
  // Função para resetar o fluxo após preenchimento da quantidade
  const handleFinalizarProduto = () => {
    // Aqui você pode salvar a quantidade no seu banco de dados ou fazer outra ação necessária
    setQuantidade(""); // Limpa a quantidade
    setShowQuantidade(false); // Esconde o campo de quantidade
    setProdutoDescricao(""); // Limpa a descrição do produto
    setBarCode(""); // Exibe o campo de código de barras novamente
  };

  // Função chamada assim que o usuário inserir a quantidade
  const handleQuantidadeSubmit = () => {
    console.log("estou no hanlequantidade")
    if (quantidade !== "") {
      handleFinalizarProduto(); // Reinicia o fluxo assim que a quantidade for inserida
    }
  };

  // Estado para controlar os botões
  const [buttonState, setButtonState] = useState({
    imprimir: false,
  });

  // Função para alterar o estado dos botões
  const handleButtonClick = (button) => {
    setButtonState((prevState) => ({
      ...prevState,
      [button]: !prevState[button],
    }));
  };

  return (

    <div className="container mt-0">
      {/* Div 1: Números de Manifestos */}
      <div className="row mt-1">
        {/* {manifestos.map((manifesto, index) => (
          <div key={index} className="col-md-2 mb-2">
            <div className="p-3 rounded">
              <h5>{manifesto}</h5>
            </div>
          </div>
        ))}*/}

        <div className="p-3 rounded">
          Nº manifesto <h5>{manifests}</h5>
        </div>
      </div>

      {/* Div 2: Textos coloridos */}
      <div className="row mb-1 mt-1">
        <div className="col-md-4 text-center">
          <p className=" showtotal" style={{ letterSpacing: '-0.10px' }}>TOTAL {total}</p>
        </div>
        <div className="col-md-4 text-center">
          <p className=" showconferidos" style={{ letterSpacing: '-0.5px' }}>CONFERIDOS {confered}</p>
        </div>
        <div className="col-md-4 text-center">
          <p className="showfaltas" style={{ letterSpacing: '-0.5px' }}>FALTAS {faltas}</p>
        </div>
      </div>
      <hr />

      {/* Div 3: Input de Código de Barras e Quantidade */}
      <div className="mb-6 " style={{ height: "90px" }}>
        {/* Exibe o campo de código de barras quando não foi lido */}
        {!showQuantidade && (
          <input
            type="text"
            className="form-control w-50 mx-auto mb-2"
            placeholder="Código de Barras da Caixa"
            value={barCode}
            onChange={handleBarCode}
            autoFocus
          />
        )}

        {/* Exibe a descrição do produto e o campo de quantidade se o código for encontrado */}
        {showQuantidade && (
          <div>
            <div className="mb-2 text-center">
              <label className="form-label">{produtoDescricao}</label>

            </div>

            <div className="mb-1">

              <input
                type="text"
                className="form-control w-50 mx-auto mb-2"
                placeholder="Quantidade"
                value={quantidade}
                onChange={handleQuantityChange}
                autoFocus // Finaliza o fluxo assim que o campo perder o foco
              />
            </div>
          </div>
        )}
      </div>

      <hr />
      {/* Div 4: Tabela de Itens com rolagem */}
      <div className="mt-2">

        <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
          <table className="table table-striped mt-9">
            <thead>
              <tr>
                <th>Item</th>
                <th>Descrição</th>
                <th>Quantidade</th>
              </tr>
            </thead>
            <tbody>
              {products.filter((item) => item.quantity > 0)
                .map((item) => (
                  <tr key={item.code}>
                    <td>{item.code}</td>
                    <td>{item.description}</td>
                    <td>{item.quantity}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>


      {/* Modal de Confirmação */}
      {showModal && (

        <div className="modal-overlay" style={modalOverlayStyle}>
          <div className="modal fade show d-block" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Confirmação </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  DESEJA FINALIZAR A CONFERENCIA?
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Cancelar
                  </button>
                  <button className="btn btn-danger" onClick={handleFinnishConference()}>
                    Finalizar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}



      {/* Modal de Confirmação */}
      {showModalInterroper && (

        <div className="modal-overlay" style={modalOverlayStyle}>
          <div className="modal fade show d-block" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Confirmação </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModalInterroper(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  DESEJA MESMO INTERROPER A CONFERENCIA ?
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setShowModalInterroper(false)}>
                    CANCELAR
                  </button>
                  <button className="btn btn-danger" onClick={() => {
                    handleInterromper();
                    setShowModalInterroper(false);
                  }}>
                    CONFIRMAR
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Div 5: Botões Abaixo da Tabela */}
      <div className="row bottons">
        <div className="col-md-3">
          <button
            className="btn w-100 btn-primary"
            onClick={() => setShowModalInterroper(true)}
          >
            Interromper
          </button>
        </div>
        <div className="col-md-3">
          <button
            className="btn w-100 btn-danger"
            onClick={() => setShowModal(true)}
          >
            Finalizar
          </button>
        </div>
        <div className="col-md-3">
          <button
            className={`btn w-100 ${buttonState.imprimir ? "btn-success" : "btn-danger"}`}
            onClick={() => handleButtonClick("imprimir")}
          >
            Imprimir
          </button>
        </div>
        <div className="col-md-3">
          <button className="btn w-100 btn-secondary">Liberar Sistema</button>
        </div>
      </div>

    </div>
  )
}


const modalOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
};

const modalContainerStyle = {
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '10px',
  width: '50%',
  maxWidth: '600px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
};

const modalHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderBottom: '1px solid #ddd',
  paddingBottom: '10px',
};

const closeButtonStyle = {
  background: 'none',
  border: 'none',
  fontSize: '18px',
  cursor: 'pointer',
};

const modalBodyStyle = {
  padding: '20px 0',
};

const modalFooterStyle = {
  display: 'flex',
  justifyContent: 'flex-end',
  marginTop: '20px',
};

const cancelButtonStyle = {
  marginRight: '10px',
};

const confirmButtonStyle = {};



export default Conference;