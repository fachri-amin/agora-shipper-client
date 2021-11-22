import React, {useState, useEffect} from 'react';
import {
    Text,
    View,
    TextInput,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import axios from 'axios';
import {shipperBaseUrl, apiKey} from '../utils';

const SearchLocation = () => {
    const [locationKeyword, setLocationKeyword] = useState('');
    const [listLocation, setListLocation] = useState([]);
    const [errors, setErrors] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const searchLocation = () => {
        setIsLoading(true)
        if(locationKeyword.length > 3) {
            axios.get(`${shipperBaseUrl}/v3/location?adm_level=5&keyword=${locationKeyword}`, {
                headers: {
                    'X-API-Key': apiKey
                }
            })
                .then(res => {
                    setListLocation(res.data.data.slice(0, 10))
                })
                .catch(err => {
                    console.log(err);
                });
        } else {
            setErrors([...errors, 'pencarian lokasi memerlukan minimal 3 huruf'])
            setInterval(() => {
                setErrors([]);
            }, 3000)
        }
        setIsLoading(false);
    }

    return (
        <ScrollView style={styles.container}>
            <Text>Cari Lokasi</Text>
            <TextInput
                placeholder="cari lokasi"
                onChangeText={text => setLocationKeyword(text)}
                style={styles.input}
            />
            {errors.map((item) => (
                <Text style={styles.error}>{item}</Text>
            ))}
            <TouchableOpacity
                onPress={searchLocation}
                style={styles.button}
                disabled={isLoading}
            >
                <Text style={styles.buttonText}>{isLoading ? 'Loading...' : 'Cari'}</Text>
            </TouchableOpacity>
            <View>
                <Text style={{marginTop: 20, fontWeight: '700'}}>Pencarian 10 teratas</Text>
                {listLocation.map((item, index) => (
                    <View style={styles.locationItemContainer}>
                        <Text>{`${index+1}. ${item.display_txt}`}</Text>
                    </View>
                ))}
            </View>
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
        width: 100,
        paddingVertical: 10,
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

export default SearchLocation;