import { StatusBar } from 'expo-status-bar';
import axios from 'axios';
import { StyleSheet, Text, View, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import getStreetRequest from './requests/getStreetRequest';
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
  const [glat, setGLat] = useState(0);
  const [glon, setGLon] = useState(0);
  useEffect(async () => {
    const loc = await getUserLocation();
    const config = {
      url: `http://localhost:8000/get-getaway?latitude=33.8&longitude=-118.31`, // if not in LA
      // url: `http://localhost:8000/get-getaway?latitude=${USER_LAT}&longitude=${USER_LON}`,
      method: 'get'
    }
    let res = await axios(config);
    const tempLat = res.data.data[0];
    const tempLon = res.data.data[1];
    console.log("Getaway location: " + tempLat + " " + tempLon);

    setGLat(tempLat);
    setGLon(tempLon);
  }, []);

  console.log("LOL?", glat,glon);
  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>Your clue image.</Text>
      <Image
      source={{
        uri: `https://maps.googleapis.com/maps/api/streetview?size=400x400&location=${glat},${glon}&fov=80&heading=70&pitch=0&key=${GOOGLE_API_KEY}&radius=1000`,
        method: 'GET',
        headers: {
          Pragma: 'no-cache'
        }
      }}
      style={{ width: 400, height: 400 }}
      />
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
  // let GETAWAY_LAT;
  // let GETAWAY_LON;
  // let IMG;
  const [glat, setGLat] = useState(0);
  const [glon, setGLon] = useState(0);
  const [ulat, setULat] = useState(0);
  const [ulon, setULon] = useState(0);
  const [img, setImg] = useState({});

  const config = {
    url: `http://localhost:8000/get-getaway?latitude=33.8&longitude=-118.31`, // if not in LA
    // url: `http://localhost:8000/get-getaway?latitude=${USER_LAT}&longitude=${USER_LON}`,
    method: 'get'
  }

  // (async () => {
  //   const uloc = await getUserLocation();
  //   USER_LAT = uloc[0];
  //   USER_LON = uloc[1];
  // })();

  //on initial load
  useEffect(async () => {
    const loc = await getUserLocation();
    const config = {
      url: `http://localhost:8000/get-getaway?latitude=33.8&longitude=-118.31`, // if not in LA
      // url: `http://localhost:8000/get-getaway?latitude=${USER_LAT}&longitude=${USER_LON}`,
      method: 'get'
    }
    let res = await axios(config);
    const tempLat = res.data.data[0];
    const tempLon = res.data.data[1];
    console.log("Getaway location: " + tempLat + " " + tempLon);

    setGLat(tempLat);
    setGLon(tempLon);
  }, []);

  // on every second, update current location
  useEffect(() => { 
    const intervalID = setInterval(async () => {
      const loc = await getUserLocation();
      setULat(loc[0]);
      setULon(loc[1]);
    }, 1000);

    return () => clearInterval(intervalID);

  }, [ulat, ulon])

  // useEffect( async () => { 
  //   const loc = await getUserLocation();
  //   setULat(loc[0]);
  //   setULon(loc[1]);
  // }, [])

  // (async () => { await axios(config)
  //   .then(res => {
  //       GETAWAY_LAT = res.data.data[0];
  //       GETAWAY_LON = res.data.data[1];

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
            tabBarActiveTintColor: 'black',
            tabBarInactiveTintColor: 'gray',
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