import AsyncStorage from '@react-native-async-storage/async-storage';

const WALKTHROUGH_COMPLETED_KEY = 'walkthrough_completed';

export const walkthroughUtils = {
  isCompleted: async () => {
    try {
      const completed = await AsyncStorage.getItem(WALKTHROUGH_COMPLETED_KEY);
      return completed === 'true';
    } catch (error) {
      console.error('Error checking walkthrough status:', error);
      return false;
    }
  },

  markCompleted: async () => {
    try {
      await AsyncStorage.setItem(WALKTHROUGH_COMPLETED_KEY, 'true');
      return true;
    } catch (error) {
      console.error('Error marking walkthrough as completed:', error);
      return false;
    }
  },

  reset: async () => {
    try {
      await AsyncStorage.removeItem(WALKTHROUGH_COMPLETED_KEY);
      return true;
    } catch (error) {
      console.error('Error resetting walkthrough:', error);
      return false;
    }
  },

  getStatus: async () => {
    try {
      const completed = await AsyncStorage.getItem(WALKTHROUGH_COMPLETED_KEY);
      return {
        completed: completed === 'true',
        rawValue: completed,
      };
    } catch (error) {
      console.error('Error getting walkthrough status:', error);
      return {
        completed: false,
        rawValue: null,
        error: error.message,
      };
    }
  },
}; 