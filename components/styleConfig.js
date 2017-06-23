
'use strict';
var React = require('react-native');
var {StyleSheet, PixelRatio,Dimensions} = React;
const Devicewidth = Dimensions.get('window').width
const Deviceheight = Dimensions.get('window').height
var iphone5 = 568;
var iphone5s = 568;
var iphone6 = 667;
var iphone6s = 667;
var iphone7 = 667;
var iphone6Plus = 736;
var iphone6SPlus = 736;
var iphone7Plus = 736;


import { Platform } from 'react-native';
var FONT_LABEL1   = 18;
var FONT_LABEL2  =16;

if (PixelRatio.get() === 1) {
  FONT_LABEL1 = 16;
  FONT_LABEL2 = 13;
}
if (PixelRatio.get() === 2) {
  FONT_LABEL1 = 18;
  FONT_LABEL2 = 14;
}
if (PixelRatio.get() === 3) {
  FONT_LABEL1 = 20;
  FONT_LABEL2 = 25;
}

function BtnHight () {
  if(Devicewidth > 320){
    return 70;
  }else {
  if(Devicewidth <= 320){
    return 55;
  }else { 
    return 50;
  }
}
}


function GraphHeight (){
  if (iphone5 === Deviceheight) {
    return (Deviceheight/2)-160
  }else if (iphone5s === Deviceheight) {
    return (Deviceheight/2)-160
  }else if (iphone6 === Deviceheight) {
    return (Deviceheight/2)-130
  }else if (iphone6s === Deviceheight) {
    return (Deviceheight/2)-130
  }else if (iphone6Plus === Deviceheight) {
    return (Deviceheight/2)-125
  }else if (iphone7 === Deviceheight) {
    return (Deviceheight/2)-125
  }else if (iphone7Plus === Deviceheight) {
    return (Deviceheight/2)-125
  };
}

function seeRunBtnHeight (){
  if (iphone5 === Deviceheight) {
    return 35
  }else if (iphone5s === Deviceheight) {
    return 35
  }else if (iphone6 === Deviceheight) {
    return 45
  }else if (iphone6s === Deviceheight) {
    return 45
  }else if (iphone6Plus === Deviceheight) {
    return 50
  }else if (iphone7 === Deviceheight) {
    return 50
  }else if (iphone7Plus === Deviceheight) {
    return 50
  };
}

function BtnWidth () {
  if(Devicewidth > 320){
    return 70;
  }else {
  if(Devicewidth <= 320){
    return 55;
  }else { 
    return 50;
  }
}
}
function fontSizer1 () {
  if(Devicewidth > 320){
    return 20;
  }else {
  if(Devicewidth <= 320){
    return 18;
  }else { 
    return 14;
  }
}
}
function fontSizer2 () {
  if(Devicewidth > 320){
    return 14;
  }else {
  if(Devicewidth <= 320){
    return 12;
  }else { 
    return 7;
  }
}
}
function fontSizer3 () {
  if(Devicewidth > 320){
    return 14;
  }else {
  if(Devicewidth <= 320){
    return 12;
  }else { 
    return 7;
  }
}
}
function LogoHeight () {
  if(Devicewidth > 320){
    return 100;
  }else {
  if(Devicewidth <= 320){
    return 70;
  }else { 
    return 70;
  }
}
}
function LogoWidth () {
  if(Devicewidth > 320){
    return 200;
  }else {
  if(Devicewidth <= 320){
    return 100;
  }else { 
    return 100;
  }
}
}
function CardHeight () {
  if(Deviceheight > 568){
    return Deviceheight-220;
  }else {
  if(Deviceheight <= 480){
    return Deviceheight-180;
  }else { 
    if (Deviceheight >= 480) {
    return Deviceheight-220;
  }
  }
}
}
function barHeight () {
  if(Deviceheight > 568){
    return 8;
  }else {
  if(Deviceheight <= 480){
    return 6;
  }else { 
    if (Deviceheight >= 480) {
    return 7;
  }
  }
}
}
function CardTop () {
  if(Deviceheight > 568){
    return 5;
  }else {
  if(Deviceheight <= 480){
    return 1;
  }else { 
    return 0;
  }
}
}

function FontSizeLogin(){
   if(Devicewidth > 320){
    return 16;
  }else {
  if(Devicewidth <= 320){
    return 12;
  }else { 
    return 8;
  }
}
}


export default {
  FontSizeTitle:fontSizer1(),
  FontSizeDisc:fontSizer2(),
  FontSize3:fontSizer3(),
  FontSizeLogin:FontSizeLogin(),
  beginRunBtnHeight:BtnHight(),
  beginRunBtnWidth:BtnWidth(),
  LogoHeight:LogoHeight(),
  LogoWidth:LogoWidth(),
  CardHeight:CardHeight(),
  CardTop:CardTop(),
  barHeight:barHeight(),
  GraphHeight:GraphHeight(),
  SeeRunBtnHeight:seeRunBtnHeight(),
  // navHight
  navBarHeight:70,
  // fontColors
  white_three:'#d8d8d8',
  bright_sky_blue:'#00b9ff',
  warm_grey:'#979797',
  greyish_brown:'#454545',
  black_50:'rgba(0,0,0,0.50)',
  grey_70:'#9e9c9c',
  brownish_grey:'#6a6a6a',
  warm_grey_two:'#777777',
  black_three:'#212121',
  greyish_brown_two:'#4a4a4a',
  white_two:'#f5f5f5',
  light_gold:'#ffcd4d',
  fade_White:'#eeeeee',
  purplish_brown:'#453640',
  //FontFamily
  FontFamily:'Montserrat-Regular',
  FontFamily2:'Montserrat-Thin',
  FontFamily3:'Montserrat-Light',
  pale_magenta:'#d667cd',
  bright_blue:'#0077ff',
  warm_grey_three:'#8a8a8a',

}