const express = require("express");
/**
 * Create server
 */
const port = process.env.PORT || 3000;
const app = express();
/**
 * Default response
 */
app.get("/", (req, res) => {
    res.send("<h1>Welcome to SMRPO!</h1>");
});
/**
 * Start server
 */
app.listen(port, () => {
    console.log(`Demo app listening on port ${port}!`);
});
