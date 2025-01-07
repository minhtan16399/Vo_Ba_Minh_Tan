import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from 'react-select';

interface Token {
    symbol: string;
    image: string;
}

interface PriceData {
    currency: string;
    date: string;
    price: number;
}

const CurrencySwapForm: React.FC = () => {
    const [tokens, setTokens] = useState<Token[]>([]);
    const [prices, setPrices] = useState<Record<string, number>>({});
    const [fromToken, setFromToken] = useState<string>("");
    const [toToken, setToToken] = useState<string>("");
    const [amount, setAmount] = useState<number | "">("");
    const [conversionRate, setConversionRate] = useState<number | null>(null);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        const fetchTokensAndPrices = async () => {
            try {
                const tokenIconsRepo = "https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens";
                const pricesUrl = "https://interview.switcheo.com/prices.json";

                const priceResponse = await axios.get<PriceData[]>(pricesUrl);
                const priceData = priceResponse.data;

                const tokenMap: Record<string, number> = {};
                const tokenList: Token[] = priceData.map((entry) => {
                    tokenMap[entry.currency] = entry.price;
                    return {
                        symbol: entry.currency,
                        image: `${tokenIconsRepo}/${entry.currency}.svg`,
                    };
                });

                setTokens(tokenList);
                setPrices(tokenMap);
            } catch (err) {
                console.error("Error fetching data: ", err);
            }
        };

        fetchTokensAndPrices();
    }, []);

    useEffect(() => {
        if (fromToken && toToken && prices[fromToken] && prices[toToken]) {
            const rate = prices[fromToken] / prices[toToken];
            setConversionRate(rate);
        } else {
            setConversionRate(null);
        }
    }, [fromToken, toToken, prices]);

    const handleSwap = () => {
        if (!fromToken || !toToken || !amount || amount <= 0) {
            setError("Please fill out all fields correctly.");
            return;
        }

        if (fromToken === toToken) {
            setError("Cannot swap the same currency.");
            return;
        }

        setError("");
        alert(
            `You receive ${(amount * conversionRate!).toFixed(2)} ${toToken}`
        );
    };
    const options = tokens.map((token) => ({
        value: token.symbol,
        label: (
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <img
                    src={token.image}
                    alt={token.symbol}
                    style={{ width: 20, height: 20, marginRight: 8 }}
                />
                {token.symbol}
            </div>
        ),
    }));

    return (
        <div className="currency-swap-container">
            <h1>Currency Swap</h1>
            <form className="currency-swap-form">
                <div className="form-group">
                    <label>From:</label>
                    <Select
                        options={options}
                        onChange={(selectedOption) =>
                            setFromToken(selectedOption?.value || '')
                        }
                    />
                </div>

                <div className="form-group">
                    <label>To:</label>
                    <Select
                        options={options}
                        onChange={(selectedOption) =>
                            setToToken(selectedOption?.value || '')
                        }
                    />
                </div>

                <div className="form-group">
                    <label>Amount:</label>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : "")}
                        placeholder="Enter amount"
                    />
                </div>

                {conversionRate !== null && (
                    <p className="conversion-rate">
                        1 {fromToken} = {conversionRate.toFixed(6)} {toToken}
                    </p>
                )}

                {error && <p className="error-message">{error}</p>}

                <button
                    type="button"
                    onClick={handleSwap}
                    className="swap-button"
                    disabled={!conversionRate}
                >
                    Swap
                </button>
            </form>
        </div>
    );
};

export default CurrencySwapForm;
