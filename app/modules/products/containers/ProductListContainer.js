import React, { Component } from "react";
import { View, Text, Alert, FlatList, TouchableOpacity, Image, StyleSheet, ScrollView, Dimensions, ToastAndroid, TextInput } from "react-native";
import Spinner from 'react-native-loading-spinner-overlay';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';

import {PRODUCTS_API, PRODUCTS_FILTER_CATEGORY, IMAGE_PREFIX, IMAGE_SUFFIX, WIDTH, HEIGHT} from '../../../configuration';
import FlatListBody from '../components/FlatListBody';

var data = [];
export default class ProductListContainer extends Component {
	// _fetchProducts = async () => {
	// 	await this.props.fetchProducts();
	// };
  constructor(props){
    super(props);
    const { params } = this.props.navigation.state;
    this.state ={
      token:params.token,
      cart:[],
      data:[],
      visible:false,
      visible2:false,
      limit:10,
      offset:0,
      total:1,
      toastFlag:true,
      textFlag:false,
      text:''
    }
  }

  _menu = null;

  setMenuRef = ref => {
    this._menu = ref;
  };

  _asc = () => {
    let data = this.state.data;
    // console.warn(parseFloat(data[0].meta.display_price.with_tax.amount))
    data.sort(function(a, b) {
    return parseFloat(a.price[0].amount) - parseFloat(b.price[0].amount);
    });
    this.setState({
      data:data
    });
    // console.warn(data)
    this._menu.hide();
  };

  _desc = () => {
    let data = this.state.data;
    data.sort(function(a, b) {
    return parseFloat(b.price[0].amount) - parseFloat(a.price[0].amount);
    });
    this.setState({
      data:data
    });
    // console.warn(data)
    this._menu.hide();
  };

  showMenu = () => {
    this._menu.show();
  };

  componentWillMount(){
    this._setData()
  }

  _setData = async() => {
    this.setState({
      visible:true
    });
    let offset = this.state.offset+1;

    let url = PRODUCTS_API+'?page[limit]='+this.state.limit+'&page[offset]='+offset;

    if(offset>this.state.total && this.state.toastFlag){
        ToastAndroid.showWithGravity(
        'No More Items',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
      this.setState({
        toastFlag:false,
        visible:false
      })
    }else{
      await fetch(url,{
        method: 'get',
          headers: {
              'Accept': 'application/json, text/plain, */*',
              'Authorization':this.state.token

          }
      })
      .then((response) => response.json())
      .then((responseData) => {
        this.setState({
          data:[...this.state.data,...responseData.data],
          visible:false,
          total:responseData.meta.page.total,
          offset:responseData.meta.page.offset
        })
        // console.warn(responseData.meta.page.total)
      }).catch((error) => {
          this.setState({
            visible:false
          })
          Alert.alert("Caution!","Please check your internet connection!");
        })
      .done();
    }

  }
  _filterCategory = async() => {
    this.setState({
      visible:true,
      textFlag:true,
      cart:[]
    })
    let url = PRODUCTS_FILTER_CATEGORY+this.state.text+')';
    // console.warn(url)
    await fetch(url,{
      method: 'get',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Authorization':this.state.token

        }
    })
    .then((response) => response.json())
    .then((responseData) => {
      this.setState({
        data:responseData.data,
        visible:false,
      })
      // console.warn(responseData.meta.page.total)
    }).catch((error) => {
        this.setState({
          visible:false
        })
        Alert.alert("Caution!","Please check your internet connection!");
      })
    .done();
  }

  logout = () =>{
    const {navigate} = this.props.navigation;
    navigate('Login')
  }

  refresh = () =>{
    this.setState({
      offset:0,
      total:1,
      textFlag:false,
      toastFlag:true
    })
    this._setData()

  }

  addToCart = (index) => {
    let cart = this.state.cart;
    cart.push(this.state.data[index]);
    this.setState({
      cart:cart
    });
    ToastAndroid.showWithGravity(
    'Added To Cart',
    ToastAndroid.SHORT,
    ToastAndroid.BOTTOM
  );
    // console.warn(cart)
  }
  showCart = () => {
    let text = '';
    for(let i = 0 ; i < this.state.cart.length ; i++){
      text+=this.state.cart[i].sku+"   ";
    }
      Alert.alert("Showing Cart (for lack of time Only showing the SKU value)",text);
  }


	render() {
		return (
      <View style={{flex:1,backgroundColor:'rgba(0,0,0,.2)'}}>
        <View style={s.header}>
          <Menu
          ref={this.setMenuRef}
          button={<Text style={{margin:5,}} onPress={this.showMenu}>Sort By Price</Text>}
          >
            <MenuItem onPress={this._asc}>Asc</MenuItem>
            <MenuDivider />
            <MenuItem onPress={this._desc}>Desc</MenuItem>
          </Menu>
          <View style={{flexDirection:'row',alignItems:'center'}}>
            <TextInput
              style={{flex:.3,borderColor: 'gray', borderWidth: 1,padding:5}}
              placeholder="Enter Category ID"
              onChangeText={(text) => this.setState({text})}
              value={this.state.text}
            />
            <TouchableOpacity style={{margin:5}} onPress={() => this._filterCategory()}>
              <Text>Go</Text>
            </TouchableOpacity>
          </View>
          <Text style={{padding:5}} onPress={this.refresh}>Refresh</Text>

          <Text style={{padding:5}} onPress={this.logout}>Logout</Text>
        </View>
        <View style={{flexDirection:'row',alignItems:'center',justifyContent: 'space-between',marginLeft:10,marginRight:10,marginTop:5}}>
          {this.state.textFlag?<Text style={{textAlign:'center',color:'green'}}>Filtering on CategoryID - {this.state.text}</Text>:<Text style={{textAlign:'center',color:'green'}}>Loaded {this.state.offset} pages out of {this.state.total} pages</Text>}
          <TouchableOpacity onPress={() => this.showCart()}>
            <Image style={{height:20,width:20}} source={require('../assets/cart.png')}/>
          </TouchableOpacity>
        </View>
        <ScrollView style={s.container}
          onScroll={(e)=>{
                              height = e.nativeEvent.contentSize.height,
                              offset = e.nativeEvent.contentOffset.y;
                          if( HEIGHT + offset >= height ){
                              this._setData()
                          }
                      }}
        >
          <Spinner
            visible={this.state.visible}
            textContent={"Loading..."}
            textStyle={s.spinner}
            animation={'fade'}
            size={'small'}
            cancelable={true}
            color={'#3B5998'}
          />
            <FlatList
              contentContainerStyle={{margin:5}}
              data={this.state.data}
              keyExtractor={(item,index) => index.toString()}
              renderItem={({ item,index }) => (
                  <View style={{margin:5,backgroundColor:'white'}}>
                    <FlatListBody
                      item={item}
                      />
                    <View style={s.flatListFooter}>
                      <Text style={s.flatListFooterText}>{item.name}</Text>
                    </View>
                    <TouchableOpacity style={s.flatListFooter2} onPress={() => this.addToCart(index)}>
                      <Image style={{height:20,width:20}} source={require('../assets/cart.png')}/>
                    </TouchableOpacity>

                  </View>
              )}
            />
        </ScrollView>
      </View>
    );
	}
}

const s = StyleSheet.create({
  container:{
    flex:.9,
    // backgroundColor:'rgba(0,0,0,.2)'
  },
  header:{
    // height:50,
    flex:.1,
    flexDirection:'row',
    alignItems:'center',
    justifyContent: 'space-between',
    backgroundColor:'#3B5998',
    // position:'absolute',
    // bottom:0
  },
  spinner:{
    color: '#3B5998',
    fontSize:12,
    paddingTop:30
  },
  flatListFooter:{
    // borderTopWidth: 1,
    backgroundColor:'rgba(0,0,0,.8)',
    borderColor:'rgba(0,0,0,.2)'
  },
  flatListFooter2:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderColor:'rgba(0,0,0,.2)'
  },
  flatListFooterText:{
    padding:5,
    textAlign:'center',
    color:'white'
  }
})
