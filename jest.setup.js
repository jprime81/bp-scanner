import 'react-native-gesture-handler/jestSetup';

jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

jest.mock('react-native-sqlite-storage', () => ({
  openDatabase: jest.fn(),
  enablePromise: jest.fn(),
}));

jest.mock('@react-native-firebase/auth', () => ({
  auth: jest.fn(() => ({
    currentUser: null,
    signInWithEmailAndPassword: jest.fn(),
    createUserWithEmailAndPassword: jest.fn(),
    signOut: jest.fn(),
  })),
}));

jest.mock('@react-native-firebase/storage', () => ({
  storage: jest.fn(() => ({
    ref: jest.fn(),
  })),
}));
