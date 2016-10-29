'use strict';
import SettingDetail from '../../components/SettingDetail';
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  SwitchIOS,
  TouchableHighlight,
  AlertIOS,
  AsyncStorage,
  TouchableOpacity,
  Image,
  VibrationIOS,
 } from 'react-native';
import TimeFormatter from 'minutes-seconds-milliseconds';
import TimerMixin from 'react-timer-mixin';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import {GoogleSignin, GoogleSigninButton} from 'react-native-google-signin';
import Mapbox from 'react-native-mapbox-gl';
import BackgroundGeolocation from 'react-native-background-geolocation';
import Icon from 'react-native-vector-icons/Ionicons';
import SettingsService from '../../components/SettingsService';
import commonStyles from '../../components/styles';
import styleConfig from '../../components/styleConfig';
import haversine from 'haversine';
var mapRef = 'mapRef';
var deviceWidth = Dimensions.get('window').width;
var deviceheight = Dimensions.get('window').height;

var styles = StyleSheet.create({
  StartStopbtn:{
    left:-3,
    paddingLeft:10,
    bottom:0,
    height:40,
    width:deviceWidth/2-10,
    backgroundColor:'#673ab7',
    marginRight:-10,
    fontSize:30,
    color:'white',
    borderRadius:30,
  },
  DistanceFill:{
    backgroundColor:'transparent',
  }, 
  distanceWrap:{
    flexDirection: 'row',
    justifyContent:'center',
    width:deviceWidth,
    height:50,
  },
  EndRun:{
    justifyContent: 'center',      
    alignItems: 'center',
    height:50,
    width:deviceWidth/2-20,
    borderRadius:30,
    backgroundColor:styleConfig.light_gold,
    margin:10,
  },
  ResumePause:{
    justifyContent: 'center',      
    alignItems: 'center',
    height:50,
    width:deviceWidth/2-20,
    borderRadius:30,
    backgroundColor:'#e03ed2',
    margin:10,
  },
  workspace: {
    flex: 1,
    justifyContent: 'center',      
    alignItems: 'center',
    top:-20,

  },
  map: {
    top:20,
    position:'absolute',
    height:deviceheight,
    width:deviceWidth,
    opacity:1,
  },
  bottomBarContent:{
    paddingLeft:10, 
    width:deviceWidth/4,
    justifyContent: 'center',      
    alignItems: 'center',
  },
  Impact:{
    fontSize:30,
    fontWeight:'500',
    color:styleConfig.greyish_brown_two,
    backgroundColor:'transparent',   
  },
  distance:{
    fontSize:25,
    fontWeight:'500',
    color:styleConfig.greyish_brown_two,
    backgroundColor:'transparent',   
  },
  WrapCompany:{
    flex:1,
    justifyContent: 'center',      
    alignItems: 'center',
    backgroundColor:'transparent',   
   },
   timeDistanceWrap:{
    justifyContent: 'center',      
    alignItems: 'center',
    width:deviceWidth/2, 
    backgroundColor:'transparent',   
   },
});

SettingsService.init('iOS');

  var Home = React.createClass({
    mixins: [TimerMixin],
    mixins: [Mapbox.Mixin],
    annotations: [],
    locationIcon: 'green-circle.png',
    currentLocation: undefined,
    locationManager: undefined,

  // InitilialStates

  getInitialState: function() {
    return {
      isRunning:true,
      mainTimer:null,
      speed:0,
      prevLatLng: {},
      distanceTravelled: 0,
      prevDistance:0,
      textState:'PAUSE',
      Enbtn:'END RUN',
      enabled: true,
      isMoving: false,
      paceButtonIcon: 'md-pause',
      navigateButtonIcon: 'md-locate',
      mapHeight: 280,
      mapWidth: 300,
      zoom: 10,
      annotations: [],
      center: {
        latitude: 40.72052634,
        longitude: -73.97686958312988
      },
      zoom: 14
    };
  },


  componentWillMount: function() {
    AsyncStorage.multiGet(['UID234', 'UID345'], (err, stores) => {
        stores.map((result, i, store) => {
            let key = store[i][0];
            let val = store[i][1];
            this.setState({
              Storeduserdata:val
            })
        });
    });

    var me = this,
    gmap = this.refs.gmap;
    this.locationManager = this.props.locationManager;

    // location event
    this.locationManager.on("location", function(location) {
      console.log('- location: ', JSON.stringify(location, null, 2));
      if (location.sample) {
        console.log('<sample location>');
        return;
      }
      me.addMarker(location);
      me.setCenter(location);
    });
    // http event
    this.locationManager.on("http", function(response) {
      console.log('- http ' + response.status);
      console.log(response.responseText);
    });
    // geofence event
    this.locationManager.on("geofence", function(geofence) {
      console.log('- onGeofence: ', JSON.stringify(geofence));
      me.locationManager.removeGeofence(geofence.identifier);
    });
    // error event
    this.locationManager.on("error", function(error) {
      console.log('- ERROR: ', JSON.stringify(error));
    });
    // motionchange event
    this.locationManager.on("motionchange", function(event) {
      console.log("- motionchange", JSON.stringify(event, null, 2));
      me.setState({
        isMoving: event.is_moving,
       
      });
     if (me.state.isMoving) {};
      
      me.updatePaceButtonStyle()
    });
    // heartbeat event
    this.locationManager.on("heartbeat", function(params) {
      console.log("- heartbeat: ", params.location);
    });
    // schedule event
    this.locationManager.on("schedule", function(state) {
      console.log("- schedule fired: ", state.enabled, state);
      me.setState({
        isMoving: state.isMoving,
        enabled: state.enabled
      });
      me.updatePaceButtonStyle();

    });
    // activitychange event
    this.locationManager.on("activitychange", function(activityName) {
    });

    // getGeofences
    this.locationManager.getGeofences(function(rs) {
    }, function(error) {
    });

    // Fetch settings and configure.
    SettingsService.getValues(function(values) {

    //values.schedule = SettingsService.generateSchedule(24, 1, 1, 1);
      
      // Configure BackgroundGeolocaiton!
      me.locationManager.configure(values, function(state) {
        me.locationManager.startSchedule(function() {
        });   
      });
    });
    this.setState({
      enabled: true,
    });
    if (this.state.enabled) {
    this.locationManager.start(function() {
      me.initializePolyline();
    });
     var d = new Date();
     var mynewDateStart = d.toISOString().substring(0, 10);
     this.setState({
     myrundate: mynewDateStart + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds(),
    });
    }
  },
  
  componentDidMount:function(){     
    var date = this.state.myrundate;
    this._handleStartStop();
    if (this.state.isMoving) {
      this._handleStartStop();}; 
      this.refs.circularProgress.performLinearAnimation(parseFloat(this.state.distanceTravelled).toFixed(0), 5000)
      this.locationManager.start();    
      this.updatePaceButtonStyle();
      this.locationManager.changePace(!this.state.isMoving);
      this.setState({
        enabled:true,
        textState:'PAUSE',
        isRunning:true,
      });
      this.StartGetLocation()
      this.updatePaceButtonStyle();
      return;  
  },
  _handleStartStop:function(){
    let {isRunning,FirstTime,mainTimer,lapTimer} = this.state;
    if(!this.state.isRunning){
      clearInterval(this.interval);
      this.setState({
          isRunning:false
      });
      return;
      }else{ 
        if (this.state.isRunning) {
          this.setState({
            mainTimerStart:new Date(),
            lapTimerStart:new Date(),
            isRunning:true,
          })
        this.interval = setInterval(()=>{
        this.setState({
            mainTimer:new Date() - this.state.mainTimerStart + mainTimer,
            lapTimer:new Date() - this.state.lapTimerStart + lapTimer,
        })
        },30);
      }; 
    }
  },
  
  
  // Add Marker if check clear
  addMarker :function(location) {
    const {distanceTravelled,prevDistance } = this.state
    const newLatLngs = {latitude: location.coords.latitude, longitude: location.coords.longitude }
    const newDistance = distanceTravelled + this.calcDistance(newLatLngs)
      this.setState({
            prevDistance: newDistance-distanceTravelled,
          })
    // If Location accuracy is less than 15
      if (location.coords.accuracy <=15){

        // IF Speed More than 35km/hr
      if (location.coords.speed <= 9) {
      var me = this;
      this.addAnnotations(mapRef, [this.createMarker(location)]);
      if ( this.polyline) {
        this.polyline.coordinates.push([location.coords.latitude, location.coords.longitude]);
        // this.polyline.lengthof.push(this.polyline.oneOf(this.polyline));
        this.updateAnnotation(mapRef, this.polyline);
      }
      const {distanceTravelled,prevDistance } = this.state
      const newLatLngs = {latitude: location.coords.latitude, longitude: location.coords.longitude }
      this.setState({
          distanceTravelled: distanceTravelled + this.calcDistance(newLatLngs),
          prevLatLng: newLatLngs,
          speed:location.coords.speed,
        })
        }else{
          this.locationManager.removeGeofences();
          this.locationManager.stop();
          this.setState({
             isMoving:false,
             isRunning:false,    
          });
          this.updatePaceButtonStyle();
          this._handleStartStop();
          VibrationIOS.vibrate();
          AlertIOS.alert('Too fast','Your speed is more than running speed it seems you are travelling in vehicle');
         }
      }else{
          // else to our algo part
          var Prevdistance = this.state.prevDistance*1000;
          var locationAccuracy=location.coords.accuracy;
          var thresholdAccuracy = 16;
          var offset = 1;
          var thresholdFactor = 5; 
          var currentDistance = Prevdistance;
            if(Prevdistance/(locationAccuracy - (thresholdAccuracy-offset)) > thresholdFactor){
            var me = this;
            this.addAnnotations(mapRef, [this.createMarker(location)]);
              if ( this.polyline) {
                this.polyline.coordinates.push([location.coords.latitude, location.coords.longitude]);
                // this.polyline.lengthof.push(this.polyline.oneOf(this.polyline));
                this.updateAnnotation(mapRef, this.polyline);
                }
             }
          }
      
  },


   // function for calculating new and previous latlag
   calcDistance:function(newLatLng) {
    const { prevLatLng } = this.state
    return (haversine(prevLatLng, newLatLng) || 0)
   },
 
   //create marker details 
   createMarker: function(location) {
      return {
          id: location.timestamp,
          type: 'point',
          title: location.timestamp,
          coordinates: [location.coords.latitude, location.coords.longitude]
        };
    },

    // initialize polyline
    initializePolyline: function() {
      this.polyline = {
        lengthof:{},
        type: "polyline",
        coordinates: [],
        title: "Route",
        strokeColor: '#2677FF',
        strokeWidth: 5,
        strokeAlpha: 0.5,
        id: "route"
      };
      this.polyline2 = {
        lengthof:{},
        type: "polyline",
        coordinates: [],
        title: "Route",
        strokeColor: 'red',
        strokeWidth: 5,
        strokeAlpha: 0.5,
        id: "route"
      };
      this.addAnnotations(mapRef, [this.polyline,this.polyline2]);
    },

   onClickEnable: function(location) {
    var me = this;
    if (!this.state.enabled) {
        this.locationManager.start(function() {
        me.initializePolyline();
      });
     
      } else {
      if (this.state.enabled) {
      
      if (parseFloat(this.state.distanceTravelled).toFixed(1) >= 0.1) {
        this.EndGetLocation();
         this.locationManager.removeGeofences();
          this.locationManager.stop();
          this.locationManager.resetOdometer();
          this.removeAllAnnotations(mapRef);
          this.polyline = null;
          this.setState({
          enabled: !this.state.enabled,     
          });
          this.updatePaceButtonStyle();
       }else{
        this.EndRunConfimation();
        }  
       };      
      } 
    },

     navigateTOHomeScreen:function(){
        this.props.navigator.push({
        title: 'Gps',
        id:'tab',
        navigator: this.props.navigator,
       })
      },
     navigateTOShareScreen:function(){
      var data = this.props.data;
      var user = this.state.Storeduserdata;
      this.props.navigator.push({
        id:'sharescreen',
        passProps:{
          data:data,
          getUserData:this.props.getUserData,
          user:this.props.user,
          distance:parseFloat(this.state.distanceTravelled).toFixed(1),
          impact:parseFloat(this.state.distanceTravelled * data.conversion_rate).toFixed(0),
          speed:this.state.speed,
          isUserlogin:user,
          time:TimeFormatter(this.state.mainTimer),
          StartLocation:this.state.StartPosition,
          EndLocation:this.state.EndPosition,
          StartRunTime:this.state.myrundate
          },
        navigator: this.props.navigator,
       })
     },
    
    Confimation:function() {
      VibrationIOS.vibrate();
      AlertIOS.alert(
          'Go Back',
         'Are you sure you want to go back ',
         [
        {text: 'Confirm', onPress: () => this.popRoute() },
        {text: 'Cancel',},
       ],
      ); 
    },
   EndRunConfimation:function() {
     VibrationIOS.vibrate();
      AlertIOS.alert(
         'Too short',
         'You need to run a minimum of 100m to convert the distance into impact.',
        [
          {text: 'Continue',},
          {text: 'End', onPress: () => this.popRoute()},
        ],
      ); 
    },
    popRoute:function() {
      if (this.state.enabled) {    
      this.locationManager.removeGeofences();
      this.locationManager.stop();
      this.navigateTOHomeScreen();
      this.state.distanceTravelled = 0;
      this.state.prevDistance = 0;
      this.locationManager.resetOdometer();
      this.removeAllAnnotations(mapRef);
      this.polyline = null;
       this.setState({
        enabled: !this.state.enabled, 
       });
      this.updatePaceButtonStyle();    
      }else{
        this.navigateTOHomeScreen();
      }
    },
    onClickPace: function() {
      VibrationIOS.vibrate();
      if (!this.state.enabled)  {
       return; }
      var isMoving = !this.state.isMoving;
      this.locationManager.changePace(isMoving);
      this.setState({
        isMoving: isMoving,
        isRunning:!this.state.isRunning
      });
      this.updatePaceButtonStyle();
      this._handleStartStop();
    },
    StartGetLocation: function() { 
       navigator.geolocation.getCurrentPosition(
      (position) => {
        var StartPosition = position;
        this.setState({StartPosition});
      },
      (error) => alert(error.message),
      {enableHighAccuracy: true, timeout: 3000, maximumAge: 1000}
      )
    }, 
    EndGetLocation: function() { 
       navigator.geolocation.getCurrentPosition(
      (position) => {
        var EndPosition = position;
        this.setState({EndPosition})
        this.navigateTOShareScreen();
      },
      (error) => alert(error.message),
      {enableHighAccuracy: true, timeout: 3000, maximumAge: 1000}
      )
    },
    onRegionChange: function() {
    },
    setCenter: function(location) {
      this.setCenterCoordinateAnimated(mapRef, location.coords.latitude, location.coords.longitude)
    },
    updatePaceButtonStyle: function() {
      var style = commonStyles.disabledButton;
      if (this.state.enabled) {
        style = (this.state.isMoving) ? commonStyles.redButton : commonStyles.greenButton;
      }
      this.setState({
        paceButtonStyle: style,
        paceButtonIcon: (this.state.enabled  && this.state.isRunning) ? 'md-pause' : 'md-play',
        textState:(this.state.enabled && this.state.isRunning) ? 'PAUSE':'RESUME', 
        EndRun:(this.state.enabled) ? 'END RUN':'BEGIN RUN', 
      });
    },
    // MapBox
    onRegionChange: function(location) {
      this.setState({ currentZoom: location.zoom });
    },
    onRegionWillChange:function(location) {
      console.log('regionChange :'+JSON.stringify(location));
    },
    onUpdateUserLocation:function(location) {
      console.log('UpdateLocation :'+location);
    },
    onOpenAnnotation:function(annotation) {
      console.log('annotation:'+annotation);
    },
    onRightAnnotationTapped:function(e) {
      console.log(e);
    },
    render: function(location) {
      var data = this.props.data;
      return (
        <View style={commonStyles.container}>
           <View ref="workspace" style={styles.workspace}>           
            <Mapbox
              style={styles.map}
              direction={0}
              rotateEnabled={true}
              scrollEnabled={true}
              zoomEnabled={true}
              showsUserLocation={false}
              ref={mapRef}
              accessToken={'pk.eyJ1IjoiY2hyaXN0b2NyYWN5IiwiYSI6ImVmM2Y2MDA1NzIyMjg1NTdhZGFlYmZiY2QyODVjNzI2In0.htaacx3ZhE5uAWN86-YNAQ'}
              styleURL={this.mapStyles.emerald}
              userTrackingMode={this.userTrackingMode.none}
              centerCoordinate={this.state.center}
              zoomLevel={this.state.zoom}
              onRegionChange={this.onRegionChange}
              onRegionWillChange={this.onRegionWillChange}
              annotations={this.state.annotations}
              onOpenAnnotation={this.onOpenAnnotation}
              onRightAnnotationTapped={this.onRightAnnotationTapped}
              onUpdateUserLocation={this.onUpdateUserLocation}>
            </Mapbox>
            <View style={{top:20,position:'absolute',height:deviceheight,width:deviceWidth,backgroundColor:'white'}}></View>
            <View style={styles.WrapCompany}>
              <Image style={{resizeMode: 'contain',height:styleConfig.LogoHeight,width:styleConfig.LogoWidth,}}source={{uri:data.sponsors[0].sponsor_logo}}></Image>
              <Text style={{color:styleConfig.greyish_brown_two,fontSize:16,fontFamily:styleConfig.FontFamily,}}>is proud to sponsor your run.</Text>
            </View>
            <View style={{justifyContent: 'center',alignItems: 'center', flex:1}}>
            <Text style={{fontSize:20,marginTop:30,marginBottom:20,color:styleConfig.greyish_brown_two,fontFamily:styleConfig.FontFamily,backgroundColor:'transparent',}}>IMPACT</Text> 
             <AnimatedCircularProgress
                style={{justifyContent:'center',alignItems:'center',backgroundColor:'transparent'}}
                ref='circularProgress'
                size={130}
                width={5}
                fill={this.state.distanceTravelled*10/2}
                prefill={100}
                tintColor="#00e0ff"
                backgroundColor="#fafafa">                   
              </AnimatedCircularProgress>
               <View style={{marginTop:-130,backgroundColor:'transparent',width:130,height:130,justifyContent:'center',alignItems:'center'}}>
                <Text style={styles.Impact}>{parseFloat(this.state.distanceTravelled * data.conversion_rate).toFixed(0)}</Text>
                <Text style={{fontFamily:styleConfig.FontFamily,color:styleConfig.greyish_brown_two,opacity:0.7,}}>RUPEES</Text>
              </View>
              </View>
              <View style={{flex:1,flexDirection:'row',backgroundColor:'transparent'}}>
                <View style={styles.timeDistanceWrap}>
                  <Icon style={{color:styleConfig.greyish_brown_two,fontSize:30,}} name={'ios-walk-outline'}></Icon>
                    <Text style={styles.distance}>{parseFloat(this.state.distanceTravelled ).toFixed(1)}</Text>
                  <Text style={{fontFamily:styleConfig.FontFamily,color:styleConfig.greyish_brown_two,opacity:0.7,}}>KMS</Text>
                </View>
                <View style={styles.timeDistanceWrap}>
                  <Icon style={{color:styleConfig.greyish_brown_two,fontSize:30,backgroundColor:'transparent'}} name={'md-stopwatch'}></Icon>
                   <Text style={styles.distance}>{TimeFormatter(this.state.mainTimer)}</Text>
                  <Text style={{fontFamily:styleConfig.FontFamily,color:styleConfig.greyish_brown_two,opacity:0.7,}}>MIN:SEC</Text>
                </View>
              </View>
            </View>

          <View style={commonStyles.bottomToolbar}>
          <TouchableOpacity   onPress={this.onClickPace} style={[this.state.paceButtonStyle,styles.stationaryButton]}>
           <View style={{flexDirection:'row'}}>
            <Icon name={this.state.paceButtonIcon} style={{color:'white',fontSize:18,marginTop:2,marginRight:5}}></Icon>
            <Text style={{fontFamily:styleConfig.FontFamily,fontSize:18,fontWeight:'800',letterSpacing:1,color:'white',}}>{this.state.textState}</Text>
            </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.onClickEnable} iconStyle={commonStyles.iconButton} style={styles.EndRun}><Text style={{fontFamily:styleConfig.FontFamily,fontSize:18,fontWeight:'800',letterSpacing:1,color:'white',}}>{this.state.EndRun}</Text></TouchableOpacity>
          </View>
        </View>
      );
    }
});
module.exports = Home;
// <Text style={styles.bottomBarContent}>Distance two points {"\n"}{parseFloat(this.state.prevDistance*1000).toFixed(1)}m</Text>

