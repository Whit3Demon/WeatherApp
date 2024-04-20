import {
	StyleSheet,
	Text,
	View,
	Image,
	ActivityIndicator,
	TouchableHighlight,
} from 'react-native'
import * as Location from 'expo-location'
import { useEffect, useState } from 'react'
import { WeatherData } from './types'
import { FontAwesome5 } from '@expo/vector-icons'
import { Ionicons } from '@expo/vector-icons'
export default function App() {
	const [isPermissions, setIsPermissions] = useState(false)

	const [isLoading, setIsLoading] = useState(true)

	const [isError, setIsError] = useState(false)

	const [currentWeatherData, setCurrentWeatherData] = useState<
		WeatherData | undefined
	>()

	const [location, setLocation] = useState<
		Location.LocationObjectCoords | undefined
	>()

	const API_KEY = '09a03ce18def9499b0f10b5b97a965ed'

	const fetchWeatherData = async () => {
		setIsLoading(true)
		try {
			if (!location) {
				console.log('return')
				return
			}
			if (location.latitude & location.longitude) {
				console.log('start fetching')

				const response = await fetch(
					`https://api.openweathermap.org/data/2.5/weather?units=metric&lang=ru&lat=${location?.latitude}&lon=${location.longitude}&appid=${API_KEY}`
				)

				console.log(response.ok)
				if (response.ok) {
					const data: WeatherData = await response.json()
					setCurrentWeatherData(data)
					console.log(data)
				}
			}
		} catch (error) {
			setIsError(true)
		} finally {
			setIsLoading(false)
		}
	}

	const getLocationPermissions = async () => {
		const { status } = await Location.requestForegroundPermissionsAsync()
		try {
			if (status !== 'granted') {
				setIsPermissions(false)
				return
			} else {
				setIsPermissions(true)
				const location = await Location.getCurrentPositionAsync({})
				setLocation(location.coords)
			}
		} catch (error) {
			console.log('error', error)
		}
	}

	useEffect(() => {
		console.log(location)
		if (location) {
			fetchWeatherData()
		}
	}, [location, isPermissions])

	useEffect(() => {
		setIsLoading(true)
		getLocationPermissions()
	}, [])

	return (
		<View style={styles.container}>
			{!isPermissions ? (
				<TouchableHighlight
					style={{ backgroundColor: 'yellow' }}
					onPress={async () => {
						const { status } =
							await Location.requestForegroundPermissionsAsync()
						console.log(status)
					}}>
					<Text>Дайте доступ к геолокации</Text>
				</TouchableHighlight>
			) : isError ? (
				<TouchableHighlight
					style={{ backgroundColor: 'red' }}
					onPress={fetchWeatherData}>
					<Text>Ошибка при получении погоды. Повторить?</Text>
				</TouchableHighlight>
			) : isLoading ? (
				<ActivityIndicator
					size={'large'}
					color='green'
				/>
			) : (
				<>
					{currentWeatherData && (
						<Image
							style={styles.weatherImagesSize}
							source={{
								uri:
									'https://openweathermap.org/img/wn/' +
									currentWeatherData.weather[0].icon +
									'@4x.png',
							}}
							resizeMode='contain'
						/>
					)}
					<Text style={styles.temp}>
						Темпа: {currentWeatherData?.main.temp}
					</Text>

					<Text style={styles.feelslike}>
						Oщущается как: {currentWeatherData?.main.feels_like}
					</Text>
					<Text style={styles.city}> {currentWeatherData?.name}</Text>

					<View style={styles.dataContainer}>
						<View style={styles.dataBlock}>
							<Ionicons
								name='water-outline'
								size={24}
								color='white'
							/>
							<Text style={styles.dataSpeedHum}>
								{currentWeatherData?.main.humidity}%
							</Text>
							<Text style={styles.dataSpeedHum}> Влажность</Text>
						</View>
						<View style={styles.dataBlock}>
							<FontAwesome5
								name='wind'
								size={24}
								color='white'
							/>
							<Text style={styles.dataSpeedHum}>
								{currentWeatherData?.wind.speed} км/ч
							</Text>
							<Text style={styles.dataSpeedHum}> Скорость ветра</Text>
						</View>
					</View>
				</>
			)}
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'rgba(31,31,31,1)',
		alignItems: 'center',
		justifyContent: 'center',
	},
	weatherImagesSize: {
		width: 100,
		height: 100,
	},

	temp: {
		fontSize: 30,
		color: '#fff',
		fontWeight: '500',
	},

	feelslike: {
		fontSize: 15,
		color: '#fff',
		fontWeight: '400',

		marginTop: 7,
	},

	city: {
		fontSize: 20,
		color: '#fff',

		marginTop: 10,
	},

	dataContainer: {
		flexDirection: 'row',
		gap: 30,
	},

	dataBlock: {
		alignItems: 'center',
		justifyContent: 'center',

		gap: 10,

		marginTop: 25,
	},

	dataSpeedHum: {
		fontSize: 17,
		color: '#fff',
	},
})
