import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {useNavigation} from '@react-navigation/native';
import MapView, {Marker} from 'react-native-maps';
import {SvgUri} from 'react-native-svg';
import Geolocation from '@react-native-community/geolocation';
import api from '../../services/api';

import ImageOrSvg from '../../components/ImageOrSvg';

const STATUS_BAR_HEIGHT = StatusBar.currentHeight || 0;

// import { Container } from './styles';

interface Item {
  id: number;
  image: string;
  title: string;
}

interface CoordsType {
  coords: {
    latitude: number;
    longitude: number;
  };
}

interface Point {
  name: string;
  id: number;
  image: string;
  latitude: string;
  longitude: string;
}

interface Props {
  route: any;
}

const Points: React.FC<Props> = ({route}) => {
  const [items, setItems] = useState<Item[]>([]);
  const [currentPosition, setCurrentPosition] = useState<CoordsType>({
    coords: {
      latitude: 0,
      longitude: 0,
    },
  });
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [selectedItemsString, setSelectedItemsString] = useState<string>(
    '1,2,3,4,5,6',
  );
  const [points, setPoints] = useState<Point[]>([]);
  const [enableSearchByItems, setEnableSearchByItems] = useState<boolean>(
    false,
  );

  useEffect(() => {
    fetchItems();
    fetchPoints();
  }, []);

  useEffect(() => {
    if (enableSearchByItems) {
      fetchSearchedPoints();
    } else {
      setEnableSearchByItems(true);
    }
  }, [selectedItems]);

  const fetchItems = async () => {
    const response = await api.get('/items');
    setItems(response.data.items);
  };

  const fetchPoints = async () => {
    const response = await api.get('/points', {
      params: {
        city: route?.params?.city,
        items: selectedItemsString || '1,2,3,4,5,6',
        uf: route?.params?.uf,
      },
    });
    setPoints(response.data);
    getCurrentGeolocation();
  };

  const includeSelectedItem = (id: number) => {
    if (selectedItems.includes(id)) {
      const filtered = selectedItems.filter((item) => item !== id);
      setSelectedItems(filtered);
    } else {
      const placeholderSelectedItems = selectedItems;
      setSelectedItems(placeholderSelectedItems.concat(id));
    }
  };

  const getCurrentGeolocation = async () => {
    Geolocation.getCurrentPosition((info) => {
      const {latitude, longitude} = info.coords;
      setCurrentPosition({
        coords: {
          latitude,
          longitude,
        },
      });
    });
  };

  const navigation = useNavigation();

  const handleBackPage = () => {
    navigation.goBack();
  };

  const navigateToDetailPage = (id: number) => {
    navigation.navigate('Details', {id: 1});
  };

  const fetchSearchedPoints = async () => {
    const searchItemsTerm = selectedItems.map((item) => item).join(',');
    const response = await api.get('/points', {
      params: {
        city: 'São João Nepomuceno',
        items: searchItemsTerm || '1,2,3,4,5,6',
        uf: 'MG',
      },
    });
    setPoints(response.data);
  };

  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity onPress={handleBackPage}>
          <Icon name="arrow-left" size={20} color="#34cb79"></Icon>
        </TouchableOpacity>

        <Text style={styles.title}>Bem vindo.</Text>
        <Text style={styles.description}>
          Encontre no mapa um ponto de coleta
        </Text>

        <View style={styles.mapContainer}>
          {currentPosition.coords.latitude != 0 && (
            <MapView
              initialRegion={{
                latitude: currentPosition.coords.latitude,
                longitude: currentPosition.coords.longitude,
                latitudeDelta: 0.014,
                longitudeDelta: 0.014,
              }}
              style={styles.map}>
              <Marker
                coordinate={{
                  latitude: currentPosition.coords.latitude,
                  longitude: currentPosition.coords.longitude,
                }}
              />
              {points.map((point) => (
                <Marker
                  onPress={() => navigateToDetailPage(point.id)}
                  key={point.id}
                  coordinate={{
                    latitude: parseFloat(point.latitude),
                    longitude: parseFloat(point.longitude),
                  }}>
                  <View style={styles.mapMarkerContainer}>
                    <Image
                      style={styles.mapMarkerImage}
                      source={{
                        uri: `http://192.168.1.4:3333/files/${point.image}`,
                      }}></Image>
                    <Text style={styles.mapMarkerTitle}>{point.name}</Text>
                  </View>
                </Marker>
              ))}
            </MapView>
          )}
        </View>
      </View>
      <View style={styles.itemsContainer}>
        <ScrollView horizontal>
          {items.map((item) => (
            <TouchableOpacity
              onPress={() => includeSelectedItem(item.id)}
              key={item.id}
              style={[
                styles.item,
                selectedItems.includes(item.id) ? styles.selectedItem : null,
              ]}>
              <SvgUri
                width={42}
                height={42}
                uri={`http://192.168.1.4:3333/files/${item.image}`}
              />
              <Text style={styles.itemTitle}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 20 + STATUS_BAR_HEIGHT,
  },

  title: {
    fontSize: 20,
    fontFamily: 'UbuntuBold',
    marginTop: 24,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 4,
    fontFamily: 'Roboto-Regular',
  },

  mapContainer: {
    flex: 1,
    width: '100%',
    borderRadius: 10,
    height: 400,
    overflow: 'hidden',
    marginTop: 16,
  },

  map: {
    width: '100%',
    height: '100%',
  },

  mapMarker: {
    width: 90,
    height: 80,
  },

  mapMarkerContainer: {
    width: 90,
    height: 70,
    backgroundColor: '#34CB79',
    flexDirection: 'column',
    borderRadius: 8,
    overflow: 'hidden',
    alignItems: 'center',
  },

  mapMarkerImage: {
    width: 90,
    height: 45,
    resizeMode: 'cover',
  },

  mapMarkerTitle: {
    flex: 1,
    fontFamily: 'RobotoRegular',
    color: '#FFF',
    fontSize: 13,
    lineHeight: 23,
  },

  itemsContainer: {
    flexDirection: 'row',
    marginTop: 16,
    marginBottom: 32,
  },

  item: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#eee',
    height: 120,
    width: 120,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'space-between',

    textAlign: 'center',
  },

  selectedItem: {
    borderColor: '#34CB79',
    borderWidth: 2,
  },

  itemTitle: {
    fontFamily: 'RobotoRegular',
    textAlign: 'center',
    fontSize: 13,
  },
});

export default Points;
