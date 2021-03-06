import React,{ useEffect,useState}from 'react';
import './App.css';
import CurrencyInput from './component/CurrencyInput';


const BASE_URL='https://api.exchangeratesapi.io/latest'

function App() {
  const [currencyOptions,setCurrencyOptions]=useState([])
  const [fromCurrency,setFromCurrency]=useState()
  const [toCurrency,setToCurrency]=useState()
  const [amount,setAmount]=useState(1)
  const [amountInFromCurrency,setAmountInFromCurrency]=useState([true])
  const [exchangeRate,setExchangeRate]=useState()

  console.log(exchangeRate);

  let toAmount, fromAmount;
  if(amountInFromCurrency){
    fromAmount=amount;
    toAmount=amount*exchangeRate;
  }else{
    toAmount=amount;
    fromAmount=amount / exchangeRate;
  }

  useEffect(() =>{
    fetch(BASE_URL)
    .then(result => result.json())
    .then(data =>{
      const firstCurrency=Object.keys(data.rates)[0]
      setCurrencyOptions([data.base, ...Object.keys(data.rates)])
      setFromCurrency(data.base)
      setToCurrency(firstCurrency)
      setExchangeRate(data.rates[firstCurrency])
    })
       
  },[])

  useEffect(()=>{
    if(fromCurrency !=null && toCurrency !=null){
      fetch(`${BASE_URL}?base=${fromCurrency}&symbols=${toCurrency}`)
    .then(result =>result.json())
    .then(data => setExchangeRate(data.rates[toCurrency]))
    }
    
  },[fromCurrency,toCurrency])

  function handleFromAmountChange(e) {
    setAmount(e.target.value)
    setAmountInFromCurrency(true)
  }
  function handleToAmountChange(e) {
    setAmount(e.target.value)
    setAmountInFromCurrency(false)
  }
  return (
    <>
    <div className="main">
    <h1>Currency Converter</h1>
    <CurrencyInput
      currencyOptions={currencyOptions}
      selectedCurrency={fromCurrency}
      onChangeCurrency={e =>setFromCurrency(e.target.value)}
      amount={fromAmount}
      onChangeAmount={handleFromAmountChange}

    />
    <div className="equals">=</div>
    <CurrencyInput
      currencyOptions={currencyOptions}
      selectedCurrency={toCurrency}
      onChangeCurrency={e =>setToCurrency(e.target.value)}
      amount={toAmount}
      onChangeAmount={handleToAmountChange}
    />
    </div>
    </> 
  );
}
export default App;