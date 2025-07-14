// Updated closetUtils.js to include hydration function for ClosetInfo with revised structure

import { GARMENT_TYPES, LAYER_TYPES } from "./enums";

export const hydrateClosetInfo = closetInfo => {
  if (!closetInfo) {
    return;
  }
  const pieceMap = closetInfo.pieces.reduce((map, piece) => {
    map[piece.id] = piece;
    return map;
  }, {});

  // Hydrate fits
  //console.log('Hydrating Fits');
  closetInfo.fits.forEach(fit => {
    //console.log(fit.fitPieces);
    fit.fitPieces.forEach(fitPiece => {
      const pieceId = closetInfo.fitPieceIdMap[fitPiece.id];
      fitPiece.piece = pieceMap[pieceId];
      if (fitPiece.piece === null) {
        console.log("Missing piece for fitPiece", fitPiece);
      }
      /*
      console.log(
        'fitPieceId=',
        fitPiece.id,
        ', pieceId',
        pieceId,
        ', piece',
        fitPiece.piece,
      );
*/

      fitPiece.layerPiece =
        pieceMap[closetInfo.fitLayerPieceIdMap[fitPiece.id]] || null;
    });
    fit.fitPieces = fit.fitPieces.filter(fitPiece => fitPiece.piece !== null);
  });

  closetInfo.fits = closetInfo.fits.filter(fit => fit.fitPieces.length > 0);

  // Hydrate fitColls
  const fitMap = closetInfo.fits.reduce((map, fit) => {
    map[fit.id] = fit;
    return map;
  }, {});

  closetInfo.fitColls.forEach(fitColl => {
    fitColl.fits = (closetInfo.fitCollFitIds[fitColl.id] || [])
      .map(fitId => fitMap[fitId])
      .filter(Boolean);
  });

  closetInfo.fitColls = closetInfo.fitColls.filter(
    fitColl => fitColl.fits.length > 0,
  );

  // Clear maps after hydration
  closetInfo.fitPieceIdMap = {};
  closetInfo.fitLayerPieceIdMap = {};
  closetInfo.fitCollFitIds = {};
  return closetInfo;
};

export const getGarmentTypePieces = (garmentType, pieces) => {
  const filteredPiece = pieces.filter(p => p.garmentType === garmentType);
  //console.log('Filtered piece for type = ' + type + ' ' + filteredPiece);
  return filteredPiece;
};

export const getRandomizedPiece = filteredPieces => {
  const randomPiece = filteredPieces.length
    ? filteredPieces[Math.floor(Math.random() * filteredPieces.length)]
    : null;
  //console.log('Random piece for type = ' + garmentType + ' ' + randomPiece.id);
  return randomPiece;
};

// Get a random piece by garment type
export const getGarmentTypeRandomPiece = (
  garmentType,
  pieces,
  currentPiece = {},
) => {
  //console.log('Current Piece Id : ', currentPiece.id);
  const garmentTypePieces = getGarmentTypePieces(garmentType, pieces);
  //console.log('Number of garmentType pieces : ', garmentTypePieces.length);
  const filteredPieces = garmentTypePieces.filter(
    piece => piece.id !== currentPiece.id,
  );
  //console.log('Number of filtered pieces : ', filteredPieces.length);
  if (filteredPieces.length === 1) {
    const filteredPiece = filteredPieces[0];
    //console.log('Filtered Piece Id : ', filteredPiece.id);
    return filteredPiece;
  }
  return getRandomizedPiece(filteredPieces);
};

export const getLayerRandomPiece = (pieces, currentPiece = {}) => {
  //console.log('Current Piece Id : ', currentPiece.id);
  const layerPieces = pieces.filter(
    p => p.garmentLayerType === LAYER_TYPES.OUTER.name,
  );
  //console.log('Number of garmentType pieces : ', garmentTypePieces.length);
  const filteredPieces = layerPieces.filter(
    piece => piece.id !== currentPiece.id,
  );
  //console.log('Number of filtered pieces : ', filteredPieces.length);
  if (filteredPieces.length === 1) {
    const filteredPiece = filteredPieces[0];
    //console.log('Filtered Piece Id : ', filteredPiece.id);
    return filteredPiece;
  }
  return getRandomizedPiece(filteredPieces);
};

export function extractIds(items) {
  if (!Array.isArray(items)) {
    return [];
  }
  return items.filter(item => item && item.id != null).map(item => item.id);
}

// Example usage:
// import { hydrateClosetInfo } from './closetUtils';
// hydrateClosetInfo(closetInfo);
