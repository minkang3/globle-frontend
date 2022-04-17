import { StatusBar } from 'expo-status-bar';
import axios from 'axios';
import { StyleSheet, Text, View, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import styles from './style'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { GOOGLE_API_KEY } from '@env'

function DirectorScreen() {
  startCompass();
  window.navigator.geolocation.getCurrentPosition(locationHandler);
  
  return (
    <View style={styles.container}>
      <Image style={styles.arrow} source={require('./assets/arrow.png')} />
      <Text style={styles.subtitle} >Distance:</Text>
      <Text style={styles.primary}>00.00m</Text>
    </View>
  )
}

function PictureScreen() {
  return (
    <View style={styles.container}>
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

  (async () => {
    const response = await getUserLocation();
    console.log("lon + lat:", response);
  })();

  return (
    <NavigationContainer>
      <Tab.Navigator
          screenOptions={({ route } ) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === 'Director') {
                iconName = focused ? 'compass' : 'compass-outline'
              } else if (route.name === 'Image') {
                iconName = focused ? 'image' : 'image-outline'
              }

              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: 'black',
            tabBarInactiveTintColor: 'gray'
          })}
        >
        <Tab.Screen name='Director' component={DirectorScreen} 
          options={({ navigation }) => ({

          })}
        />
        <Tab.Screen name="Image" component={PictureScreen} 
          options={({ navigation }) => ({

          })}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

// const compassCircle = 0;
// const startBtn = 0;
// const myPoint = 0;

let compass;
const isIOS = !(
  Navigator.userAgent.match(/(iPod|iPhone|iPad)/)&&
  Navigator.userAgent.match(/AppleWebKit/)
);

// function init() {
//   startBtn.addEventListener("click", startCompass);
//   navigator.geolocation.getCurrentPosition(locationHandler);
// }

function handler(e) {
  compass = e.webkitCompassHeading || Math.abs(e.alpha - 360);
  compassCircle.style.transform = `translate(-50%, -50%) rotate(${-compass}deg)`;

  // ±15 degree
  if (
    (pointDegree < Math.abs(compass) && pointDegree + 15 > Math.abs(compass)) ||
    pointDegree > Math.abs(compass + 15) ||
    pointDegree < Math.abs(compass)
  ) {
    myPoint.style.opacity = 0;
  } else if (pointDegree) {
    myPoint.style.opacity = 1;
  }
}

function startCompass() {
  if (isIOS) {
    DeviceOrientationEvent.requestPermission()
      .then(response => {
        if (response === "granted") {
          window.addEventListener("deviceorientation", handler, true);
        } else {
          alert("has to be allowed");
        }
      })
      .catch(() => alert("not supported"));
  } else {
  window.addEventListener("deviceorientationabsolute", handler, true);
  }
}

let pointDegree;

function locationHandler(position) {
  const {latitude, longitude } = position.coords;
  pointDegree = calcDegreeToPoint(latitude, longitude);
  
  if (pointDegree < 0) {
    pointDegree = pointDegree + 360;
  }
  console.log(pointDegree);
}

function calcDegreeToPoint(latitude, longitude) {
  const point = {
    lat: 33.9,
    lon: -118.3
  };

  const phiK = (point.lat * Math.PI) / 180.0;
  const lambdaK = (point.lon * Math.PI) / 180.0;
  const phi = (latitude * Math.PI) / 180.0;
  const lambda = (longitude * Math.PI) / 180.0;
  const psi =
    (180.0 / Math.PI) *
    Math.atan2(
      Math.sin(lambdaK - lambda),
      Math.cos(phi) * Math.tan(phiK) -
        Math.sin(phi) * Math.cos(lambdaK - lambda)
    );
  return Math.round(psi);
}