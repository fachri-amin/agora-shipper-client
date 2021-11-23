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
            area_id: 12212,
            lat: "-6.123123123",
            lng: "104.12312312",
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
    const [order, setOrder] = useState();
    const [trackings, setTrackings] = useState();
    const [errors, setErrors] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const getPriceList = () => {
        setOrder(null)
        setTrackings(null)
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
                console.log('berhasil');
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

    const handleSelectRate = (rate_id) => {
        setListPrice([]);

        const dataOrder = {
            consignee: {
                name: "Pengirim",
                phone_number: "62852280038095"
            },
            consigner: {
                name: "Penerima",
                phone_number: "62852280038095"
            },
            courier: {
                cod: false,
                rate_id: rate_id,
                use_insurance: true
            },
            coverage: "domestic",
            destination: {
                address: "Jalan Kenangan",
                area_id: 4711,
                lat: "-6.2195686",
                lng: "106.8325872"
            },
            // external_id: "KRN1231123121",
            origin: {
                address: "Jalan Kenangan",
                area_id: 12212,
                lat: "-6.123123123",
                lng: "104.12312312"
            },
            package: {
                height: 60,
                items: [
                {
                    name: "Baju Baju",
                    price: 120000,
                    qty: 12
                }
                ],
                length: 30,
                package_type: 2,
                price: 122000,
                weight: 1.1231,
                width: 40
            },
            payment_type: "postpay"
        }

        axios.post(`${shipperBaseUrl}/v3/order`, 
            dataOrder,
            {
                headers: {
                    'X-API-Key': apiKey
                },
            })
            .then(res => {
                setOrder(res.data.data)
                console.log('berhasil');
            })
            .catch(err => {
                console.log('error order', err);
                setErrors([...errors, 'terjadi kesalahan'])
                setInterval(() => {
                    setErrors([]);
                }, 3000)
            });
    }

    const handleTracking = (order_id) => {
        axios.get(`${shipperBaseUrl}/v3/order/${order_id}`,
        {
            headers: {
                'X-API-Key': apiKey
            },
            })
            .then(res => {
                setTrackings(res.data.data.trackings)
                console.log('berhasil');
            })
            .catch(err => {
                console.log('error tracking', err);
                setErrors([...errors, 'terjadi kesalahan'])
                setInterval(() => {
                    setErrors([]);
                }, 3000)
            });
    }
    
    const handleDeleteOrder = (order_id) => {
        console.log('order_id for delete', order_id);
        axios.delete(`${shipperBaseUrl}/v3/order/${order_id}`,
        {
            headers: {
                'X-API-Key': apiKey
            },
            data: {
                "reason": "Stok habis"
            }
        }
        )
            .then(res => {
                setOrder(null)
                console.log('berhasil');
                setErrors([...errors, `berhasil delete order ${res.data.data.cancel_order.order_id}`])
            })
            .catch(err => {
                console.log('error delete', err);
                setErrors([...errors, 'terjadi kesalahan'])
                setInterval(() => {
                    setErrors([]);
                }, 3000)
            });
    }

    return (
        <ScrollView style={styles.container}>
            <Text>Lat. Pengirim</Text>
            <TextInput
                value={data.origin.lat}
                placeholder="lat. pengirim"
                onChangeText={text => setData({...data, origin: {...data.origin, lat: text}})}
                style={styles.input}
            />

            <Text style={{marginTop: 20}}>Lng. Pengirim</Text>
            <TextInput
                value={data.origin.lng}
                placeholder="lng. pengirim"
                onChangeText={text => setData({...data, origin: {...data.origin, lng: text}})}
                style={styles.input}
            />

            <Text style={{marginTop: 20}}>Area id Pengirim</Text>
            <TextInput
                value={data.origin.area_id.toString()}
                placeholder="area id pengirim"
                onChangeText={text => setData({...data, origin: {...data.origin, area_id: parseInt(text)}})}
                style={styles.input}
                keyboardType="numeric"
            />

            <Text style={{marginTop: 20}}>Lat. Tujuan</Text>
            <TextInput
                value={data.destination.lat}
                placeholder="lat. Tujuan"
                onChangeText={text => setData({...data, destination: {...data.destination, lat: text}})}
                style={styles.input}
            />

            <Text style={{marginTop: 20}}>Lng. Tujuan</Text>
            <TextInput
                value={data.destination.lng}
                placeholder="lng. Tujuan"
                onChangeText={text => setData({...data, destination: {...data.destination, lng: text}})}
                style={styles.input}
            />

            <Text style={{marginTop: 20}}>Area id Tujuan</Text>
            <TextInput
                value={data.destination.area_id.toString()}
                placeholder="area id Tujuan"
                onChangeText={text => setData({...data, destination: {...data.destination, area_id: parseInt(text)}})}
                style={styles.input}
                keyboardType="numeric"
            />

            <Text style={{marginTop: 20}}>Tinggi barang (cm)</Text>
            <TextInput
                value={data.height.toString()}
                placeholder="tinggi barang (cm)"
                onChangeText={text => setData({...data, height: text})}
                style={styles.input}
                keyboardType={"numeric"}
            />

            <Text style={{marginTop: 20}}>Panjang barang (cm)</Text>
            <TextInput
                value={data.length.toString()}
                placeholder="panjang barang (cm)"
                onChangeText={text => setData({...data, length: text})}
                style={styles.input}
                keyboardType={"numeric"}
            />

            <Text style={{marginTop: 20}}>Lebar barang (cm)</Text>
            <TextInput
                value={data.width.toString()}
                placeholder="Lebar barang (cm)"
                onChangeText={text => ssetData({...data, width: text})}
                style={styles.input}
                keyboardType={"numeric"}
            />

            <Text style={{marginTop: 20}}>Berat barang (kg)</Text>
            <TextInput
                value={data.weight.toString()}
                placeholder="Berat barang (kg)"
                onChangeText={text => setData({...data, weight: text})}
                style={styles.input}
                keyboardType={"numeric"}
            />

            <Text style={{marginTop: 20}}>Harga barang dalam IDR</Text>
            <TextInput
                value={data.item_value.toString()}
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
                {listPrice.length > 0 && (
                    <Text style={{marginTop: 20, fontWeight: '700'}}>Pencarian 10 teratas</Text>
                )}
                {listPrice.map((item, index) => (
                    <TouchableOpacity 
                        style={styles.locationItemContainer} 
                        onPress={() => handleSelectRate(item.rate.id)}
                    >
                        <Text>{`${index+1}. ${item.logistic.name} - ${item.rate.type}`}</Text>
                        <Text style={{marginLeft: 15}}>{`min-day: ${item.min_day} - max-day: ${item.max_day} - Rp ${item.final_price}`}</Text>
                    </TouchableOpacity>
                ))}
                {order && (
                    <View style={{marginTop: 30}}>
                        <Text style={{fontWeight: "700", fontSize: 22}}>Detail Order: </Text>
                        <Text style={styles.locationItemContainer}>
                            Order ID : {order.order_id}
                        </Text>
                        <Text style={styles.locationItemContainer}>
                            Tujuan : {`${order.destination.address}, ${order.destination.area_name}, ${order.destination.city_name}, ${order.destination.province_name}`}
                        </Text>
                        <Text style={styles.locationItemContainer}>
                            Asal : {`${order.origin.address}, ${order.origin.area_name}, ${order.origin.city_name}, ${order.origin.province_name}`}
                        </Text>
                        <Text style={styles.locationItemContainer}>
                            Total ongkir : Rp. {order.courier.amount}
                        </Text>
                        
                        <View style={{flexDirection: "row"}}>
                            <TouchableOpacity
                                onPress={() => handleTracking(order.order_id)}
                                style={styles.button}
                                disabled={isLoading}
                            >
                                <Text style={styles.buttonText}>{isLoading ? 'Loading...' : 'Tracking'}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => handleDeleteOrder(order.order_id)}
                                style={styles.buttonDelete}
                                disabled={isLoading}
                            >
                                <Text style={styles.buttonText}>{isLoading ? 'Loading...' : 'Delete Order'}</Text>
                            </TouchableOpacity>
                        </View>

                        {trackings && (
                            <View style={{marginTop: 30}}>
                                <Text style={{fontWeight: "700", fontSize: 22}}>Tracking Order: </Text>
                                {trackings.map(item => (
                                    <View style={styles.locationItemContainer}>
                                        <Text>
                                            Shipper status : {item.shipper_status.description}
                                        </Text>
                                        <Text>
                                            Logistic status : {item.logistic_status.description}
                                        </Text>
                                        <Text>
                                            Updated at : {item.created_date}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        )}

                    </View>
                )}
                <View style={{height:200}}></View>
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
        marginTop: 10,
    },
    buttonDelete: {
        backgroundColor: 'red',
        alignSelf: 'flex-start',
        paddingVertical: 10,
        paddingHorizontal: 20,
        textAlign: 'center',
        borderRadius: 4,
        marginTop: 10,
        marginLeft: 40
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