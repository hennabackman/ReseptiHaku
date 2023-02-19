import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Image, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { API_TOKEN } from '@env';

export default function App() {
  const [rates, setRates] = useState({});
  const [selected, setSelected] = useState('');
  const [amount, setAmount] = useState('');
  const [eur, setEur] = useState('');

  const getData = async () => {
    const url = 'https://api.apilayer.com/exchangerates_data/latest';
    const options = {
      headers: {
        apikey: API_TOKEN
      }
    };
    try {
      const response = await fetch(url, options);
      const currencyData = await response.json();
      console.log(currencyData.rates);
      setRates(currencyData.rates);
    } catch (e) {
      Alert.alert('Error fetching data');
    }
  }

useEffect (() => { getData() }, []);

  const convert = () => {
    const amountEur = Number(amount) / rates[selected];
    setEur(`${amountEur.toFixed(2)}€`);
  }

  return (
    <View style={styles.container}>
      <Text style={{ ...styles.valuerow, ...styles.text }}>{eur}</Text>
      <View style={styles.inputrow}>
        <TextInput
          style={styles.text}
          placeholder={'Amount'}
          keyboardType='numeric'
          value={amount}
          onChangeText={(text) => setAmount(text)}
        />
        <Picker
          style={{ height: 50, width: 100 }}
          selectedValue={selected}
          onValueChange={(itemValue, itemIndex) => {
            console.log(itemValue, itemIndex);
            setSelected(itemValue);
          }}
        >
          {Object.keys(rates).sort().map(key => (<Picker.Item label={key} value={key} key={key}/>))}
          </Picker>
      </View>
      <Button
        title='Convert'
        onPress={convert}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    marginTop: 40,
  },
});
