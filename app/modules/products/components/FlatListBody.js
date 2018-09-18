import React, { Component } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { IMAGE_PREFIX, IMAGE_SUFFIX, WIDTH } from '../../../configuration';

export default class FlatListBody extends Component{

  render(){
    const {item} = this.props
    return(
        <View style={s.body}>
          <Image
            style={s.bodyImage}
            source={{uri: item.relationships.files.data.length>0?IMAGE_PREFIX+item.relationships.files.data[0].id+IMAGE_SUFFIX:'https://image.ibb.co/iArB6e/no_image_icon_21.png'}}
          />
          <View style={s.bodyView}>
            <Text style={s.bodyViewText}>Category : <Text style={s.bodyViewText2}>{item.type}</Text></Text>
            <Text style={s.bodyViewText}>Sku : <Text style={s.bodyViewText2}>{item.sku}</Text></Text>
            <Text style={s.bodyViewText}>Price : <Text style={s.bodyViewText2}>{item.price[0].amount}</Text></Text>
            <Text style={s.bodyViewText}>Stock : <Text style={s.bodyViewText2}>{item.meta.stock.level}</Text></Text>
          </View>
        </View>
      )
    }
}


const s = StyleSheet.create({
  body:{
    flexDirection:'row',
    alignItems:'center',
    // justifyContent: 'space-between'
  },
  bodyImage:{
    margin:5,
    width: WIDTH/3,
    height: WIDTH/3,
    borderWidth:1,
    borderColor:'rgba(0,0,0,.2)',
    borderRadius:100
  },
  bodyView:{
    marginLeft:30,
    marginRight:10
  },
  bodyViewText:{
    fontWeight:'bold'
  },
  bodyViewText2:{
    fontWeight:'normal',
    color:'red'
  }

})
