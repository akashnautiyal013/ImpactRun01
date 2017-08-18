  import React, { Component } from 'react';
  import {
    StyleSheet,
    Text,
    View,
    ListView,
    Image,
    ScrollView,
    Dimensions,
    TextInput,
    TouchableOpacity,
    AlertIOS,
    VibrationIOS,
    NetInfo,
    RefreshControl,
    AsyncStorage,
  } from 'react-native';
  import Icon from 'react-native-vector-icons/Ionicons';
  import dismissKeyboard from 'react-native/Libraries/Utilities/dismissKeyboard';
  import LodingScreen from '../LodingScreen';
  import apis from '../apis';
  import BackgroundFetch from "react-native-background-fetch";
  import styleConfig from '../styleConfig'
var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;
var iphone5 = 568;
var iphone5s = 568;
var iphone6 = 667;
var iphone6s = 667;
var iphone7 = 667;
var iphone6Plus = 736;
var iphone6SPlus = 736;
var iphone7Plus = 736;

class LeaderboardData extends Component {
  
      constructor(props) {
        super(props);
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
          LeaderBoard: ds.cloneWithRows([]),
          responce:null,
          userCount: 0,
          loaded:false,
          myindex:null,
          refreshing:false,
          downrefresh:true,
        };
        console.log("blah",this.props.value);

        this.renderRow = this.renderRow.bind(this);
      }
     
     
      navigateTOhome(){
        this.props.navigator.push({
          title: 'Gps',
          id:'tab',
          navigator: this.props.navigator,
        })
      }


      componentDidMount() {  
        console.log('commingdata',this.props.LeaderBoardResult);
        setTimeout(() => {this.setState({downrefresh: false})}, 1000)
        this.setState({
          LeaderBoard: this.state.LeaderBoard.cloneWithRows(this.props.LeaderBoardResult),
          loaded:true,
        })
      
      }
      



      _onRefresh() {
        this.setState({refreshing: true});
        this.fetchLeaderBoard();
      }
     
      borderBottomWidth(){
        if (Dimensions.get('window').height === iphone6) {
         return  0.8
        }else if (Dimensions.get('window').height === iphone5){
          return  0.5
        }
        else if (Dimensions.get('window').height === iphone6SPlus){
          return  1
        }
        else if (Dimensions.get('window').height < iphone5){
          return  0.5
        }
      }

      renderRow(rowData, index,rowID){
        rowID++       
        var myflex = (this.props.user.user_id === rowData.user_id)?1:0;
        // console.log('rodatacount',this.state.userCount,this.state.responce);
        var textColor = (this.props.user.user_id === rowData.user_id)?"white":"#4a4a4a";
        var backgroundcolor=(this.props.user.user_id === rowData.user_id)?'#ffcd4d':"white";
        var myposition = (this.props.user.user_id === rowData.user_id)?'absolute':'relative';
        var mytop = (this.props.user.user_id === rowData.user_id)?-100:0;
        var visiblity = (this.props.user.user_id === rowData.user_id)?0:1;
        let style = [
          styles.row, 
          {
            'alignItems': 'center',
            'justifyContent': 'center',
            'alignItems': 'center',
          }
        ];
        return (
          <View  style={[styles.cardLeaderBoard,{backgroundColor:backgroundcolor,borderBottomWidth:this.borderBottomWidth()}]}>
           <View style={styles.flexbox1}>
            <View style={style}>
              <Text style={{fontFamily: 'Montserrat-Regular',fontWeight:'400',fontSize:styleConfig.fontSizer4,color:textColor,}}>{rowData.ranking}</Text>
            </View>
           </View>
            <View style={styles.flexbox}>
            <Image style={styles.thumb} source={{uri:rowData.social_thumb}}></Image>
            </View>
            <View style={styles.flexbox2}>
            <Text style={[styles.txt,{color:textColor}]}>{rowData.first_name} {rowData.last_name}</Text>
            </View >
            <View style={styles.flexbox3}>
            <Text style={[styles.txtSec,{color:textColor}]}>{parseFloat(rowData.distance).toFixed(0)} Km</Text>
            </View>
          </View>
        );
      }

      renderLoadingView() {
        return (
          <View style={{top:-8,height:deviceHeight-150, width:deviceWidth,}}>
            <LodingScreen />
          </View>
        );
      }

      render() {
        if (this.state.loaded) {
        return (
          <View style={{height:deviceHeight,width:deviceWidth}}>
            <View style={{backgroundColor:'white',height:deviceHeight-100,width:deviceWidth,paddingBottom:53}}>
            {this.swwipeDowntoRefress()}
               <ListView
                style={styles.container}
                renderRow={this.renderRow}
                refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this._onRefresh.bind(this)}
                />}
                dataSource={this.state.LeaderBoard}/>
             </View>
            
          </View> 
        );
      }else{
        return this.renderLoadingView();
      }
      }



      swwipeDowntoRefress(){
        if (this.state.downrefresh === true) {
          return(
            <View style={styles.swipedown}><Text style={styles.txt3}>Pull down to refresh</Text></View>
            )
        }else{
          return;
        }
      }



}

  

const styles = StyleSheet.create({

  thumb: {
    height:styleConfig.navBarHeight-30,
    width:styleConfig.navBarHeight-30,
    borderRadius:(styleConfig.navBarHeight-30)/2,
    backgroundColor:'#ffcd4d',
    borderColor:'#ccc',
    borderWidth:2,
  },
  separator: {
      height: 1,
      backgroundColor: '#CCC'
    },
  cardLeaderBoard:{
    alignItems: 'center',
    flexDirection:'row',
    padding:10,
    width:deviceWidth,
    
    borderColor:'#CCC',
  },
  txt: {
    fontSize:styleConfig.fontSizerleaderBoardContent+2,
    fontWeight:'600',
    textAlign: 'left',
    marginLeft:10,
    fontFamily: 'Montserrat-Regular',
  },
  txtSec:{
   color:styleConfig.warm_grey_three,
   fontSize:styleConfig.fontSizerleaderBoardContent+2,
   fontWeight:'400',
   fontFamily: 'Montserrat-Regular',
  },
  txtSec2:{
   color:'black',
   fontSize:styleConfig.fontSizerleaderBoardContent+2,
   fontWeight:'600',
   fontFamily: 'Montserrat-Regular',
  },
  mycardLeaderBoard:{
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection:'row',
    height:60,
    width:deviceWidth,
    top:-20,
    backgroundColor:'#ffcd4d'
  },
  flexbox:{
    alignItems: 'center',
    justifyContent: 'center',
  },
  flexbox3:{
    height:50,
    flex:1,
    alignItems: 'center',
    justifyContent: 'center',

  },
  flexbox2:{
    height:50,
    width:deviceWidth-170,
    flex:-1,
    alignItems: 'flex-start',
    justifyContent: 'center',

  },
  flexbox1:{
    height:30,
    width:30,
    alignItems: 'center',
    justifyContent: 'center',
  },
    swipedown:{
    height:30,
    width:deviceWidth,
    backgroundColor:styleConfig.bright_blue,
    justifyContent: 'center',
    alignItems: 'center',
  },
    txt3: {
    color:'white',
    fontSize: 13,
    fontWeight:'400',
    fontFamily: 'Montserrat-Regular',
  },


});

export default LeaderboardData;
