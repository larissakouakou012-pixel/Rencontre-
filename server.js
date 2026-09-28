const express = require("express");

const app = express();

app.use(express.json());
app.use(express.static(__dirname));

const PORT = process.env.PORT || 3000;
const WAVE_API_KEY = process.env.WAVE_API_KEY;

app.post("/create-payment", async (req, res) => {
  try {
    if (!WAVE_API_KEY) {
      return res.status(500).json({
        error: "Clé Wave non configurée."
      });
    }

    const response = await fetch(
      "https://api.wave.com/v1/checkout/sessions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${WAVE_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          amount: "200",
          currency: "XOF",
          success_url: "https://rencontre-d77i.onrender.com/success",
          error_url: "https://rencontre-d77i.onrender.com/error"
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    res.json({
      payment_url: data.wave_launch_url,
      checkout_id: data.id
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Erreur lors de la création du paiement."
    });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Serveur lancé sur le port ${PORT}`);
});
