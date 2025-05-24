import React from 'react';
import { View, Text, Button, StyleSheet, Image, ScrollView } from 'react-native';

const DashboardScreen = ({ route, navigation }) => {
  const user = route.params?.user;

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {/* Logo Section */}
        <View style={styles.logoContainer}>
          <Image source={require('../../assets/images/icon.png')} style={styles.logo} />
        </View>

        <Text style={styles.title}>Welcome {user?.first_name || 'User'}!</Text>

        {/* User Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.infoText}><Text style={styles.label}>Email:</Text> {user?.email}</Text>
          <Text style={styles.infoText}><Text style={styles.label}>Gender:</Text> {user?.gender}</Text>
          <Text style={styles.infoText}><Text style={styles.label}>Age:</Text> {user?.age}</Text>
          <Text style={styles.infoText}><Text style={styles.label}>Nationality:</Text> {user?.nationality}</Text>
        </View>

        <View style={styles.buttonContainer}>
          <Button title="check your Diabetes" onPress={() => navigation.navigate('Index')} color="#0277bd" />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: '#E6E6FA',
    padding: 20,
  },
  container: {
    alignItems: 'center',
  },
  logoContainer: {
    marginTop: 20,
    marginBottom: 30,
    alignItems: 'center',
  },
  logo: {
    width: 250,
    height: 250,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 20,
    textAlign: 'center',
  },
  infoCard: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 30,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 12,
    color: '#333',
  },
  label: {
    fontWeight: 'bold',
    color: '#0277bd',
  },
  buttonContainer: {
    width: '100%',
    marginTop: 10,
  },
});

export default DashboardScreen;
