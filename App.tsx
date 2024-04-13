import { StyleSheet, Text, View } from "react-native";
import * as Location from "expo-location";
import { useEffect, useState } from "react";
import { WeatherData } from "./types";

export default function App() {
  const [isPermissions, setIsPermissions] = useState(false);

  const [currentWeatherData, setCurrentWeatherData] = useState<
    WeatherData | undefined
  >();

  const [location, setLocation] = useState<
    Location.LocationObjectCoords | undefined
  >();

  const API_KEY = "09a03ce18def9499b0f10b5b97a965ed";

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        if (location.latitude & location.longitude) {
          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?units=metric&lat=${location?.latitude}&lon=${location.longitude}&appid=${API_KEY}`
          );

          console.log(response.ok);
          if (response.ok) {
            const data: WeatherData = await response.json();
            setCurrentWeatherData(data);
          }
        }
      } catch (error) {
        console.log("error", error);
      } finally {
        console.log("fin");
      }
    };

    fetchWeatherData();
  }, [isPermissions]);

  useEffect(() => {
    const getLocationPermissions = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      try {
        if (status !== "granted") {
          setIsPermissions(false);
          return;
        } else {
          setIsPermissions(true);
          const location = await Location.getCurrentPositionAsync({});
          setLocation(location.coords);
        }
      } catch (error) {
        console.log("error", error);
      }
    };

    getLocationPermissions();
  }, []);

  //request - отправка запроса к серверу
  //response - ответ от сервера

  return (
    <View style={styles.container}>
      <Text>Долгота: {location?.longitude}</Text>
      <Text>Широта: {location?.latitude}</Text>
      <Text>Темпа: {currentWeatherData?.main.temp}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
