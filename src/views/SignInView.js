// SignInView.js
import React from 'react';
import AuthView from './AuthView';

const SignInView = ({navigation}) => (
  <AuthView navigation={navigation} type="SignIn" isSignUp={false} />
);

export default SignInView;
