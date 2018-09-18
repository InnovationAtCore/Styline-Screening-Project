import React, { Component } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import Spinner from 'react-native-loading-spinner-overlay';

import {CID, CSID, TYPE, AUTH_API} from '../../../configuration';

export default class LoginContainer extends Component {

  constructor(props){
    super(props);
    this.state ={
      visible:false
    }
  }

  _fetchProducts = async () => {
      this.setState({
        visible: !this.state.visible
      });

    const {navigate} = this.props.navigation

    let formData = new FormData();
    formData.append('client_id', CID);
    formData.append('client_secret', CSID);
    formData.append('grant_type', TYPE);

    await fetch(AUTH_API,{
      method: 'POST',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            "Content-Type": "multipart/form-data"
        },
        body: formData
    })
    .then((response) => response.json())
    .then((responseData) => {
      this.setState({
        visible: !this.state.visible
      });
      navigate('Home', { token: responseData.access_token })
    }).catch((error) => {
        this.setState({
          visible: !this.state.visible
        });
        Alert.alert("Caution!","Check your net connection.");
      })
    .done();
	}

	render() {
		return (
      <View style={s.container}>
        <Spinner
          visible={this.state.visible}
          textContent={"Loading..."}
          textStyle={{color: '#3B5998',fontSize:12,paddingTop:30}}
          animation={'fade'}
          size={'small'}
          cancelable={true}
          color={'#3B5998'}
        />

        <TouchableOpacity style={s.loginButton} onPress={() => this._fetchProducts()}>
          <Text style={s.loginText}>Login</Text>
        </TouchableOpacity>
      </View>
    );
	}
}


const s = StyleSheet.create({
  container:{
    flex:1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  loginButton:{
    backgroundColor:'#3B5998',
    borderRadius:5
  },
  loginText:{
    fontSize:20,
    color:'white',
    fontWeight:'bold',
    paddingLeft:20,
    paddingRight:20,
    paddingTop:10,
    paddingBottom:10,
  }
});
