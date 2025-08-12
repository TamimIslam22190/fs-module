import express from "express";
import db from "./db.js";

const app = express();
app.use(express.json());

app.post("/insert", async (req, res) => {
  try {
    const { id, name } = req.body;

    const db_query = "INSERT INTO studentDetails(id,name) VALUES(?,?)";
    db.query(db_query, [id, name], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: result.insertId, name });
    });
  } catch (error) {}
});

app.delete("/:id", async (req, res) => {
  const { id } = req.params;

  const db_query = "DELETE from  studentDetails where id = ?";

  db.query(db_query, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({ message: "Student deleted successfully" });
  });
});

const response = (req, state, message, data) => {
  return res.status(state).json({
    message,
    data,
  });
};

const tamim = () => {
  console.log("Tamim Islam");
};



const PORT = 3000;
(async () => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
})();
