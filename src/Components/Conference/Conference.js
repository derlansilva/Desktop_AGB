import React, { useState } from "react";


const Conference = () => {

    // Estado para controlar os inputs
  const [codigoBarras, setCodigoBarras] = useState(""); // Código de barras da caixa
  const [quantidade, setQuantidade] = useState(""); // Quantidade do produto
  const [showQuantidade, setShowQuantidade] = useState(false); // Controle de exibição do campo de quantidade
  const [produtoDescricao, setProdutoDescricao] = useState("");
  const [product, setProduct] = useState("");


    const manifestos = ["MAN001", "MAN002", "MAN003"]; // Exemplos de manifestos
    const items = [
        { id: 1, descricao: "Produto A", quantidade: 10 },
        { id: 2, descricao: "Produto B", quantidade: 20 },
        { id: 3, descricao: "Produto C", quantidade: 15 },
        { id: 4, descricao: "Produto D", quantidade: 5 },
        { id: 5, descricao: "Produto E", quantidade: 30 },
        { id: 6, descricao: "Produto F", quantidade: 25 },
        { id: 7, descricao: "Produto G", quantidade: 8 },
        { id: 8, descricao: "Produto H", quantidade: 12 },
    ];

 // Função para lidar com a leitura do código de barras da caixa
 const handleCodigoBarrasChange = (e) => {
   const valor = e.target.value;
   setCodigoBarras(valor);

   // Simula a busca pela descrição do produto com base no código de barras da caixa
   const produtoEncontrado = items.find((item) => item.id === parseInt(valor));
    setProduct(produtoEncontrado)

    console.log(produtoEncontrado)
   if (produtoEncontrado) {
     setProdutoDescricao(produtoEncontrado.descricao); // Exibe a descrição do produto
     setShowQuantidade(true); // Exibe o campo de quantidade
     setCodigoBarras(""); // Limpa o campo de código de barras
   } else {
     setProdutoDescricao(""); // Limpa a descrição se o código não for encontrado
     setShowQuantidade(false); // Esconde o campo de quantidade
   }
 };

 // Função para lidar com o campo de quantidade
 const handleQuantidadeChange = (e) => {
    
        const valor = e.target.value;
        setQuantidade(valor);
     
        // Simula a busca pela descrição do produto com base no código de barras da caixa
        const produtoEncontrado = items.find((item) => item.id === parseInt(valor));
     
        if (produtoEncontrado) {
          setProdutoDescricao(produtoEncontrado.descricao); // Exibe a descrição do produto
          setShowQuantidade(true); // Exibe o campo de quantidade
          setCodigoBarras(""); // Limpa o campo de código de barras
        } else {
          setProdutoDescricao(""); // Limpa a descrição se o código não for encontrado
          setShowQuantidade(false); // Esconde o campo de quantidade
        }
      
      // Função para 
 };

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

        <div className="container mt-4">
            {/* Div 1: Números de Manifestos */}
            <div className="row mb-1">
                {manifestos.map((manifesto, index) => (
                    <div key={index} className="col-md-2 mb-2">
                        <div className="p-3 rounded">
                            <h5>{manifesto}</h5>
                        </div>
                    </div>
                ))}
            </div>

            {/* Div 2: Textos coloridos */}
            <div className="row mb-4">
                <div className="col-md-4 text-center">
                    <p className="text-primary">TOTAL 100</p>
                </div>
                <div className="col-md-4 text-center">
                    <p className="text-success">CONFERIDOS 20</p>
                </div>
                <div className="col-md-4 text-center">
                    <p className="text-danger">FALTAS 80</p>
                </div>

            </div>

                {/* Div 3: Input de Código de Barras e Quantidade */}
      <div className="mb-4">

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

            <div className="mb-2">
              
              <input
                type="text"
                className="form-control w-50 mx-auto mb-2"
                placeholder="Quantidade"
                value={quantidade}
                onChange={handleQuantidadeChange}
                autoFocus // Finaliza o fluxo assim que o campo perder o foco
              />
            </div>
          </div>
        )}
      </div>

            {/* Div 4: Tabela de Itens com rolagem */}
            <div className="mb-4">

                <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Descrição</th>
                                <th>Quantidade</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.id}</td>
                                    <td>{item.descricao}</td>
                                    <td>{item.quantidade}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Div 5: Botões Abaixo da Tabela */}
            <div className="row mb-4">
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