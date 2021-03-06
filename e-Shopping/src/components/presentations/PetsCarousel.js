import React from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity, ScrollView } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import Icon from '@expo/vector-icons/AntDesign';

import {observer} from 'mobx-react/native';
import {action} from 'mobx';
import globalStore from '../../../GlobalStore';
import axios from 'axios';

@observer
class PetsCarousel extends React.Component {
  _renderItem = ({item, index}) => {
    let stockInfo;
    if (item.count > 10) {
      stockInfo = <Text style={[styles.text,{color: 'green'}]}>In Stock</Text>
    } else if (item.count > 0) {
      stockInfo = <Text style={[styles.text,{color: 'red'}]}>Only {item.count} Left In Stock</Text>
    } else {
      stockInfo = <Text style={[styles.text,{color: '#000'}]}>Out Of Stock</Text>
    }

    return (
        <View style={styles.item}>
            <View style={styles.shadow}>
              <Image source={{uri: item.img}} style={styles.img}/>
            </View>
            <Text style={styles.text}>Price: ${(item.price / 100).toFixed(2)}</Text>
            <Text style={[styles.text, {fontFamily: 'Chalkboard SE',fontWeight: "600",}]}>{item.name}</Text>
            <View style={{height: 100, width: 280}}>
              <ScrollView>
                <Text style={{color: '#0E4375'}}>{item.desc}</Text>
              </ScrollView>
            </View>
            {stockInfo}
            <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 10}}>
                <TouchableOpacity onPress={this.navigateToShoppingCart}>
                    <Icon
                        color="#0E4375"
                        name="pay-circle-o1"
                        size={30}
                        style={{marginRight: 50}} 
                    />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => this.addToCart(item)}>
                    <Icon
                        color="#0E4375"
                        name="shoppingcart"
                        size={30}
                    />
                </TouchableOpacity>  
            </View>   
        </View>
    );
  }

  updatePet = (pet) => {
    globalStore.addPet(pet);
    switch (pet.category) {
      case "Aquarium":
        globalStore.updateAquariumCount(1, pet._id);
        break;
      case "Bird":
        globalStore.updateBirdCount(1, pet._id);
        break;
      case "Fluffy":
        globalStore.updateFluffyCount(1, pet._id);
        break;
      case "Reptile":
        globalStore.updateReptileCount(1, pet._id);
        break;
    }
    alert("Add to Cart!");
  }

  addToCart = (pet) => {
    const userID = globalStore.user._id;
    if (pet.count === 0) {
      alert("This pet is out of stock! Please check back later! Thank you!");
      return;
    }

    if (globalStore.pets.filter(item => item._id === pet._id).length) {
      alert("This Pet is already in your shopping cart!");
      return;
    }

    axios
      .put(`http://192.168.0.107:5000/carts/?userID=${userID}&petID=${pet._id}`)
      .then(action(result => {
        if (result.data.ok) {
          // If no exist pending cartID, create one and update cartID here
          if (!globalStore.cart._id) {
            axios
            .get(`http://192.168.0.107:5000/carts/?userID=${userID}`)
            .then(action(result => {
              const cart = {
                status: '',
                _id: '',
              };
              
              cart._id = result.data._id;
              cart.status = result.data.status;
              globalStore.initCart(cart);  
            }))
            .catch(err => console.log("Error when init cartID and Add Pet: " + err));
          }
          this.updatePet(pet);   
        }
      }))
      .catch(err => console.log("Add Pets To Cart Error: " + err));
  }

  navigateToShoppingCart = () => {
    globalStore.togglepetsCarousleVisibility();
    this.props.navigate("Cart");  
  }

  render() {
    return (
        <View style={[styles.container, {backgroundColor: this.props.color}]}>
            <Icon
                color="#fff"
                name="back"
                size={30}
                style={{marginLeft: 250, marginTop: 10, marginBottom: 20}}
                onPress={() => this.props.onToggle()} 
            />
            <Carousel
                ref={(c) => { this._carousel = c; }}
                data={this.props.data}
                renderItem={this._renderItem}
                sliderWidth={300}
                sliderHeight={420}
                itemWidth={300}
                itemHeight={420}
                enableMomentum={false}
                lockScrollWhileSnapping={true}
                enableSnap={true}
                layout={'stack'}
                firstItem={this.props.idx}
                loop={true}
            />
        </View>
    );
  }
}

export default PetsCarousel;

const styles = StyleSheet.create({
  container: {
    width: 320,
    height: 500,
    backgroundColor: 'gray',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10, 
  },
  item: {
    width: 300,
    height: 420,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius:  5,
  },
  img: {
    width: 240, 
    height: 180, 
    borderRadius: 5,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {width: 1, height: 1},
    shadowOpacity: 1,
    shadowRadius: 2,
  },
  text: {
    color: '#0E4375',
    width: 280,
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 5,
  }
});