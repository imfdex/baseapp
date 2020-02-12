/*tslint:disable */
import * as React from 'react';
import { injectIntl } from 'react-intl';
import { CurrencyInfo, DepositCrypto } from '../../../components';
import { WalletHistory } from '../../../containers/Wallets/History';
import { formatCCYAddress } from '../../../helpers';

export const CoinFragment = injectIntl(
    ({
        intl,
        currency,
        wallets,
        selectedWalletAddress,
        handleOnCopy,
        addressDepositError,
        selectedWalletIndex,
        userAgree,
        setUserAgree,
    }) => {
        const format = intl.formatMessage;
        const text = format({ id: 'page.body.wallets.tabs.deposit.ccy.message.submit' });
        const walletAddress = formatCCYAddress(currency, selectedWalletAddress);
        const error = addressDepositError
            ? format({ id: addressDepositError.message })
            : format({ id: 'page.body.wallets.tabs.deposit.ccy.message.error' });
        if (userAgree && currency !== 'eth') {
            setUserAgree(false);
        }
        const setAgree = () => {
            setUserAgree(true);
        };
        return (
            <React.Fragment>
                <CurrencyInfo wallet={wallets[selectedWalletIndex]} />
                {!userAgree && currency === 'eth' ? (
                    <div>
                        <h2 style={{ fontWeight: 400 }}>{format({ id: 'page.wallets.eth.notice' })}</h2>
                        <div
                            style={{
                                background: 'rgb(17, 179, 130)',
                                color: 'white',
                                padding: '10px 20px',
                                border: 'none',
                                fontSize: '18px',
                                borderRadius: '10px',
                                cursor: 'pointer',
                                display: 'inline-block',
                                textAlign: 'center',
                            }}
                            onClick={setAgree}
                        >
                            {format({ id: 'page.wallets.eth.notice.button' })}
                        </div>
                    </div>
                ) : (
                    <DepositCrypto
                        data={walletAddress}
                        handleOnCopy={handleOnCopy}
                        error={error}
                        text={text}
                        disabled={walletAddress === ''}
                        copiableTextFieldText={format({ id: 'page.body.wallets.tabs.deposit.ccy.message.address' })}
                        copyButtonText={format({ id: 'page.body.wallets.tabs.deposit.ccy.message.button' })}
                    />
                )}

                {currency && <WalletHistory label="deposit" type="deposits" currency={currency} />}
            </React.Fragment>
        );
    }
);