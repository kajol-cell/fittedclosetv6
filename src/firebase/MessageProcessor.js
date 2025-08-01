import {FirebaseMessageType, SessionMessageType} from '../utils/enums';
import {showNotification} from './NotificationUtil';
import {dispatchThunk} from '../utils/reduxUtils';
import {callSessionApi, updatePieces} from '../redux/features/sessionSlice';
import {trackPieceAddedToCloset} from '../lib/analytics'; // you can create this if needed

const MessageProcessor = {
  async process(message, dispatch) {
    const messageType = message?.messageType;
    console.log('[MessageProcessor] Processing message:', messageType);
    if (!messageType) {
      return;
    }

    switch (messageType) {
      case FirebaseMessageType.PIECES_RECEIVED:
        return handlePiecesReceived(message, dispatch);
      case FirebaseMessageType.SESSION_EXPIRED:
        return handleSessionExpired(message, dispatch);
      case FirebaseMessageType.UPLOADED_IMAGE:
        return handleUploadedImage(message, dispatch);
      case FirebaseMessageType.HEART_BEAT:
        return handleHeartBeat(message, dispatch);
      case FirebaseMessageType.PROFILE_UPDATED:
        return handleProfileUpdated(message, dispatch);
      case FirebaseMessageType.USER_STATUS_CHANGED:
        return handleUserStatusChanged(message, dispatch);
      case FirebaseMessageType.PIECES_IMAGES_UPDATED:
        return handlePieceImagesUpdated(message, dispatch);
      case FirebaseMessageType.PIECE_TAGGED:
        return handlePieceTagged(message, dispatch);
      default:
        console.warn('[MessageProcessor] Unknown message type:', messageType);
    }
  },
};

function trackAddPiecesToCloset(pieces) {
  const transformedPieces = pieces.map(piece => {
    const categoryTag = piece.tags.find(tag => tag.name === 'Category');
    const typeTag = piece.tags.find(tag => tag.name === 'Type');
    const brandTag = piece.tags.find(tag => tag.name === 'Brand');

    return {
      id: piece.id,
      name: piece.name,
      category: categoryTag?.description || '',
      type: typeTag?.description || '',
      brand: brandTag?.description || '',
    };
  });
  transformedPieces.forEach(piece => {
    trackPieceAddedToCloset(piece.id, piece);
  });
}

// Individual handlers
async function handlePiecesReceived(message, dispatch) {
  console.log('[Processor] Handling PIECES_RECEIVED');
  //const pieces = await RemoteServiceUtil.getPieces(); // backend call
  showNotification('Closet updated with new pieces');
      dispatchThunk(
    callSessionApi,
    SessionMessageType.RECEIVED_PIECES,
    {},
    responsePayload => {
      console.log('Response from callSessionApi:', responsePayload);
      if (responsePayload && responsePayload.pieces) {
        let pieces = responsePayload.pieces;
        dispatch(updatePieces(pieces));
        trackAddPiecesToCloset(pieces);
      } else {
        console.warn('Response payload or pieces is null/undefined:', responsePayload);
      }
    },
    error => {
      console.error('Error from callSessionApi:', error);
    },
  );
}

function handleSessionExpired(message, dispatch) {
  console.log('[Processor] Handling SESSION_EXPIRED');
  showNotification('Your session has expired. Please log in again.');
  // Optionally dispatch logout
}

function handleUploadedImage(message, dispatch) {
  console.log('[Processor] Handling UPLOADED_IMAGE');
  showNotification('Your image was uploaded successfully');
}

function handleHeartBeat(message, dispatch) {
  // Probably no-op or logr
  console.log('[Processor] Handling HEART_BEAT');
  showNotification('Heart beat');
}

function handleProfileUpdated(message, dispatch) {
  console.log('[Processor] Handling PROFILE_UPDATED');
  //RemoteServiceUtil.getProfile(); // or refresh from server
}

function handleUserStatusChanged(message, dispatch) {
  console.log('[Processor] Handling USER_STATUS_CHANGED');
  // Update Redux state or fetch latest status
}

function handlePieceImagesUpdated(message, dispatch) {
  console.log('[Processor] Handling PIECES_IMAGES_UPDATED');
  //RemoteServiceUtil.getPieces(); // refresh images
}

function handlePieceTagged(message, dispatch) {
  console.log('[Processor] Handling PIECE_TAGGED');
  showNotification('A piece was tagged');
  // Possibly fetch tagged piece details
}

export default MessageProcessor;
