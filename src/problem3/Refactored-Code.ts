interface WalletBalance {
    currency: string;
    amount: number;
    blockchain: string;
}

interface FormattedWalletBalance extends WalletBalance {
    formatted: string;
    usdValue: number;
}

interface Props extends BoxProps {
    children?: React.ReactNode;
}

const getPriority = (blockchain: string): number => {
    switch (blockchain) {
        case 'Osmosis': return 100;
        case 'Ethereum': return 50;
        case 'Arbitrum': return 30;
        case 'Zilliqa': return 20;
        case 'Neo': return 20;
        default: return -99;
    }
};

const WalletPage: React.FC<Props> = (props) => {
    const { children, ...rest } = props;
    const balances = useWalletBalances();
    const prices = usePrices();

    const formattedBalances: FormattedWalletBalance[] = useMemo(() => {
        return balances
            .filter((balance) => {
                const priority = getPriority(balance.blockchain);
                return priority > -99 && balance.amount > 0;
            })
            .map((balance) => {
                const usdValue = prices[balance.currency] * balance.amount;
                return {
                    ...balance,
                    formatted: balance.amount.toFixed(2),
                    usdValue,
                };
            })
            .sort((lhs, rhs) => getPriority(rhs.blockchain) - getPriority(lhs.blockchain));
    }, [balances, prices]);

    const rows = formattedBalances.map((balance) => (
        <WalletRow
            className={classes.row}
            key={balance.currency}
            amount={balance.amount}
            usdValue={balance.usdValue}
            formattedAmount={balance.formatted}
        />
    ));

    return <div {...rest}>{rows}</div>;
};
