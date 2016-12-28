
'use strict';

import React, { Component } from 'react';
import{
    StyleSheet,
    View,
    Image,
    ScrollView,
    Dimensions,
    TouchableOpacity,
    Text,
  } from 'react-native';
import ImpactLeagueData from './ImpactLeagueData';
import commonStyles from '../../components/styles';
import Icon from 'react-native-vector-icons/Ionicons';
var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;
class ImpactLeague extends Component {
  
      navigateTOhome(){
        this.props.navigator.push({
          title: 'Gps',
          id:'tab',
          navigator: this.props.navigator,
        })
      }

  		render() {
  		  return (
          <View>
            <View style={}>
              <Text style={}>ImpactLeagues</Text>
            </View>
          </View>
  			);
  	  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f2f2f2',
    height:deviceHeight,
    width:deviceWidth,
    bottom:-45,
    marginTop:-45,
  },
  
});
 export default ImpactLeagueCode;