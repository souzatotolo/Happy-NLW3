import React, { useState} from 'react';
import {} from 'react-native';
import { StyleSheet, Text, View, Dimensions } from 'react-native'; 
import MapView, {Marker, Callout} from 'react-native-maps'
import mapMarker from '../images/map-marker.png';
import {Feather} from '@expo/vector-icons'
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import {StatusBar} from 'expo-status-bar'
import { RectButton } from 'react-native-gesture-handler';
import api from '../services/api';

interface Orphanage {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
}



export default function OrphanagesMap(){
  const [orphanages, setOrphanages] = useState<Orphanage[]>([]);
  const navigation = useNavigation();

  useFocusEffect(()=>{
    api.get('orphanages').then(response => {
      setOrphanages(response.data);
    })
  },);

  
  function handleNavigateToOrphanageDetails(id: number) {
    navigation.navigate('OrphanageDetails', {id})
  }

  function handleNavigateToCreateOrphanage() {
    navigation.navigate('SelectMapPosition')
  }

  return (
    <View style={styles.container}>
      <StatusBar style='dark'/>
    <MapView
    style={styles.map}
    initialRegion={{
      latitude: -23.6719415,
      longitude: -46.4594758,
      latitudeDelta: 0.020,
      longitudeDelta: 0.020,
    }}
    >
      {orphanages.map(orphanage => {
        return (
          <Marker 
            key={orphanage.id}
            icon={mapMarker}
            calloutAnchor={{
              x: 2.6,
              y: 0.9,
            }}
      coordinate={{
        latitude: orphanage.latitude,
        longitude: orphanage.longitude,
      }}
      >
        <Callout tooltip={true} onPress={() => handleNavigateToOrphanageDetails(orphanage.id)}>
          <View style={styles.calloutContainer}>
            <Text style={styles.calloutText}>{orphanage.name}</Text>
          </View>
          
        </Callout>
      </Marker>
        );
      })}
    </MapView>
    <View style={styles.footer}>
      <Text style={styles.footerText}> {`${orphanages.length} orfanatos encontrados`} </Text>

      <RectButton style={styles.createOrphanageButton} onPress={handleNavigateToCreateOrphanage}>
        <Feather name="plus" size={20} color="#FFF"/>
      </RectButton>
    </View>
  </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    flex: 1,
  },
  calloutContainer:{
    width: 160,
    height: 56,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255,255, 255, .9)',
    borderRadius: 16,
    justifyContent: 'center',
  },
  calloutText:{
    color:'#0089a5',
    fontSize: 15,
    fontFamily: 'Nunito_700Bold',
  },
  footer:{
    position: 'absolute',
    left: 24,
    right: 24,
    bottom: 32,
    
    backgroundColor: '#FFF',
    borderRadius: 20,
    height: 56,
    paddingLeft: 24,

    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    elevation: 3,
  },
  footerText:{
    color: '#8FA7B3',
    fontFamily: 'Nunito_700Bold',
  },
  createOrphanageButton:{
    width: 56,
    height: 56,
    backgroundColor: '#15C3D6',
    borderRadius: 20,

    justifyContent: 'center',
    alignItems: 'center',
  },

});
