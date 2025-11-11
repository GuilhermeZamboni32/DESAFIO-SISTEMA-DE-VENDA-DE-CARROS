import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [carros, setCarros] = useState([]);
  const [novoCarro_placa, setNovoCarro_placa] = useState("");
  const [novoCarro_modelo, setNovoCarro_modelo] = useState("");
  const [novoCarro_ano, setNovoCarro_ano] = useState("");
  const [novoCarro_preco_compra, setNovoCarro_preco_compra] = useState("");
  const [novoCarro_preco_venda, setNovoCarro_preco_venda] = useState("");

  // Buscar carros
  const carregarCarros = async () => {
    try {
      const res = await axios.get("http://localhost:3001/carros");
      setCarros(res.data);
    } catch (err) {
      console.error("Erro ao carregar carros:", err);
    }
  };

  useEffect(() => {
    carregarCarros();
  }, []);

  // Adicionar carro
  const adicionarCarro = async (e) => {
    e.preventDefault();
    try {
      const novoCarro = {
        placa: novoCarro_placa,
        modelo: novoCarro_modelo,
        ano: novoCarro_ano,
        preco_compra: novoCarro_preco_compra,
        preco_venda: novoCarro_preco_venda,
      };

      console.log("📦 Enviando para o backend:", novoCarro);

      await axios.post("http://localhost:3001/carros", novoCarro);

      // Limpa campos após adicionar
      setNovoCarro_placa("");
      setNovoCarro_modelo("");
      setNovoCarro_ano("");
      setNovoCarro_preco_compra("");
      setNovoCarro_preco_venda("");

      carregarCarros();
    } catch (err) {
      console.error("Erro ao adicionar carro:", err);
    }
  };

  // Marcar como vendido
  const venderCarro = async (id) => {
    try {
      await axios.put(`http://localhost:3001/carros/${id}/vender`);
      carregarCarros();
    } catch (err) {
      alert("Erro ao vender carro!");
      console.error(err);
    }
  };

  return (
    <div>
      <h1>Sistema de Venda de Carros</h1>

      <form onSubmit={adicionarCarro}>
        <input
          placeholder="Placa"
          value={novoCarro_placa}
          onChange={(e) => setNovoCarro_placa(e.target.value)}
          required
        />
        <input
          placeholder="Modelo"
          value={novoCarro_modelo}
          onChange={(e) => setNovoCarro_modelo(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Ano"
          value={novoCarro_ano}
          onChange={(e) => setNovoCarro_ano(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Preço Compra"
          value={novoCarro_preco_compra}
          onChange={(e) => setNovoCarro_preco_compra(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Preço Venda"
          value={novoCarro_preco_venda}
          onChange={(e) => setNovoCarro_preco_venda(e.target.value)}
          required
        />
        <button type="submit">Adicionar</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Placa</th>
            <th>Modelo</th>
            <th>Ano</th>
            <th>Compra (R$)</th>
            <th>Venda (R$)</th>
            <th>Status</th>
            <th>Ação</th>
          </tr>
        </thead>
        <tbody>
          {carros.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.placa}</td>
              <td>{c.modelo}</td>
              <td>{c.ano}</td>
              <td>{c.preco_compra}</td>
              <td>{c.preco_venda}</td>
              <td className={c.vendido ? "vendido" : ""}>
                {c.vendido ? "Vendido" : "Disponível"}
              </td>
              <td>
                {!c.vendido && (
                  <button onClick={() => venderCarro(c.id)}>Vender</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
