import {NativeModules} from 'react-native';

const {TikTokEventsManager} = NativeModules;

let loggedTransactions = new Set();

export const fireTokTokLaunchEvent = ( )  => {
    // Fire TikTok launch event
    if (TikTokEventsManager?.logEvent) {
        TikTokEventsManager?.logEvent('launch_app', {
            source: 'user_opened_app',
        });
        console.log('✅ TikTok AppOpened event fired');
    }
    else {
        console.warn('⚠️ TikTokEventsManager is undefined or improperly linked.');
    }
};

export const logTikTokPurchaseEvent = (eventInfo, pkg) => {
    console.log('logTikTokPurchaseEvent', eventInfo);
    const txId = eventInfo?.transaction?.transactionIdentifier;
    if (!txId || loggedTransactions.has(txId)) {return;}

    TikTokEventsManager?.logEvent('purchase', {
        content_type: eventInfo?.productIdentifier,
        content_id: txId,
        value: pkg.product.priceString,
        currency: pkg.product.currencyCode || 'USD',
    });

    loggedTransactions.add(txId);
};
