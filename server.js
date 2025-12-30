const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/fetch", async (req, res) => {
  try {
    const { month } = req.body;

    if (!month) {
      return res.status(400).json({ error: "Month is required" });
    }

    const url = "https://cdscoonline.gov.in/CDSCO/filteredNsqDrugTable";

    const response = await axios.get(url, {
      params: {
        month: month,
        source: "All",
        tab: "nsq"
      },
      responseType: "text"   // VERY IMPORTANT – we expect CSV
    });

    const csv = response.data;

    // Force browser to download CSV
    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="CDSCO_NSQ_${month}.csv"`
    );

    res.send(csv);

  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

// Start server
app.listen(3000, () => {
  console.log("CDSCO scraper running on port 3000");
});
