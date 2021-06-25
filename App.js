import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import moment from "moment";
import "moment/locale/es-us";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  LogBox,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

const API_KEY = "ed1157b26b05232ed89a05c4b5fb5ee9";
const latitude = "24.8049008";
const longitude = "-107.4933539";

const viewHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1287a8",
    flex: 1,
    paddingTop: StatusBar.currentHeight,
  },
  weatherContainer: {
    alignItems: "center",
    height: viewHeight - StatusBar.currentHeight,
    justifyContent: "center",
  },
  informationText: {
    color: "#fff",
    fontSize: 20,
  },
  weatherIcon: {
    height: 128,
    marginTop: 32,
    width: 128,
  },
  hourlyWeatherIcon: {
    height: 64,
    width: 64,
  },
  hourlyWeatherContainer: {
    alignItems: "center",
    marginHorizontal: 14,
  },
  hourlyTempHour: {
    color: "#fff",
    fontSize: 12,
  },
  hourlyTempText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    marginTop: -8,
  },
  dailyWeatherContainer: {
    borderRadius: 8,
    borderTopColor: "#fff",
    borderTopWidth: 0.5,
    flex: 1,
    marginHorizontal: 8,
    paddingBottom: 16,
    paddingHorizontal: 8,
    paddingTop: 8,
  },
  dailyWeatherContentRow: {
    flex: 1,
    flexDirection: "row",
    marginTop: 8,
  },
  dailyDateText: {
    color: "#fff",
    fontSize: 20,
    textAlign: "center",
    textTransform: "capitalize",
  },
  dailyWeatherIcon: {
    height: 86,
    width: 86,
  },
  dailyWeatherDescription: {
    alignItems: "center",
    flex: 1,
    marginHorizontal: 16,
  },
  dailyWeatherDescriptionText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    textTransform: "capitalize",
  },
  dailyWeatherTextContainer: {
    alignItems: "center",
  },
  dailyWeatherLabel: {
    color: "#fff",
  },
  dailyWeatherText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  dailyWeatherTempsContainer: {
    flex: 1,
    marginTop: 8,
  },
  dailyWeatherDayTempsContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
});

export default function App() {
  const [weatherError, setWeatherError] = useState(false);
  const [weatherData, setWeatherData] = useState();

  const getWeather = async () => {
    try {
      setWeatherData(null);
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude={part}&appid=${API_KEY}&units=metric&lang=es`
      );
      if (response.status === 200) {
        const payload = await response.json();
        setWeatherData(payload);
        setWeatherError(false);
      } else {
        setWeatherError(true);
      }
    } catch (error) {
      setWeatherError(true);
    }
  };

  useEffect(() => {
    LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);
    getWeather();
  }, []);

  const renderHourlyWeatherItem = ({ item }) => {
    const { weather, temp, dt } = item;

    return (
      <View style={styles.hourlyWeatherContainer}>
        <Image
          style={styles.hourlyWeatherIcon}
          source={{
            uri: `http://openweathermap.org/img/wn/${weather[0].icon}.png`,
          }}
        />

        <Text style={styles.hourlyTempText}>{temp.toFixed(0)}°C</Text>

        <Text style={styles.hourlyTempHour}>
          {moment.unix(dt).format("LT")}
        </Text>
      </View>
    );
  };

  const renderDailyWeatherItem = ({ item, index }) => {
    const { weather, temp, dt } = item;

    return (
      <View style={styles.dailyWeatherContainer}>
        <View style={styles.dailyWeatherContentRow}>
          <View style={styles.dailyWeatherDescription}>
            <Text style={styles.dailyDateText}>
              {index === 0 ? "Hoy" : moment.unix(dt).format("MMMM DD")}
            </Text>

            <Image
              style={styles.dailyWeatherIcon}
              source={{
                uri: `http://openweathermap.org/img/wn/${weather[0].icon}@2x.png`,
              }}
            />

            <Text style={styles.dailyWeatherDescriptionText}>
              {weather[0].description}
            </Text>
          </View>

          <View style={styles.dailyWeatherTempsContainer}>
            <View style={styles.dailyWeatherDayTempsContainer}>
              <View style={styles.dailyWeatherTextContainer}>
                <Text style={styles.dailyWeatherLabel}>Mañana</Text>

                <Text style={styles.dailyWeatherText}>
                  {temp.morn.toFixed(0)}°
                </Text>
              </View>

              <View style={styles.dailyWeatherTextContainer}>
                <Text style={styles.dailyWeatherLabel}>Tarde</Text>

                <Text style={styles.dailyWeatherText}>
                  {temp.day.toFixed(0)}°
                </Text>
              </View>

              <View style={styles.dailyWeatherTextContainer}>
                <Text style={styles.dailyWeatherLabel}>Noche</Text>

                <Text style={styles.dailyWeatherText}>
                  {temp.night.toFixed(0)}°
                </Text>
              </View>
            </View>

            <View style={styles.dailyWeatherDayTempsContainer}>
              <View style={styles.dailyWeatherTextContainer}>
                <Text style={styles.dailyWeatherLabel}>Min:</Text>

                <Text style={styles.dailyWeatherText}>
                  {temp.min.toFixed(0)}°
                </Text>
              </View>

              <View style={styles.dailyWeatherTextContainer}>
                <Text style={styles.dailyWeatherLabel}>Max:</Text>

                <Text style={styles.dailyWeatherText}>
                  {temp.max.toFixed(0)}°
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const getWeatherBasedBackgroundColor = () => {
    if (weatherData) {
      const temperature = weatherData.current.temp.toFixed(0);

      switch (true) {
        case temperature < 10:
          return { backgroundColor: "#3c6478" };

        case temperature < 20:
          return { backgroundColor: "#1287a8" };

        case temperature < 30:
          return { backgroundColor: "#bca136" };

        case temperature <= 40:
          return { backgroundColor: "#da621e" };

        case temperature > 40:
          return { backgroundColor: "#c02f1d" };

        default:
          return { backgroundColor: "#1287a8" };
      }
    }
  };

  const renderWeather = () => {
    if (weatherError) {
      return (
        <View style={styles.weatherContainer}>
          <Text style={{ color: "#fff", fontSize: 20 }}>
            No pudimos obtener el clima, muy mal
          </Text>
        </View>
      );
    }

    if (weatherData) {
      const { current, hourly, daily } = weatherData;

      return (
        <View>
          <View style={styles.weatherContainer}>
            <Text style={{ color: "#fff", fontSize: 20 }}>
              El clima en Culiacan es:
            </Text>

            <Text style={{ color: "#fff", fontSize: 86, fontWeight: "bold" }}>
              {current.temp.toFixed(0)}°C
            </Text>

            <Text style={{ color: "#fff", fontSize: 12 }}>
              Sensación termica de {current.feels_like.toFixed(0)}°
            </Text>

            <Image
              style={styles.weatherIcon}
              source={{
                uri: `http://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png`,
              }}
            />

            <Text
              style={{
                textTransform: "capitalize",
                color: "#fff",
                fontWeight: "bold",
                marginTop: -18,
              }}
            >
              {current.weather[0].description}
            </Text>

            <Text style={{ marginTop: 32, fontSize: 12, color: "#fff" }}>
              (Desliza hacia abajo para mas detalles)
            </Text>
          </View>

          <View style={{ marginBottom: 32 }}>
            <Text
              style={{
                color: "#fff",
                fontSize: 20,
                marginLeft: 16,
                marginBottom: 8,
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              Durante las proximas horas
            </Text>

            <FlatList
              data={hourly}
              renderItem={renderHourlyWeatherItem}
              horizontal
              keyExtractor={(item, index) => `${item.dt}-${index}`}
            />
          </View>

          <View>
            <Text
              style={{
                color: "#fff",
                fontSize: 20,
                marginLeft: 16,
                marginBottom: 8,
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              Durante los próximos dias
            </Text>

            <FlatList
              data={daily}
              renderItem={renderDailyWeatherItem}
              keyExtractor={(item, index) => `${item.dt}-${index}`}
            />
          </View>

          <Text
            style={{ marginVertical: 32, textAlign: "center", color: "#fff" }}
          >
            Desarrollado por...
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.weatherContainer}>
        <Text style={styles.informationText}>Obteniendo el clima...</Text>
      </View>
    );
  };

  return (
    <View style={[styles.container, getWeatherBasedBackgroundColor()]}>
      <ExpoStatusBar style="auto" />
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={!weatherData} onRefresh={getWeather} />
        }
      >
        {renderWeather()}
      </ScrollView>
    </View>
  );
}
