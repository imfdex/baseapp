import * as React from 'react';
import {
    InjectedIntlProps,
    injectIntl,
} from 'react-intl';
import { connect, MapDispatchToPropsFunction, MapStateToProps } from 'react-redux';

import { CopyableTextField } from '../../../components/CopyableTextField';

import { setDocumentTitle } from '../../../helpers';
import {
    currenciesFetch,
    Currency,
    referralCommissionBalancesFetch,
    ReferralCommissionBalancesInterface,
    referralCommissionCurrencyChange,
    referralCommissionReferralsFetch,
    ReferralCommissionReferralsInterface,
    RootState,
    selectCurrencies,
    selectReferralCommission,
} from '../../../modules';
import { InfoCard } from '../../components/ReferralCommission';

interface DispatchProps {
    fetchReferralCommissionBalances: typeof referralCommissionBalancesFetch;
    fetchReferralCommissionReferrals: typeof referralCommissionReferralsFetch;
    changeCurrency: typeof referralCommissionCurrencyChange;
}

interface ReduxProps {
    commissionsInfo: {
        currencyId: string;
        data: {
            trade: ReferralCommissionReferralsInterface;
            ieo: ReferralCommissionReferralsInterface;
            balances: ReferralCommissionBalancesInterface;
        };
    };
    currencies: Currency[];
}

type Props = DispatchProps & InjectedIntlProps & ReduxProps;

class ReferralCommission extends React.Component<Props> {

    public componentDidMount() {
        setDocumentTitle('Referral Commission');
        this.props.fetchCurrencies();
        this.props.fetchReferralCommissionBalances({currencyId: this.props.commissionsInfo.currencyId});
        this.props.fetchReferralCommissionReferrals({currencyId: this.props.commissionsInfo.currencyId, type:'trade'});
        this.props.fetchReferralCommissionReferrals({currencyId: this.props.commissionsInfo.currencyId, type:'ieo'});
    }

    public componentWillReceiveProps(nextProps) {
        const { currencies } = this.props;

        if (nextProps.currencies.length === 0 && nextProps.currencies !== currencies) {
            this.props.fetchCurrencies();
        }
    }

    public changeCurrentCurrency = currencyId => {
        const currencyIdFormatted = currencyId.toLowerCase();
        this.props.fetchReferralCommissionBalances({currencyId: currencyIdFormatted});
        this.props.fetchReferralCommissionReferrals({currencyId: currencyIdFormatted, type:'trade'});
        this.props.fetchReferralCommissionReferrals({currencyId: currencyIdFormatted, type:'ieo'});
        this.props.changeCurrency({currencyId: currencyId});
    }

    public changePage = (currencyId, type, skip, limit) => {
        this.props.fetchReferralCommissionReferrals({currencyId, type, skip, limit});
    }

    public render(){
        // const currencyId = this.props.commissionsInfo.currencyId;
        // const currenciesNames = this.props.currencies.map(el => el.id);
        // const currencyPrecision = (this.props.currencies.find(el => el.id === currencyId.toLowerCase()) || {}).precision;
        // const balances = this.props.commissionsInfo.data.balances;
        // const trade = this.props.commissionsInfo.data.trade;
        // const ieo = this.props.commissionsInfo.data.ieo;


        return (
            <div className="pg-referral-commission">
                <div className="container">
                    <div className="section">
                        <div className="section__header">
                            Referral Traiding
                        </div>


                        <div className="info-card__wrap">
                            <InfoCard
                                iconName="commission"
                                title="Commission rate"
                                text="MAX - 30%"
                            />
                            <InfoCard
                                iconName="referrals"
                                title="Your referrals"
                                text="1233"
                            />
                            <InfoCard
                                iconName="fee"
                                title="Trade fee"
                                text="0.2%"
                            />
                            <InfoCard
                                iconName="profit"
                                title="Your Profit"
                                text="9.0956767 BTC"
                                emrxConverted="23.3434 EMRX"
                                usdConverted="≈  456.8 USD"
                            />
                        </div>
                        <div>
                            <fieldset className={'copyable-text-field'} onClick={this.onCopy}>
                                <legend className={'copyable-title'}>
                                    Referral link
                                </legend>
                                <CopyableTextField
                                    className={'cr-deposit-crypto__copyable-area'}
                                    value={'www.google.com'}
                                    fieldId={'copy_referral_link'}
                                    copyButtonText={'COPY'}
                                />
                            </fieldset>
                        </div>
                    </div>
                </div>
            </div>
          );
    }


    private onCopy = () => {
        setDocumentTitle('copy');
    };
}

const mapStateToProps: MapStateToProps<ReduxProps, {}, RootState> = state => ({
    commissionsInfo: selectReferralCommission(state),
    currencies: selectCurrencies(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> = dispatch => ({
    fetchCurrencies: () => dispatch(currenciesFetch()),
    fetchReferralCommissionBalances: payload => dispatch(referralCommissionBalancesFetch(payload)),
    fetchReferralCommissionReferrals: payload => dispatch(referralCommissionReferralsFetch(payload)),
    changeCurrency: payload => dispatch(referralCommissionCurrencyChange(payload)),
});

export const ReferralCommissionScreen = injectIntl(connect(mapStateToProps, mapDispatchToProps)(ReferralCommission));
