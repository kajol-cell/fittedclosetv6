import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import WalkthroughScreen from '../components/WalkthroughScreen';
import MainView from './MainView';
import { walkthroughUtils } from '../utils/walkthroughUtils';
import COLORS from '../const/colors';

const WalkthroughView: React.FC = () => {
  const [showWalkthrough, setShowWalkthrough] = useState<boolean | null>(null);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    checkWalkthroughStatus();
  }, []);

  const checkWalkthroughStatus = async () => {
    try {
      const walkthroughCompleted = await walkthroughUtils.isCompleted();
      if (walkthroughCompleted) {
        setCompleted(true);
      } else {
        setShowWalkthrough(true);
      }
    } catch (error) {
      console.error('Error checking walkthrough status:', error);
      setShowWalkthrough(true);
    }
  };

  const handleWalkthroughComplete = async () => {
    try {
      await walkthroughUtils.markCompleted();
      setCompleted(true);
    } catch (error) {
      console.error('Error saving walkthrough status:', error);
      setCompleted(true);
    }
  };

  if (showWalkthrough === null) {
    return <View style={styles.container} />;
  }

  if (completed) {
    return <MainView />;
  }

  return <WalkthroughScreen onComplete={handleWalkthroughComplete} />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:COLORS.Black,
  },
});

export default WalkthroughView; 