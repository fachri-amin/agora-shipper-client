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

const Pricing = () => {
    const [data, setData] = useState({
        cod: false,
        destination: {
            area_id: 4711,
            lat: "-6.2195686",
            lng: "106.8325872",
            // suburb_id: 482
        },
        for_order: true,
        height: 10,
        item_value: 40000,
        length: 10,
        limit: 10,
        origin: {
            area_id: 4711,
            lat: "-6.2195686",
            lng: "106.8325872",
            // suburb_id: 482
        },
        page: 1,
        sort_by: [
            "final_price"
        ],
        weight: 0.5,
        width: 10
    });
    const [listPrice, setListPrice] = useState([]);
    const [errors, setErrors] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const getPriceList = () => {
        setIsLoading(true)
        axios.post(`${shipperBaseUrl}/v3/pricing/domestic`, 
            data,
            {
                headers: {
                    'X-API-Key': apiKey
                },
            })
            .then(res => {
                setListPrice(res.data.data.pricings)
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

    return (
        <ScrollView style={styles.container}>
            <Text>Lat. Pengirim</Text>
            <TextInput
                placeholder="lat. pengirim"
                onChangeText={text => setData({...data, origin: {...data.origin, lat: text}})}
                style={styles.input}
            />

            <Text style={{marginTop: 20}}>Lng. Pengirim</Text>
            <TextInput
                placeholder="lng. pengirim"
                onChangeText={text => setData({...data, origin: {...data.origin, lng: text}})}
                style={styles.input}
            />

            <Text style={{marginTop: 20}}>Area id Pengirim</Text>
            <TextInput
                placeholder="area id pengirim"
                onChangeText={text => setData({...data, origin: {...data.origin, area_id: text}})}
                style={styles.input}
            />

            <Text style={{marginTop: 20}}>Lat. Tujuan</Text>
            <TextInput
                placeholder="lat. Tujuan"
                onChangeText={text => setData({...data, destination: {...data.destination, lat: text}})}
                style={styles.input}
            />

            <Text style={{marginTop: 20}}>Lng. Tujuan</Text>
            <TextInput
                placeholder="lng. Tujuan"
                onChangeText={text => setData({...data, destination: {...data.destination, lng: text}})}
                style={styles.input}
            />

            <Text style={{marginTop: 20}}>Area id Tujuan</Text>
            <TextInput
                placeholder="area id Tujuan"
                onChangeText={text => setData({...data, destination: {...data.destination, area_id: text}})}
                style={styles.input}
            />

            <Text style={{marginTop: 20}}>Tinggi barang (cm)</Text>
            <TextInput
                placeholder="tinggi barang (cm)"
                onChangeText={text => setData({...data, height: text})}
                style={styles.input}
                keyboardType={"numeric"}
            />

            <Text style={{marginTop: 20}}>Panjang barang (cm)</Text>
            <TextInput
                placeholder="panjang barang (cm)"
                onChangeText={text => setData({...data, length: text})}
                style={styles.input}
                keyboardType={"numeric"}
            />

            <Text style={{marginTop: 20}}>Lebar barang (cm)</Text>
            <TextInput
                placeholder="Lebar barang (cm)"
                onChangeText={text => ssetData({...data, width: text})}
                style={styles.input}
                keyboardType={"numeric"}
            />

            <Text style={{marginTop: 20}}>Berat barang (kg)</Text>
            <TextInput
                placeholder="Berat barang (kg)"
                onChangeText={text => setData({...data, weight: text})}
                style={styles.input}
                keyboardType={"numeric"}
            />

            <Text style={{marginTop: 20}}>Harga barang dalam IDR</Text>
            <TextInput
                placeholder="Harga barang dalam IDR"
                onChangeText={text => setData({...data, item_value: text})}
                style={styles.input}
                keyboardType={"numeric"}
            />
            {errors.map((item) => (
                <Text style={styles.error}>{item}</Text>
            ))}
            <TouchableOpacity
                onPress={getPriceList}
                style={styles.button}
                disabled={isLoading}
            >
                <Text style={styles.buttonText}>{isLoading ? 'Loading...' : 'Lihat Price list'}</Text>
            </TouchableOpacity>
            <View>
                <Text style={{marginTop: 20, fontWeight: '700'}}>Pencarian 10 teratas</Text>
                {listPrice.map((item, index) => (
                    <View style={styles.locationItemContainer}>
                        <Text>{`${index+1}. ${item.logistic.name} - ${item.rate.type}`}</Text>
                        <Text style={{marginLeft: 15}}>{`min-day: ${item.min_day} - max-day: ${item.max_day} - Rp ${item.final_price}`}</Text>
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

export default Pricing;