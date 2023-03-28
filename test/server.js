require("./helpers/assert");
const express = require("express");
const app = express();
const port = 3000;
const bodyParser = require("body-parser");
const Web3 = require("web3");
const web3 = new Web3("http://127.0.0.1:7545");
const contract = require("truffle-contract");
const twoFactorAuth = contract(
  require("../build/contracts/TwoFactorAuth.json")
);
twoFactorAuth.setProvider(web3.currentProvider);
const twoFactorAuthInstance = twoFactorAuth.deployed();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.get("/", async (req, res) => {
  try {
    const instance = await twoFactorAuth.deployed();
    const accounts = await web3.eth.getAccounts();
    const result = await instance.authenticate({ from: accounts[1] });
    const events = result.logs;
    res.status(200).send(`${events[0].event} : ${events[0].args._user}`);
  } catch (error) {
    return res.status(500).send({ message: "Internal server error" });
  }
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
