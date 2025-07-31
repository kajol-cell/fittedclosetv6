import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Platform,
  Appearance,
  KeyboardAvoidingView,
} from 'react-native';
import COLORS from '../const/colors';
import ThemeStyle from '../const/ThemeStyle';
import { SafeAreaView } from 'react-native-safe-area-context';
import FastImage from 'react-native-fast-image';
import CameraPermissionScreen from './CameraPermissionScreen';
import CameraScreen from './CameraScreen.js';
import Button from './Button';

const { width, height } = Dimensions.get('window');

interface WalkthroughStep {
  id: number;
  title: string;
  description: string;
  image: any;
  titleImage: any;
  buttonText: string;
}

const walkthroughSteps: WalkthroughStep[] = [
  {
    id: 1,
    title: 'Clear, even background',
    description: 'Neatly lay out the garment with a clean, even background for better results.',
    titleImage: require('../assets/images/title1.png'),
    image: require('../assets/images/walkthrough1.png'),
    buttonText: 'Add first piece',
  },
  {
    id: 2,
    title: 'Keep pieces in focus',
    description: 'Make sure to keep your garments focused within the frame to ensure entire garment is captured.',
    titleImage: require('../assets/images/title2.png'),
    image: require('../assets/images/walkthrough2.png'),
    buttonText: 'Add first piece',
  },
  {
    id: 3,
    title: 'Ensure Ideal Lighting',
    description: 'Make sure to take pictures of your garments in environments where the lighting is ideal.',
    titleImage: require('../assets/images/title3.png'),
    image: require('../assets/images/walkthrough3.png'),
    buttonText: 'Add first piece',
  },
];

interface WalkthroughScreenProps {
  onComplete: () => void;
}

const WalkthroughScreen: React.FC<WalkthroughScreenProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showCameraPermission, setShowCameraPermission] = useState(false);
  const [showCamera, setShowCamera] = useState(false);

  const handleNext = () => {
    if (currentStep < walkthroughSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowCameraPermission(true);
    }
  };

  const handleCameraPermissionGranted = () => {
    setShowCameraPermission(false);
    setShowCamera(true);
  };

  const handleCameraPermissionBack = () => {
    setShowCameraPermission(false);
  };

  const handleNavigateToCamera = () => {
    setShowCameraPermission(false);
    setShowCamera(true);
  };

  const handleCameraBack = () => {
    setShowCamera(false);
    setShowCameraPermission(true);
  };

  const handlePhotoTaken = (photo: any) => {
    console.log('Photo taken:', photo);
    onComplete();
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentStepData = walkthroughSteps[currentStep];

  if (showCamera) {
    return (
      <CameraScreen
        onPhotoTaken={handlePhotoTaken}
        onBack={handleCameraBack}
      />
    );
  }

  if (showCameraPermission) {
    return (
      <CameraPermissionScreen
        onPermissionGranted={handleCameraPermissionGranted}
        onBack={handleCameraPermissionBack}
      />
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <SafeAreaView style={ThemeStyle.mainContainer}>
        <StatusBar
          barStyle={"dark-content"}
          backgroundColor={COLORS.white}
          translucent={false}
        />
        <View style={[styles.progressContainer]}>
          {walkthroughSteps.map((_, index) => (
            <View
              key={index}
              style={[
                styles.progressDot,
                {
                  backgroundColor: COLORS.grayInactive,
                  opacity: index === currentStep ? 1 : 0.5,
                },
                index === currentStep && {
                  backgroundColor: COLORS.Black,
                },
              ]}
            />
          ))}
        </View>
        <View style={styles.content}>
          <View style={styles.imageContainer}>
            <FastImage source={currentStepData.image} style={styles.image} resizeMode="contain" />
          </View>

          <View style={styles.iconContainer}>
            <FastImage
              source={currentStepData.titleImage}
              style={styles.titleImage}
              resizeMode="contain"
              tintColor={COLORS.Black}
            />
          </View>
          <Text style={[styles.title, { color: COLORS.Black }]}>
            {currentStepData.title}
          </Text>

          <Text style={styles.description}>{currentStepData.description}</Text>

          <View style={[styles.bottomSection]}>
            <Button
              title={currentStepData.buttonText}
              onPress={()=>{setShowCameraPermission(true)}}
              textSize={{ fontSize: 14 }}
              bgColor={COLORS.white}
              btnTextColor={COLORS.white}
              btnwidth={'90%'}
              shadowProp={true}
              primaryShadow={true}
              stylesCss={styles.actionButton}
            />
          </View>
          <TouchableOpacity
            style={styles.skipButton}
          >
            <Text style={styles.skipButtonText}>Skip for now</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.leftNavArea} onPress={handlePrevious} />
        <TouchableOpacity style={styles.rightNavArea} onPress={handleNext} />
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 40,
  },
  imageContainer: {
    width: width * 0.85,
    height: height * 0.5,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    resizeMode: 'cover',
  },
  iconContainer: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    ...ThemeStyle.H2,
    fontSize: 16,
    textAlign: 'center',
  },
  description: {
    ...ThemeStyle.body1,
    color: COLORS.secondaryDark,
    textAlign: 'center',
    lineHeight: 22,
    fontSize: 14, width: '90%'
  },
  bottomSection: {
    paddingHorizontal: 20,
    paddingTop: 12
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: Platform.OS === 'ios' ? 10 : 20,
  },
  progressDot: {
    flex: 1,
    height: 2,
    backgroundColor: COLORS.grayInactive,
    marginHorizontal: 4,
    borderRadius: 4,
    opacity: 0.5,
  },
  progressDotActive: {
    backgroundColor: COLORS.white,
    opacity: 1,
  },
  actionButton: {
    borderRadius: 25,
    padding: 12,
    paddingHorizontal: 18,
    alignItems: 'center',
    alignSelf: 'center', backgroundColor: COLORS.Black
  },
  skipButton: {
    alignItems: 'center',
    marginTop: Dimensions.get('window').height * 0.02,
  },
  skipButtonText: {
    fontSize: 12,
    color: 'gray',
    fontFamily: 'SFPRODISPLAYBOLD',
  },
  leftNavArea: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: width * 0.2,
  },
  rightNavArea: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: width * 0.2,
  },
  titleImage: {
    width: '40%',
    height: '40%', marginTop: 10
  },
});

export default WalkthroughScreen; 