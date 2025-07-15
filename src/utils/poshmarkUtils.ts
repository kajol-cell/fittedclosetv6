import {Alert, Linking} from 'react-native';
import {API_CONFIG, POSHMARK_CONFIG} from "../config/appConfig";
export const handleResellOnPoshmark = async (pieceInfo) => {
    try {
        const getTagValue = name => pieceInfo.tags.find(t => t.name === name)?.description;
        const getTagArray = name => pieceInfo.tags.filter(t => t.name === name).map(t => t.description);
        const getPrice = () => {
            const tag = pieceInfo.tags.find(t => t.name === 'Estimated Original Price');
            if (!tag) return null;
            const match = tag.description.replace(/[^\d.]/g, '');
            return match ? match : null;
        };
        let imageUrl = API_CONFIG.PIECE_IMAGE_URL + pieceInfo.imageId;
        console.log('Image URL:', imageUrl);
        const requestBody = {
            source_tracking_id: String(pieceInfo.id),
            images: [imageUrl],
            title: pieceInfo.name,
            description: pieceInfo.description,
            department: getTagValue('Department') || '',
            category: getTagValue('Category') || '',
            subcategory: getTagValue('Subcategory') || '',
            brand: getTagValue('Brand') || '',
            brandMarketingName: getTagValue('Sub-Brand') || '',
            size: getTagValue('Size') || '',
            colors: getTagArray('Color'),
            source_name: 'fitted',
            original_price_amount: {
                val: getPrice() || '0.00',
                currency_code: 'USD',
            },
        };
        const response = await fetch('https://poshmark.com/api/v2/oauth/token', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(requestBody),
        });
        if (!response.ok) {
            throw new Error('Failed to create prospect post');
        }
        const result = await response.json();
        const id = result.data?.id;
        if (!id) {
            throw new Error('Missing ID in response');
        }
        const redirectUrl = `https://poshmark.com/listing/${id}`;
        Linking.openURL(redirectUrl);
    } catch (err) {
        Alert.alert('Error', err.message);
    }
};
