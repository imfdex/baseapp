import { CloseButton, Decimal, Loader } from '@openware/components';
import * as React from 'react';
import { FormattedMessage, InjectedIntlProps, injectIntl } from 'react-intl';
import { connect, MapDispatchToPropsFunction } from 'react-redux';
import { localeDate, setTradeColor } from '../../../helpers';
import {
    Market,
    ordersHistoryCancelFetch,
    RootState,
    selectCancelAllFetching,
    selectCancelFetching,
    selectCurrentPageIndex,
    selectMarkets,
    selectOrdersFirstElemIndex,
    selectOrdersHistory,
    selectOrdersHistoryLoading,
    selectOrdersLastElemIndex,
    selectOrdersNextPageExists,
    userOrdersHistoryFetch,
} from '../../../modules';
import { OrderCommon } from '../../../modules/types';
import { History } from '../../components';
import { setOrderType } from '../../helpers';

interface OrdersProps {
    type: string;
}

interface ReduxProps {
    marketsData: Market[];
    pageIndex: number;
    firstElemIndex: number;
    list: OrderCommon[];
    fetching: boolean;
    lastElemIndex: number;
    nextPageExists: boolean;
    cancelAllFetching: boolean;
    cancelFetching: boolean;
}

interface DispatchProps {
    ordersHistoryCancelFetch: typeof ordersHistoryCancelFetch;
    userOrdersHistoryFetch: typeof userOrdersHistoryFetch;
}

interface OrdersState {
    orderType: boolean;
}

type Props = OrdersProps & ReduxProps & DispatchProps & InjectedIntlProps;

class OrderHistoryComponent extends React.PureComponent<Props, OrdersState>  {
    public componentDidMount() {
        this.props.userOrdersHistoryFetch({ type: 'all', pageIndex: 0, limit: 100 });
    }

    public render() {
        const { fetching, list } = this.props;
        const updateList = list;

        const emptyMsg = this.props.intl.formatMessage({id: 'page.noDataToShow'});
        return (
            <div className={`pg-history-elem ${updateList.length ? '' : 'pg-history-elem-empty'}`}>
                {fetching && <Loader />}
                {updateList.length ? this.renderContent(updateList) : null}
                {!updateList.length && !fetching ? <p className="pg-history-elem__empty">{emptyMsg}</p> : null}
            </div>
        );
    }

    public renderContent = list => {
        return (
            <History headers={this.renderHeaders()} data={this.retrieveData(list)}/>
        );
    };

    private renderHeaders = () => {
        return [
            this.props.intl.formatMessage({ id: 'page.body.history.deposit.header.date' }),
            this.props.intl.formatMessage({ id: 'page.body.openOrders.header.orderType' }),
            this.props.intl.formatMessage({ id: 'page.body.openOrders.header.pair' }),
            this.props.intl.formatMessage({ id: 'page.body.openOrders.header.price' }),
            this.props.intl.formatMessage({ id: 'page.body.openOrders.header.amount' }),
            this.props.intl.formatMessage({ id: 'page.body.openOrders.header.executed' }),
            this.props.intl.formatMessage({ id: 'page.body.openOrders.header.remaining' }),
            this.props.intl.formatMessage({ id: 'page.body.openOrders.header.costRemaining' }),
            this.props.intl.formatMessage({ id: 'page.body.openOrders.header.status' }),
            '',
        ];
    };

    private retrieveData = list => {
        return list.map(item => this.renderOrdersHistoryRow(item));
    };

    private renderOrdersHistoryRow = item => {
        const {
            id,
            executed_volume,
            market,
            ord_type,
            price,
            avg_price,
            remaining_volume,
            origin_volume,
            side,
            state,
            updated_at,
            created_at,
        } = item;
        const currentMarket = this.props.marketsData.find(m => m.id === market)
            || { name: '', price_precision: 0, amount_precision: 0 };

        const orderType = this.getType(side, ord_type);
        const marketName = currentMarket ? currentMarket.name : market;
        const costRemaining = remaining_volume * price; // price or avg_price ???
        const fullDate = localeDate(updated_at ? updated_at : created_at, 'fullDate').split(' ');
        const status = this.setOrderStatus(state);
        const actualPrice = ord_type === 'market' || status === 'done' ? avg_price : price;

        return [
            <span key={id}><span style={{ color: '#FFFFFF' }}>{fullDate[0]}</span> {fullDate[1]}</span>,
            <span className="notranslate" style={{ color: setTradeColor(side).color }} key={id}>{orderType}</span>,
            marketName,
            <Decimal key={id} fixed={currentMarket.price_precision}>{actualPrice}</Decimal>,
            <Decimal key={id} fixed={currentMarket.amount_precision}>{origin_volume}</Decimal>,
            <Decimal key={id} fixed={currentMarket.amount_precision}>{executed_volume}</Decimal>,
            <Decimal key={id} fixed={currentMarket.amount_precision}>{remaining_volume}</Decimal>,
            <Decimal key={id} fixed={currentMarket.amount_precision}>{costRemaining.toString()}</Decimal>,
            <span key={id} style={{ color: setOrderType(state) }}>{status}</span>,
            state === 'wait' && <CloseButton key={id} onClick={this.handleCancel(id)} />,
        ];
    };

    private getType = (side: string, orderType: string) => {
        if (!side || !orderType) {
            return '';
        }
        return this.props.intl.formatMessage({ id: `page.body.openOrders.header.orderType.${side}.${orderType}` });
    };

    private setOrderStatus = (status: string) => {
        switch (status) {
            case 'done':
                return (
                    <FormattedMessage id={`page.body.openOrders.content.status.done`} />
                );
            case 'cancel':
                return (
                    <FormattedMessage id={`page.body.openOrders.content.status.cancel`} />
                );
            case 'wait':
                return (
                    <FormattedMessage id={`page.body.openOrders.content.status.wait`} />
                );
            default:
                return status;
        }
    };

    private handleCancel = (id: number) => () => {
        const { cancelAllFetching, cancelFetching, type, list } = this.props;
        if (cancelAllFetching || cancelFetching) {
            return;
        }
        this.props.ordersHistoryCancelFetch({ id, type, list });
    };
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    marketsData: selectMarkets(state),
    pageIndex: selectCurrentPageIndex(state),
    firstElemIndex: selectOrdersFirstElemIndex(state, 25),
    list: selectOrdersHistory(state),
    fetching: selectOrdersHistoryLoading(state),
    lastElemIndex: selectOrdersLastElemIndex(state, 25),
    nextPageExists: selectOrdersNextPageExists(state, 25),
    cancelAllFetching: selectCancelAllFetching(state),
    cancelFetching: selectCancelFetching(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> =
    dispatch => ({
        ordersHistoryCancelFetch: payload => dispatch(ordersHistoryCancelFetch(payload)),
        userOrdersHistoryFetch: payload => dispatch(userOrdersHistoryFetch(payload)),
    });

export const OrderHistory = injectIntl(connect(mapStateToProps, mapDispatchToProps)(OrderHistoryComponent));
