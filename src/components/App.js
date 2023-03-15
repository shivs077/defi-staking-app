import * as React from "react";
import Web3 from "web3";

import "../output.css";
import Navbar from "./Navbar";
import Spinner from "./Spinner";

import Tether from "../truffle_abis/Tether.json";
import RWD from "../truffle_abis/RWD.json";
import DecentralBank from "../truffle_abis/DecentralBank.json";

const App = () => {
  const [darkMode, setDarkMode] = React.useState(true);
  const [account, setAccount] = React.useState("0x0");
  const [tether, setTether] = React.useState({});
  const [rwd, setRwd] = React.useState({});
  const [decentralBank, setDecentralBank] = React.useState({});
  const [tetherBalance, setTetherBalance] = React.useState("0");
  const [rwdBalance, setRwdBalance] = React.useState("0");
  const [stakingBalance, setStakingBalance] = React.useState("0");
  const [loading, setLoading] = React.useState(true);

  const loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert("No ethereum browser detected");
    }
  };

  const loadBlockchain = async () => {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    setAccount(accounts[0]);
    const networkId = await web3.eth.net.getId();

    // Loading Tether contract
    const tetherData = Tether.networks[networkId];
    if (tetherData) {
      const tether = await new web3.eth.Contract(
        Tether.abi,
        tetherData.address
      );
      setTether(tether);

      let balance = await tether.methods.balanceOf(accounts[0]).call();
      setTetherBalance(balance.toString());
    } else {
      window.alert("Tether contract not deployed - no detected network");
    }

    // Loading Reward contract
    let rwd;
    const rwdData = RWD.networks[networkId];
    if (rwdData) {
      rwd = await new web3.eth.Contract(RWD.abi, rwdData.address);
      setRwd(rwd);

      let balance = await rwd.methods.balanceOf(accounts[0]).call();
      setRwdBalance(balance.toString());
    } else {
      window.alert("RWD contract not deployed - no detected network");
    }

    // Loading Decentral bank contract
    const decentralBankData = DecentralBank.networks[networkId];
    if (decentralBankData) {
      const decentralBank = await new web3.eth.Contract(
        DecentralBank.abi,
        decentralBankData.address
      );
      // setRwd(rwd);
      setDecentralBank(decentralBank);
      let stakingBalance = await decentralBank.methods
        .stakingBalance(decentralBankData.address)
        .call();
      setStakingBalance(stakingBalance.toString());
    } else {
      window.alert(
        "Decentral Bank contract not deployed - no detected network"
      );
    }
  };

  React.useEffect(() => {
    const loadData = async () => {
      await loadWeb3();
      await loadBlockchain();
      setLoading(false);
    };

    loadData();
  }, []);

  return (
    <div className={`flex flex-1 ${darkMode ? " dark" : ""}`}>
      <div className="flex flex-1 flex-col bg-white/0.8 dark:text-[#b2bac2] dark:bg-[#121212]">
        {loading ? (
          <Spinner className="mr-0 top-1/2 relative left-1/2 w-12 h-12" />
        ) : (
          <>
            <Navbar
              darkMode={darkMode}
              setDarkMode={setDarkMode}
              account={account}
            />
          </>
        )}
      </div>
    </div>
  );
};
export default App;
