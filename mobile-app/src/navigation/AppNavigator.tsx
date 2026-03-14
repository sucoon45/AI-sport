import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/Home/HomeScreen';
import MatchDetailsScreen from '../screens/MatchDetails/MatchDetailsScreen';
import PredictionsScreen from '../screens/Predictions/PredictionsScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import LeaguesScreen from '../screens/Leagues/LeaguesScreen';
import LoginScreen from '../screens/Auth/LoginScreen';
import WalletScreen from '../screens/Wallet/WalletScreen';
import DepositScreen from '../screens/Wallet/DepositScreen';
import NotificationsScreen from '../screens/Notifications/NotificationsScreen';
import SubscriptionScreen from '../screens/Profile/SubscriptionScreen';
import AffiliateScreen from '../screens/Profile/AffiliateScreen';
import { Colors } from '../theme/colors';
import { Home, TrendingUp, User, Globe } from 'lucide-react-native';
import { useAuth } from '../hooks/useAuth';
import { ActivityIndicator, View } from 'react-native';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const HomeStack = () => (
  <Stack.Navigator id="HomeStack" screenOptions={{ headerShown: false }}>
    <Stack.Screen name="HomeMain" component={HomeScreen} />
    <Stack.Screen name="MatchDetails" component={MatchDetailsScreen} />
    <Stack.Screen name="Wallet" component={WalletScreen} />
    <Stack.Screen name="Deposit" component={DepositScreen} />
    <Stack.Screen name="Notifications" component={NotificationsScreen} />
    <Stack.Screen name="Subscription" component={SubscriptionScreen} />
    <Stack.Screen name="Affiliate" component={AffiliateScreen} />
  </Stack.Navigator>
);

const AppNavigator = () => {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color={Colors.primary} size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {session ? (
        <Tab.Navigator
          id="AppTabs"
          screenOptions={{
            headerShown: false,
            tabBarStyle: {
              backgroundColor: Colors.surface,
              borderTopColor: Colors.border,
              height: 65,
              paddingBottom: 12,
              paddingTop: 8,
            },
            tabBarActiveTintColor: Colors.primary,
            tabBarInactiveTintColor: Colors.textMuted,
            tabBarLabelStyle: {
              fontSize: 10,
              fontWeight: '600',
            }
          }}
        >
          <Tab.Screen 
            name="Home" 
            component={HomeStack} 
            options={{
              tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
            }}
          />
          <Tab.Screen 
            name="Leagues" 
            component={LeaguesScreen} 
            options={{
              tabBarIcon: ({ color, size }) => <Globe color={color} size={size} />,
            }}
          />
          <Tab.Screen 
            name="Predictions" 
            component={PredictionsScreen} 
            options={{
              tabBarIcon: ({ color, size }) => <TrendingUp color={color} size={size} />,
            }}
          />
          <Tab.Screen 
            name="Profile" 
            component={ProfileScreen} 
            options={{
              tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
            }}
          />
        </Tab.Navigator>
      ) : (
        <Stack.Navigator id="AuthStack" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};


export default AppNavigator;
