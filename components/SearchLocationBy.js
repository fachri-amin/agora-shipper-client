import React, {useState, useEffect} from 'react';
import {
    Text,
    View,
    TextInput,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Touchable,
} from 'react-native';
import axios from 'axios';
import {shipperBaseUrl, apiKey} from '../utils';

const SearchLocationBy = () => {
    const [countryId, setCountryId] = useState(228);
    const [provinceId, setProvinceId] = useState();
    const [provinceName, setProvinceName] = useState();
    const [cityId, setCityId] = useState();
    const [cityName, setCityName] = useState();
    const [suburbId, setSuburbId] = useState();
    const [suburbName, setSuburbName] = useState();
    const [listProvince, setListProvince] = useState([]);
    const [listCity, setListCity] = useState([]);
    const [listSuburb, setListSuburb] = useState([]);
    const [listArea, setListArea] = useState([]);
    const [errors, setErrors] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const searchProvinceByCountry = () => {
        setIsLoading(true)
        axios.get(`${shipperBaseUrl}/v3/location/country/${countryId}/provinces?page=1&limit=10`, {
            headers: {
                'X-API-Key': apiKey
            }
        })
            .then(res => {
                setListProvince(res.data.data)
            })
            .catch(err => {
                console.log(err);
                setErrors([...errors, 'terjadi kesalahan'])
                setInterval(() => {
                    setErrors([]);
                }, 3000)
            });
        setIsLoading(false);
    }

    useEffect(() => {
        axios.get(`${shipperBaseUrl}/v3/location/province/${provinceId}/cities?page=1&limit=10`, {
            headers: {
                'X-API-Key': apiKey
            }
        })
            .then(res => {
                setListCity(res.data.data)
            })
            .catch(err => {
                console.log(err);
                setErrors([...errors, 'terjadi kesalahan'])
                setInterval(() => {
                    setErrors([]);
                }, 3000)
            });
    }, [provinceId]);

    useEffect(() => {
        axios.get(`${shipperBaseUrl}/v3/location/city/${cityId}/suburbs?page=1&limit=10`, {
            headers: {
                'X-API-Key': apiKey
            }
        })
            .then(res => {
                setListSuburb(res.data.data)
            })
            .catch(err => {
                console.log(err);
                setErrors([...errors, 'terjadi kesalahan'])
                setInterval(() => {
                    setErrors([]);
                }, 3000)
            });
    }, [cityId]);

    useEffect(() => {
        axios.get(`${shipperBaseUrl}/v3/location/suburb/${suburbId}/areas?page=1&limit=10`, {
            headers: {
                'X-API-Key': apiKey
            }
        })
            .then(res => {
                setListArea(res.data.data)
            })
            .catch(err => {
                console.log(err);
                setErrors([...errors, 'terjadi kesalahan'])
                setInterval(() => {
                    setErrors([]);
                }, 3000)
            });
    }, [suburbId])

    return (
        <ScrollView style={styles.container}>
            <Text>Cari Lokasi</Text>
            <TouchableOpacity
                onPress={searchProvinceByCountry}
                style={styles.button}
                disabled={isLoading}
            >
                <Text style={styles.buttonText}>{isLoading ? 'Loading...' : 'Get provinces in Indonesia'}</Text>
            </TouchableOpacity>
            <View>
                <Text style={{marginTop: 20, fontWeight: '700'}}>10 provinsi teratas di Indonesia</Text>
                {listProvince.map((item, index) => (
                    <TouchableOpacity 
                        onPress={() => {
                            setProvinceId(item.id)
                            setProvinceName(item.name)
                        }}
                        style={styles.locationItemContainer}
                    >
                        <Text>{`${index+1}. ${item.name}`}</Text>
                    </TouchableOpacity>
                ))}
            </View>
            {
                provinceId && (
                    <View>
                        <Text style={{marginTop: 20, fontWeight: '700'}}>10 Cities teratas di {provinceName}</Text>
                        {listCity.map((item, index) => (
                            <TouchableOpacity 
                                onPress={() => {
                                    setCityId(item.id)
                                    setCityName(item.name)
                                }}
                                style={styles.locationItemContainer}
                            >
                                <Text>{`${index+1}. ${item.name}`}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )
            }
            {
                cityId && (
                    <View>
                        <Text style={{marginTop: 20, fontWeight: '700'}}>10 Suburbs teratas di {cityName}</Text>
                        {listSuburb.map((item, index) => (
                            <TouchableOpacity 
                                onPress={() => {
                                    setSuburbId(item.id)
                                    setSuburbName(item.name)
                                }}
                                style={styles.locationItemContainer}
                            >
                                <Text>{`${index+1}. ${item.name}`}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )
            }
            {
                suburbId && (
                    <View>
                        <Text style={{marginTop: 20, fontWeight: '700'}}>10 Area teratas di {suburbName}</Text>
                        {listArea.map((item, index) => (
                            <TouchableOpacity 
                                style={styles.locationItemContainer}
                            >
                                <Text>{`${index+1}. ${item.name}`}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )
            }
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        paddingBottom: 50
    },
    input: {
        borderWidth: 1,
        padding: 10,
        borderRadius: 4,
        marginTop: 10
    },
    error: {
        color: 'red',
        fontSize: 12
    },
    button: {
        backgroundColor: 'blue',
        // width: 100,
        alignSelf: 'flex-start',
        paddingVertical: 10,
        paddingHorizontal: 20,
        textAlign: 'center',
        borderRadius: 4,
        marginTop: 10
    },
    buttonText: {
        color: 'white',
        textAlign: 'center'
    },
    locationItemContainer: {
        borderBottomWidth: 1,
        borderBottomColor: 'grey',
        marginTop: 15,
        paddingVertical: 5
    }
})

export default SearchLocationBy;