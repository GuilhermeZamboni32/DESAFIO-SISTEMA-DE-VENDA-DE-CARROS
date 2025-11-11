import express from "express";
import cors from "cors";
import pool from "../db.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// LISTAR CARROS
app.get("/carros", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM carros ORDER BY id");
    res.json(result.rows);
  } catch (err) {
    console.error(" Erro ao listar carros:", err.message);
    res.status(500).json({ error: err.message });
  }
});

//  ADICIONAR CARRO
app.post("/carros", async (req, res) => {
  let { placa, modelo, ano, preco_compra, preco_venda } = req.body;

  ano = parseInt(ano);
  preco_compra = parseFloat(preco_compra);
  preco_venda = parseFloat(preco_venda);

  try {
    const result = await pool.query(
      `INSERT INTO carros (placa, modelo, ano, preco_compra, preco_venda)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [placa, modelo, ano, preco_compra, preco_venda]
    );

    console.log(" Novo carro adicionado:", result.rows[0]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(" Erro ao adicionar carro:", err.message);
    res.status(500).json({ error: err.message });
  }
});

//  VENDER CARRO
app.put("/carros/:id/vender", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `UPDATE carros SET vendido = true WHERE id = $1 RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Carro não encontrado." });
    }

    console.log(` Carro ID ${id} marcado como vendido.`);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(" Erro ao vender carro:", err.message);
    res.status(500).json({ error: err.message });
  }
});

//  INICIAR SERVIDOR
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(` Servidor rodando na porta ${PORT}`);
});
