import { StatusBar } from 'expo-status-bar';
import axios from 'axios';
import { StyleSheet, Text, View, Image, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import getStreetRequest from './requests/getStreetRequest';
import styles from './style'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { GOOGLE_API_KEY , GOOGLE_URL} from '@env'
import { useEffect, useState } from 'react';

import { Magnetometer } from 'expo-sensors';
import Pressable from 'react-native/Libraries/Components/Pressable/Pressable';

const DESTINATION_DEGREE = 0;
const UPDATE_INTERVAL = 1000;
const IMAGE_PATH = './assets/default_image.png';
const D_LAT = 120.12153;
const D_LONG = 40.124992;
const COOLDOWN = 5;

let cooldownStarted = false;

console.log('api-key: ' + GOOGLE_API_KEY);

function DirectorScreen() {
  const [deviceRotation, setDeviceRotation] = useState({
    x: 0,
    y: 0,
    z: 0
  });
  const [angle, setAngle] = useState(0);
  const [arrowStyle, setArrowStyle] = useState({
    transform: [{rotate: `0deg`}],
    fontSize: 200,
  });

  const [cooldown, setCooldown] = useState(0);
  if (!cooldownStarted) {
    cooldownStarted = true;
    console.log('runned');
    setInterval(() => {
      if (cooldown > 0) {
        setCooldown(prev => prev - 1);
      }
    }, 1000);
    Magnetometer.setUpdateInterval(UPDATE_INTERVAL);
    Magnetometer.removeAllListeners();
    Magnetometer.addListener(data => {
      // console.log('updating...');
      setDeviceRotation(data);
    });
  }

  const updateAngle = async () => {
    // console.log('updating...');
    const _angle = calcAngle(deviceRotation);
    const _degree = calcDegree(_angle);

    setDeviceRotation(deviceRotation);
    setAngle(_angle);
    setArrowStyle({
      transform: [{rotate: `${-_degree + DESTINATION_DEGREE}deg`}],
      fontSize: 200
    });
  }

  const calcAngle = (magReading) => {
    let angle = 0;
    if (magReading) {
      let { x, y, z } = magReading;
      if (Math.atan2(y, x) >= 0) {
        angle = Math.atan2(y, x) * (180 / Math.PI);
      } else {
        angle = (Math.atan2(y, x) + 2 * Math.PI) * (180 / Math.PI);
      }
    }
    return Math.round(angle);
  };

  const calcDegree = (magReading) => {
    return magReading - 90 >= 0 ? magReading - 90 : magReading + 271;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.toolTip} >Device must be horizontally level in order to show the correct direction.</Text>
      <View style={styles.arrowContainer}>
        <Text style={arrowStyle}>^</Text>
      </View>
      <Text style={styles.subtitle} >Distance:</Text>
      <Text style={styles.primary}>{calcDistance(33.8, -118.31, D_LAT, D_LONG).toFixed(0)}m</Text>
      <Pressable style={styles.refreshButton} onPress={() => {setCooldown(COOLDOWN); updateAngle()}} disabled={cooldown > 0} >
        <Text style={cooldown > 0 ? styles.disabledButtonText : styles.buttonText}>{cooldown > 0 ? cooldown : 'Refresh'}</Text>
      </Pressable>
    </View>
  )
}

function PictureScreen() {
  const [glat, setGLat] = useState(33.9);
  const [glon, setGLon] = useState(-118.31);
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
      <Image
      source={{
        uri: `https://maps.googleapis.com/maps/api/streetview?size=300x300&location=${glat},${glon}&fov=80&heading=70&pitch=0&key=${GOOGLE_API_KEY}&radius=2000`,
        method: 'GET',
        headers: {
          Pragma: 'no-cache'
        }
      }}
      style={{ width: 300, height: 300 }}
      />
      <Text style={styles.questText}>This picture, pulled from Google Maps StreetView, is your visual clue of the day. The hunt is on!</Text>
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

    //request to the backend for our local getaway
    let config = {
      url: `http://localhost:8000/get-getaway?latitude=33.8&longitude=-118.31`, // if not in LA
      // url: `http://localhost:8000/get-getaway?latitude=${loc[0]}&longitude=${loc[1]}`,
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

              return <Ionicons name={iconName} size={35} color={color} />;
            },
            tabBarActiveTintColor: 'white',
            tabBarInactiveTintColor: '#555',
            tabBarStyle: {
              backgroundColor: '#222',
              borderTopWidth: 1,
              borderTopColor: 'gray',
              height: 70,
            },
            tabBarItemStyle: {
              fontSize: 12
            },
            headerStyle: {
              backgroundColor: '#222',
              borderBottomWidth: 1,
              borderBottomColor: 'gray',
              height: 90
            },
            headerTitleStyle: {
              color: 'white',
              fontSize: 30,
              textAlign: 'center',
              fontFamily: 'Helvetica'
            },
            title: 'GLOBLE',
            tabBarShowLabel: false,
          })}
        >
        <Tab.Screen name="Clue" component={PictureScreen} 
          options={{

          }}
        />
        <Tab.Screen name='Compass' component={DirectorScreen} 
          options={{

          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

function calcDistance(u_lat, u_long, dest_lat, dest_long) {
  return Math.sqrt((u_lat - dest_lat) * (u_lat - dest_lat) + (u_long - dest_long) * (u_long - dest_long));
}

function calcDirectionToDestination(u_lat, u_long, dest_lat, dest_long) {
  let phi = 0;
  let delta_x = dest_lat - u_lat;
  let delta_y = dest_long - u_long;

  if (delta_x > 0 && delta_y > 0) { phi = 0; }
  else if (delta_x < 0 && delta_y > 0) { phi = 90; }
  else if (delta_x < 0 && delta_y < 0) { phi = 180; }
  else if (delta_x > 0 && delta_y < 0) { phi = 270; }

  let theta = Math.atan(Math.abs(delta_y) / Math.abs(delta_x)) + phi;
}