
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
import commonStyles from './styles';
import Icon from 'react-native-vector-icons/Ionicons';
var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;
import styleConfig from './styleConfig';
import SubmitBtn from './submitbtn';
import ImpactLeagueDropDown from './dropDownComponent'
class ImpactLeagueForm2 extends Component {
  
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
            <View style={commonStyles.Navbar}>
              <Text style={commonStyles.menuTitle}>ImpactLeagues</Text>
            </View>
            <View style ={styles.container}>
              <Image source={require('../images/login_background.png')} style={styles.bannerimage}>
              </Image>
              <Text style={{padding:20, paddingTop:25,color:styleConfig.purplish_brown,fontFamily:styleConfig.FontFamily,fontSize:styleConfig.fontSizer3}}>Just a couple of more questions</Text>
              <View>
              <ImpactLeagueDropDown style = {{top:100,position:'absolute'}}/>
              <ImpactLeagueDropDown style = {{top:-100,position:'absolute'}}/>

              <TouchableOpacity onPress={() => this.Navigate_To_nextpage()} style={styles.submitbtn}>
                  <Text style={{color:'white'}}>SUBMIT</Text>
              </TouchableOpacity>
              </View>
            </View>
          </View>
  			);
  	  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f2f2f2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerimage:{
    height:deviceHeight/2-100,
  },
  submitbtn:{
    position:'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width:deviceWidth-70,
    height:45,
    borderRadius:2,
    shadowColor: '#000000',
    shadowOpacity: 0.2,
    shadowRadius: 2,
    shadowOffset: {
        height: 2,
      },
    backgroundColor:styleConfig.light_gold,
  },
});
 export default ImpactLeagueForm2;