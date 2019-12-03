import { Decimal } from '@openware/components';
import classnames from 'classnames';
import * as React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { getCountdownDate, localeDate } from '../../../../helpers';
import { Currency } from '../../../../modules';
import { DataIEOInterface } from '../../modules';


const T69_IEO_ID = 2;
const T69_IEO_AMOUNT = 6508911.65;

interface CardIEOProps {
    ieo: DataIEOInterface;
    onIEOSelect: (ieo: DataIEOInterface) => void;
    handleFetchIEO: () => void;
    onClick: (ieo: DataIEOInterface) => void;
    currencies: Currency[];
}

interface State {
    countdownValue: string;
}

const limitDescription = 80;

type Props = CardIEOProps & InjectedIntlProps;

// tslint:disable jsx-no-multiline-js
class IEOCardComponent extends React.Component<Props, State> {
    public countdownInterval;

    constructor(props: Props) {
        super(props);

        this.state = {
            countdownValue: '00:00:00',
        };
    }

    public translate = (e: string) => {
        return this.props.intl.formatMessage({ id: e });
    };

    public componentDidMount() {
        const { ieo } = this.props;
        if (ieo) {
            let countdownDate = ieo.starts_at;

            if (ieo.state === 'ongoing' && ieo.finishes_at) {
                countdownDate = ieo.finishes_at;
            }

            this.countdownInterval = setInterval(() => {
                if (ieo.state === 'distributing' && ieo.type === 'proportional' && ieo.finishes_at) {
                    countdownDate = ieo.finishes_at;
                    this.setState({ countdownValue: getCountdownDate(countdownDate, '5m') });
                } else {
                    this.setState({ countdownValue: getCountdownDate(countdownDate) });
                }
            }, 1000);
        }
    }

    public componentWillReceiveProps(nextProps) {
        const { ieo } = this.props;

        if (!ieo && nextProps.ieo) {
            let countdownDate = nextProps.ieo.starts_at;

            if (nextProps.ieo.state === 'ongoing' && nextProps.ieo.finishes_at) {
                countdownDate = nextProps.ieo.finishes_at;
            }

            this.countdownInterval = setInterval(() => {
                if (nextProps.ieo.state === 'distributing' && ieo.type === 'proportional' && nextProps.ieo.finishes_at) {
                    countdownDate = nextProps.ieo.finishes_at;
                    this.setState({ countdownValue: getCountdownDate(countdownDate, '5m') });
                } else {
                    this.setState({ countdownValue: getCountdownDate(countdownDate) });
                }
            }, 1000);
        }
    }

    public componentDidUpdate(prevProps: Props, prevState: State) {
        const { ieo } = this.props;

        if (prevProps.ieo && ieo && prevProps.ieo.state !== ieo.state) {
            clearInterval(this.countdownInterval);
            let countdownDate = ieo.starts_at;

            if (ieo.state === 'ongoing' && ieo.finishes_at) {
                countdownDate = ieo.finishes_at;
            }

            this.countdownInterval = setInterval(() => {
                this.setState({ countdownValue: getCountdownDate(countdownDate) });

                if (ieo.state === 'distributing' && ieo.type === 'proportional' && ieo.finishes_at) {
                    countdownDate = ieo.finishes_at;
                    this.setState({ countdownValue: getCountdownDate(countdownDate, '5m') });
                } else {
                    this.setState({ countdownValue: getCountdownDate(countdownDate) });
                }
            }, 1000);
        }
    }

    public componentWillUnmount(): void {
        clearInterval(this.countdownInterval);
    }

    public render() {
        const { currency_id, name, state, description, metadata } = this.props.ieo;
        const cuttedDescription = description && description.length >= limitDescription ? `${description.slice(0, limitDescription)} ...` : description;

        return (
            <div className="pg-ieo__card" onClick={this.handleClick}>
                <div className="pg-ieo__card-header">
                    {metadata && metadata.icon_url && <img className="pg-ieo__card-header__icon" src={metadata.icon_url} alt="" />}
                    <span className="pg-ieo__card-header__text">{currency_id && currency_id.toUpperCase()}</span>
                </div>
                <div className="pg-ieo__card-content">
                    <span className="pg-ieo__card-content__title">{name}</span>
                    <span className="pg-ieo__card-content__text">{cuttedDescription}</span>
                    {this.getContent(state, this.props.ieo)}
                </div>
            </div>
        );
    }

    private handleClick = () => {
        const { ieo } = this.props;

        this.props.onClick(ieo);
    };

    private getContent = (state: string, ieo) => {
        if (ieo.id === T69_IEO_ID) {
            return this.renderInProgress();
        }
        switch (state) {
            case 'preparing':
                return this.renderPreparingItem();
            case 'ongoing':
            case 'distributing':
                return this.renderInProgress();
            case 'finished':
            case 'released':
                return this.renderFinished();
            default:
                return;
        }
    };

    private renderPreparingItem = () => {
        const {
            starts_at,
            finishes_at,
            supply,
            currency_id,
            metadata,
        } = this.props.ieo;

        return (
            <div className="pg-ieo__card-content-block">
                <div className="pg-ieo__card-content-block__row">
                    <span className="pg-ieo__card-content-block__text">{this.translate('page.body.ieo.profile.info.goal')}</span>
                    <span className="pg-ieo__card-content-block__text text-bold">
                        {metadata && Decimal.format(supply, +metadata.precision)}&nbsp;
                        {currency_id && currency_id.toUpperCase()}
                    </span>
                </div>
                <div className="pg-ieo__card-content-block__row">
                    <span className="pg-ieo__card-content-block__text">{this.translate('page.body.ieo.card.start.date')}</span>
                    <span className="pg-ieo__card-content-block__text text-bold">{localeDate(starts_at, 'fullDate')}</span>
                </div>
                {finishes_at ? (
                    <div className="pg-ieo__card-content-block__row">
                        <span className="pg-ieo__card-content-block__text">{this.translate('page.body.ieo.card.end.date')}</span>
                        <span className="pg-ieo__card-content-block__text text-bold">{localeDate(finishes_at, 'fullDate')}</span>
                    </div>
                ) : null}
            </div>
        );
    };

    private renderInProgress = () => {
        const { currency_id, metadata, id, supply } = this.props.ieo;

        if (id === T69_IEO_ID) {
            // supply = T69_IEO_AMOUNT;
        }

        const isProgressHidden = id.toString() === '3' ||
            id.toString() === '5' ||
            // id.toString() === '2' ||
            id.toString() === '4';

        return (
            <div className="pg-ieo__card-content-block">
                <div className="pg-ieo__card-content-block__row">
                    <span className="pg-ieo__card-content-block__text">{this.translate('page.body.ieo.profile.info.goal')}</span>
                    <span className="pg-ieo__card-content-block__text text-bold">
                        {metadata && Decimal.format(supply, +metadata.precision)}&nbsp;
                        {currency_id && currency_id.toUpperCase()}
                    </span>
                </div>
                {!isProgressHidden && this.renderProgressBar()}
            </div>
        );
    };

    private renderFinished = () => {
        const { tokens_ordered, pairs, id } = this.props.ieo;
        const { currencies } = this.props;
        const quoteCurrency = currencies.length ? currencies.find(currency => currency.id && currency.id.toLowerCase() === pairs[0].quote_currency_id && pairs[0].quote_currency_id.toLowerCase()) : null;
        const amountOfQuote = tokens_ordered && quoteCurrency ? Decimal.format(+tokens_ordered * +pairs[0].price, +quoteCurrency.precision) : null;

        const isProgressHidden = id.toString() === '3' ||
            id.toString() === '5' ||
            // id.toString() === '2' ||
            id.toString() === '4';

        return (
            <div className="pg-ieo__card-content-block">
                {!isProgressHidden && <div className="pg-ieo__card-content-block__row">
                    <span className="pg-ieo__card-content-block__text">{this.translate('page.body.ieo.card.raised')}</span>
                    <span className="pg-ieo__card-content-block__text text-bold">
                        {amountOfQuote} {pairs[0].quote_currency_id && pairs[0].quote_currency_id.toUpperCase()}
                    </span>
                </div>}
                {!isProgressHidden && this.renderProgressBar()}
            </div>
        );
    };

    private renderProgressBar = () => {
        const { countdownValue } = this.state;
        const { finishes_at, state, id, supply } = this.props.ieo;
        let { tokens_ordered } = this.props.ieo;

        if (id === T69_IEO_ID) {
            tokens_ordered = T69_IEO_AMOUNT;
            // supply = T69_IEO_AMOUNT;
        }

        const percentage = +supply ? +Decimal.format((+tokens_ordered * 100) / +supply, 2) : 0;

        const countDownColorClass = classnames('content__ieo-countdown', {
            'content__ieo-countdown--red': countdownValue && Number(countdownValue.split(':').pop()) % 2 === 0,
            'font-yellow': state === 'finished' || state === 'released',
        });

        const percentageClass = classnames('filler', {
            'filler--zero': percentage < 5,
            'back-yellow': state === 'finished' || state === 'released',
        });

        const currentProgressClass = classnames('progress-bar__value__current', {
            'font-yellow': state === 'finished' || state === 'released',
        });

        return (
            <React.Fragment>
                {finishes_at ? (
                    <div className="pg-ieo__card-content-block__row">
                        <span className="pg-ieo__card-content-block__text">{this.translate('page.body.ieo.card.countdown')}</span>
                        <div className={countDownColorClass}>{countdownValue === '00:00:00' ? this.translate('page.body.ieo.card.end') : countdownValue}</div>
                    </div>
                ) : null}
                <div className="progress-bar">
                    <div className={percentageClass} style={{ width: `${percentage}%` }} />
                    <div className="progress-bar__value">
                        <div className="progress-bar__value__label">{this.translate('page.body.ieo.profile.info.progress')}</div>
                        <div className={currentProgressClass}>{`${percentage}%`}</div>
                    </div>
                </div>
            </React.Fragment>
        );
    };
}

export const IEOCard = injectIntl(IEOCardComponent);
