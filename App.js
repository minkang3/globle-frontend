import { StatusBar } from 'expo-status-bar';
import axios from 'axios';
import { StyleSheet, Text, View, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import styles from './style'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { GOOGLE_API_KEY } from '@env'
import { useEffect, useState } from 'react';

import { Magnetometer } from 'expo-sensors';

const DESTINATION_DEGREE = 0;
const UPDATE_INTERVAL = 1000;

function DirectorScreen() {
  const [deviceRotation, setDeviceRotation] = useState({
    x: 0,
    y: 0,
    z: 0
  });
  const [angle, setAngle] = useState(0);
  const [direction, setDirection] = useState('X');
  const [antiDirection, setAntiDirection] = useState(0);
  const [arrowStyle, setArrowStyle] = useState({
    transform: [{rotate: `0deg`}],
    fontSize: 200
  });

  // Magnetometer.setUpdateInterval(UPDATE_INTERVAL);
  // Magnetometer.addListener(result => {
  //   const _angle = calcAngle(result);
  //   const _degree = calcDegree(_angle);

  //   setDeviceRotation(result);
  //   setAngle(_angle);
  //   setArrowStyle({
  //     transform: [{rotate: `${-_degree + DESTINATION_DEGREE}deg`}],
  //     fontSize: 200
  //   });
  // });

  const calcAngle = (magnetometer) => {
    let angle = 0;
    if (magnetometer) {
      let { x, y, z } = magnetometer;
      if (Math.atan2(y, x) >= 0) {
        angle = Math.atan2(y, x) * (180 / Math.PI);
      } else {
        angle = (Math.atan2(y, x) + 2 * Math.PI) * (180 / Math.PI);
      }
    }
    return Math.round(angle);
  };

  const calcDegree = (magnetometer) => {
    return magnetometer - 90 >= 0 ? magnetometer - 90 : magnetometer + 271;
  };

  useEffect(() => {

  });

  return (
    <View style={styles.container}>
      <Text style={styles.toolTip} >Device must be horizontally level in order to show the correct direction.</Text>
      <View style={styles.arrowContainer}>
        <Text style={arrowStyle}>^</Text>
      </View>
      <Text style={styles.subtitle} >Distance:</Text>
      <Text style={styles.primary}>00.00m</Text>
    </View>
  )
}

function PictureScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>Your clue image.</Text>
      <Image source={require('./assets/default_image.jpeg')} style={styles.clueImage}></Image>
    </View>
  )
}

let getUserLocation = async () => {
  let LNG, LAT;
  await axios.post(`https://www.googleapis.com/geolocation/v1/geolocate?key=${GOOGLE_API_KEY}`)
    .then((response) => {
      let location = response.data.location;
      console.log("user location: ", location.lng, location.lat);
      LNG = location.lng;
      LAT = location.lat;
    }, (error) => {
      console.log(error);
    });

  return [LNG, LAT];
}

const Tab = createBottomTabNavigator();

export default function App() {

  // let USER_LON;
  // let USER_LAT;

  // (async () => {
  //   const response = await getUserLocation();
  //   USER_LAT = response[0];
  //   USER_LON = response[1];
  // })();

  // const config = {
  //   url: `http://localhost:8000/get-getaway?latitude=33.8&longitude=-118.31`, // if not in LA
  //   // url: `http://localhost:8000/get-getaway?latitude=${USER_LAT}&longitude=${USER_LON}`,
  //   method: 'get'
  // }

  // let GET_AWAY_LAT;
  // let GET_AWAY_LON;

  // (async () => { await axios(config)
  //   .then(res => {
  //       GET_AWAY_LAT = res.data.data[0];
  //       GET_AWAY_LON = res.data.data[1];
  //   })
  //   .catch(err => {
  //       console.error(err);
  //   });
  // })();

  return (
    <NavigationContainer>
      <Tab.Navigator
          screenOptions={({ route } ) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === 'Compass') {
                iconName = focused ? 'compass' : 'compass-outline'
              } else if (route.name === 'Clue') {
                iconName = focused ? 'image' : 'image-outline'
              }

              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: 'white',
            tabBarInactiveTintColor: 'gray',
            tabBarStyle: {
              backgroundColor: '#333',
              borderTopWidth: 1,
              borderTopColor: 'gray'
            },
            tabBarItemStyle: {
              fontSize: 12
            },
            headerStyle: {
              backgroundColor: '#333',
              borderBottomWidth: 1,
              borderBottomColor: 'gray',
            },
            headerTitleStyle: {
              color: 'white',
              fontSize: 24,
              textAlign: 'center'
            }
          })}
        >
        <Tab.Screen name='Compass' component={DirectorScreen} 
          options={{

          }}
        />
        <Tab.Screen name="Clue" component={PictureScreen} 
          options={({ navigation }) => ({

          })}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}