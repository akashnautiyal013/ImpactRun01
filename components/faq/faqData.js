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
  NetInfo,
  AsyncStorage,
  RefreshControl,
} from 'react-native';
import apis from '../../components/apis';
import styleConfig from '../../components/styleConfig';
import Icon from 'react-native-vector-icons/Ionicons';
var KeyboardEvents = require('react-native-keyboardevents');
import KeyboardSpacer from 'react-native-keyboard-spacer';
import LodingScreen from '../../components/LodingScreen';
var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;
class Faqdata extends Component {

      constructor(props) {
        super(props);
        this.FetchfaqDataLocally();
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
          faqData: ds.cloneWithRows([]),
          loaded: false,
          keyboardSpace:0,
          refreshing:false,
        };
      
      }
      
      FetchfaqDataLocally(){
        AsyncStorage.getItem('faqData', (err, result) => { 
          if (result != null || undefined) {
          var faqdata = JSON.parse(result);  
          this.setState({
           faqData: this.state.faqData.cloneWithRows(faqdata.results),
           loaded: true,
          }) 
        }else{
          this.fetchifinternet();
        }
        });
      }

      fetchifinternet(){
        NetInfo.isConnected.fetch().done(
          (isConnected) => { this.setState({isConnected}); 
            if (isConnected) {
               this.fetchFaqData();
            };   
          }
        );
      }

     

      navigateTOhome(){
        this.props.navigator.push({
          title: 'Gps',
          id:'tab',
          navigator: this.props.navigator,
        })
      }

      componentDidMount() {
       
      }
      
      componentWillUnmount() {
        
      }


      fetchFaqData() {
        AsyncStorage.removeItem('faqData',(err) => {
          console.log(err,'itemremoved');
         });
        var url = apis.faqsApi;
        fetch(url)
          .then( response => response.json() )
          .then( jsonData => {
            this.setState({
              faqData: this.state.faqData.cloneWithRows(jsonData.results),
              loaded: true,
              refreshing:false,
            });
            let faqData = jsonData;
            AsyncStorage.setItem('faqData',JSON.stringify(faqData)); 
          })
        .catch( error => console.log('Error fetching: ' + error) );
      }

      

      SubmitFaq(){
        var user_id = this.props.user.user_id;
         fetch("http://dev.impactrun.com/api/faq/", {
            method: "post",
            headers: {  
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body:JSON.stringify({
            "question":this.state.moreText,
            "user_id":user_id,

            })
          })
          .then((response) => response.json())
          .then((response) => { 
            AlertIOS.alert('Thank you for submitting your question');
          })    
          .catch((err) => {
          })

        this._textInput.setNativeProps({text: ''});
        }

      _onRefresh(){
        this.setState({
          refreshing:true,
        })
        this.fetchifinternet();
      }

      
      renderRow(rowData){
        return (
          <View style={{backgroundColor:'white',padding:10,marginBottom:1}}>
            <View style={styles.thumb}>
              <Text style={styles.txt}>{rowData.question}</Text>
            </View>
            <Text style={styles.txtSec}>{rowData.answer}</Text>
          </View>
        );
      }
      renderLoadingView() {
        return (
          <View style={{width:deviceWidth,height:deviceHeight-120}}>
            <LodingScreen />
          </View>
        );
      }


      render() {
        console.log('keyboardSpace',this.state.keyboardSpace);
        if (!this.state.loaded) {
          return this.renderLoadingView();
        }
        return (
          <View style={{height:deviceHeight,width:deviceWidth}}>
            <View style={{height:deviceHeight-105,width:deviceWidth}}>
              <ListView
              refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this._onRefresh.bind(this)}
                />}
                dataSource={this.state.faqData}
                renderRow={this.renderRow}
                style={styles.container}>
              </ListView>
              <View style={styles.FaqSubmitWrap}>
                <TextInput
                ref={component => this._textInput = component} 
                style={styles.textEdit}
                onChangeText={(moreText) => this.setState({moreText})}
                placeholder="If you have any question ask us!"
                />
                <TouchableOpacity onPress={() => this.SubmitFaq()} style={styles.submitFaqbtn}>
                  <Text style={{color:'white'}}>Submit</Text>
                </TouchableOpacity>
              </View>
                 <KeyboardSpacer/>
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
    marginTop:-45,
    bottom:-45,
    marginBottom:45,
  },
  thumb: {
    backgroundColor: 'white',
    marginBottom: 5,
    elevation: 1
  },
  img: {
    height: 300
  },
  txt: {
    marginLeft:10,
    color:'#4a4a4a',
    fontWeight:'500',
    fontSize: 16,
    textAlign: 'left',
    fontFamily: 'Montserrat-Regular',
  },
  txtSec:{
   padding:10,
   paddingTop:0,
   fontSize:15,
   color:'#4a4a4a',
  },
  FaqSubmitWrap:{
    paddingLeft:10,
    height:styleConfig.navBarHeight,
    width:deviceWidth,
    flexDirection: 'row',
    justifyContent:'flex-start',
    alignItems:'center',
    backgroundColor:'#e1e1e8',
    borderBottomWidth:2,
    borderBottomColor:'#e1e1e8',
  },
  textEdit: {
    marginLeft:-5,
    height:48, 
    borderColor: '#e1e1e8', 
    backgroundColor: 'white',
    borderWidth:5 ,
    borderRadius:8,
    width:deviceWidth-100,
    color:'#4a4a4a',
    padding:10,
    top:4,
  },
  submitFaqbtn:{
    height:40, 
    width:85,
    right:-4,
    top:-6,
    borderRadius:8,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:styleConfig.bright_blue, 
  }
});

export default Faqdata;