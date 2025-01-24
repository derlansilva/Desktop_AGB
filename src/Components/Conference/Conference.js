import React, { useEffect, useState } from "react";
import { data, useLocation } from "react-router-dom";
import apiServices from "../../services/apiServives";


const Conference = ({ selectedManifests }) => {

  const location = useLocation();
  // Estado para controlar os inputs
  const [codigoBarras, setCodigoBarras] = useState(""); // Código de barras da caixa
  const [quantidade, setQuantidade] = useState(""); // Quantidade do produto
  const [showQuantidade, setShowQuantidade] = useState(false); // Controle de exibição do campo de quantidade
  const [produtoDescricao, setProdutoDescricao] = useState("");

  const [products, setProducts] = useState([]);
  const [manifests, setManifests] = useState([])
  
  const { manifestId } = location.state || {};

  const [quantity, setQuantity] = useState(0);

  const [total, setTotal] = useState();
  const [confered , setConferid] = useState(0)
  const [faltas , setFaltas] = useState(0)


  useEffect(() => {
    const fetchManifest = async () => {
      try {
        const idManifest = manifestId.join(","); // "1,2,3"
        const data = await apiServices.getManifestById(idManifest);

        setProducts(data.products)
        setManifests(data.manifestName)

        setTotal(data.quantity);
        setFaltas(data.quantity);


      } catch (error) {
        //setError('Erro ao carregar manifestos.');
      }

    };

    fetchManifest();
  }, [])


  const manifestos = ["MAN001", "MAN002", "MAN003"]; // Exemplos de manifestos


  // Função para lidar com a leitura do código de barras da caixa
  const handleCodigoBarrasChange = (e) => {

    const valor = e.target.value;
    //playerSound();
    setCodigoBarras(valor);

    // Simula a busca pela descrição do produto com base no código de barras da caixa
    const findedProduct = products.find((item) => item.code == valor);
    if (findedProduct) {

      setProdutoDescricao(findedProduct.description); // Exibe a descrição do produto
      setQuantity(findedProduct.quantity)
      setShowQuantidade(true); // Exibe o campo de quantidade
       // Limpa o campo de código de barras

    } else {
      setProdutoDescricao(""); // Limpa a descrição se o código não for encontrado
      setShowQuantidade(false); // Esconde o campo de quantidade
    }
  };

  // Função para lidar com o campo de quantidade
  const handleQuantityChange = (e) => {

    const valor = e.target.value;  // Quantidade informada
    const quantidadeInformada = parseInt(valor); // Converte para inteiro
    //playerSound()
    console.log("codigo de barras " , codigoBarras)

    // Verifica se a quantidade informada é válida
    if (quantidadeInformada > 0) {
      // Mapeia os produtos e atualiza a quantidade do produto correto
      const updatedProducts = products.map((item) => {
        console.log("codigo no map " , item.code)
        if (item.code === String(codigoBarras)) {

          setConferid(confered + quantidadeInformada)
          setFaltas(faltas - quantidadeInformada)
          // Verifica se a quantidade informada é menor ou igual à quantidade disponível
          if (item.quantity >= quantidadeInformada) {
            setCodigoBarras("")
            return {
              ...item,
              quantity: item.quantity - quantidadeInformada // Subtrai a quantidade informada
            };
          } else {
            alert("Quantidade informada maior do que a disponível!");
            setQuantidade("")
            return;
          }
        }
        return item; // Retorna o item não alterado
      });

      setProducts(updatedProducts); // Atualiza o estado com o novo array de produtos
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

  // Função para resetar o fluxo após preenchimento da quantidade
  const handleFinalizarProduto = () => {
    // Aqui você pode salvar a quantidade no seu banco de dados ou fazer outra ação necessária
    setQuantidade(""); // Limpa a quantidade
    setShowQuantidade(false); // Esconde o campo de quantidade
    setProdutoDescricao(""); // Limpa a descrição do produto
    setCodigoBarras(""); // Exibe o campo de código de barras novamente
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
    interromper: false,
    finalizar: false,
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
    <p className="text-primary font-weight-bolder" style={{ letterSpacing: '-0.10px' }}>TOTAL {total}</p>
  </div>
  <div className="col-md-4 text-center">
    <p className="text-success font-weight-bolder" style={{ letterSpacing: '-0.5px' }}>CONFERIDOS {confered}</p>
  </div>
  <div className="col-md-4 text-center">
    <p className="text-danger font-weight-bolder" style={{ letterSpacing: '-0.5px' }}>FALTAS {faltas}</p>
  </div>
</div>
      <hr/>

      {/* Div 3: Input de Código de Barras e Quantidade */}
      <div className="mb-6 " style={{height: "90px"}}>
        {/* Exibe o campo de código de barras quando não foi lido */}
        {!showQuantidade && (
          <input
            type="text"
            className="form-control w-50 mx-auto mb-2"
            placeholder="Código de Barras da Caixa"
            value={codigoBarras}
            onChange={handleCodigoBarrasChange}
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

      <hr/>
      {/* Div 4: Tabela de Itens com rolagem */}
      <div className="mt-6">

        <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
          <table className="table table-striped mt-9">
            <thead>
              <tr>
                <th>Item</th>
                <th>Descrição</th>
                <th>Quantidade</th>
              </tr>
            </thead>
            <tbody>
              {products.map((item) => (
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

      {/* Div 5: Botões Abaixo da Tabela */}
      <div className="row mb-0">
        <div className="col-md-3">
          <button
            className="btn w-100 btn-primary"
            onClick={() => handleButtonClick("interromper")}
          >
            Interromper
          </button>
        </div>
        <div className="col-md-3">
          <button
            className="btn w-100 btn-danger"
            onClick={() => handleButtonClick("finalizar")}
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


export default Conference;