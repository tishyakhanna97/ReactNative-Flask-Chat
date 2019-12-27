import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Platform,
  StatusBar,
  ScrollView,
  Alert,
  Button,
  Slider,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import { List } from 'react-native-elements';


const ip_address = '172.17.125.132'
const serverURL = 'http://' + ip_address + ':8668';
const http = axios.create({
  baseURL: serverURL,
});
const sampleNUSMODs = 'https://nusmods.com/timetable/sem-1/share?CS2100=LAB:09,TUT:03,LEC:1&CS2101=&CS2102=TUT:08,LEC:1&CS2103T=LEC:G13&GEH1074=TUT:W04,LEC:1'

const DATA = [
      {
        id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
        title: 'First Item',
      },
      {
        id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
        title: 'Second Item',
      },
      {
        id: '58694a0f-3da1-471f-bd96-145571e29d72',
        title: 'Third Item',
      },
];

function Item({ message, username }) {
    console.log({message});
  return (
    <View style={styles.item}>
      <Text style={styles.title}>{username} : {message}</Text>
    </View>
  );
}

export class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      distance1: 3,
      distance2: 3,
      distance3: 3,
      minDistance: 0,
      maxDistance: 10,
      pointsLeft: 1,
      timeTable: ''
    };
  }


  componentWillMount() {
    this.startHeaderHeight = 50;
    if (Platform.OS == 'android') {
      this.startHeaderHeight = 100 + StatusBar.currentHeight;
    }
  }

  printModCode() {
    const {timeTable} = this.state;
    Alert.alert("timeTable");
    this.parseNusModsLink(timeTable)
    //this.doStuff(timeTable)
  }

  async doStuff(timeTable) {
    this.setState({timeTable:timeTable});
    this.onGetTimeTable(timeTable)
  }
  
    onGetTimeTable(timeTableInput) {
      // POST to Flask Server
        http.get(serverURL+ '/Timetable/'+ timeTableInput, {
        moduleCode : timeTableInput,
        })
        .then((response) => this.onGetTimeTableSuccess(response))
        .catch((err) => console.log(err))
      }
  
  
    onGetTimeTableSuccess(response){
      const { answer } = response;
          console.log(JSON.stringify(response.data));
          console.log("hello")
    }



    parseModule(inputModule) {
      var arrayOfCodes = [];
      var splitModule = inputModule.split('=')
      var moduleName = splitModule[0]
      arrayOfCodes.push(moduleName)
      if(splitModule.length <= 1) {
        return arrayOfCodes
      }
      var classes = splitModule[1]
      var myClassesSplit = classes.split(',')
      console.log(myClassesSplit[0])

    }

    parseNusModsLink(link) {
      var myModules = [];
      var startIndex = link.indexOf('?') + 1
      var linkWithoutHTTPS = link.substring(startIndex)
      var modulesString = linkWithoutHTTPS.split('&')
      this.parseModule(modulesString[0])


    
      
      // https://nusmods.com/timetable/sem-1/share?
      // CS2100=LAB:09,TUT:03,LEC:1&CS2101=&CS2102=TUT:08,
      // LEC:1&CS2103T=LEC:G13&GEH1074=TUT:W04,LEC:1
    }





  render() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
        <View
          style={{
            height: this.startHeaderHeight,
            backgroundColor: '#376DCF',
            borderBottomWidth: 1,
            borderBottomColor: '#dddddd',
          }}>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
            <TextInput
              underlineColorAndroid="transparent"
              placeholder="Settings"
              placeholderTextColor="white"
              style={{ fontWeight: '700', paddingLeft: 15, paddingTop: 15 }}
            />
          </View>
        </View>

        <ScrollView scrollEventThrottle={16} style={{}}>
          <View style={{ flex: 1, paddingTop: 5 }}>
            <Text
              style={{
                fontSize: 24,
                fontWeight: '700',
                paddingHorizontal: 5,
              }}>
              Preferences
            </Text>
            <Text
              style={{
                fontSize: 12,
                fontWeight: '500',
                paddingHorizontal: 5,
              }}>
              Paste your NusMods sharing link in the box below:
            </Text>
            

            <View style={{ flex: 1, paddingHorizontal: 5 }}>
              <TextInput
                underlineColorAndroid="transparent"
                placeholder="NusMods sharing link"
                placeholderTextColor="black"
                onChangeText={(timeTable) => this.setState({timeTable})}
                style={{
                  height: 40,
                  borderColor: 'gray',
                  borderWidth: 1,
                  paddingHorizontal: 5,
                }}
              />

            <Button
              title="Update timetable"
              color="grey"
              onPress={() => this.printModCode()}
            />
              

            </View>


            <Text
              style={{
                fontSize: 12,
                fontWeight: '500',
                paddingHorizontal: 5,
              }}>
              Allocate importance points(10 total) among the three conditions
            </Text>

            <Text
              style={{
                fontSize: 12,
                fontWeight: '500',
                paddingHorizontal: 5,
              }}>
              Points Left: {this.state.pointsLeft} /10
            </Text>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'stretch',
                marginLeft: 5,
                marginRight: 5,
                borderWidth: 0.5,
                borderColor: '#dddddd',
              }}>
              <View style={{ flex: 1, padding: 5 }}>
                <Icon name={'users'} size={40} color="grey" />
              </View>
              <View style={{ flex: 5 }}>
                <Slider
                  style={{ flex: 1, height: 10 }}
                  step={1}
                  minimumValue={this.state.minDistance}
                  maximumValue={this.state.maxDistance}
                  value={this.state.distance1}
                  onValueChange={val => {
                    this.setState({ distance1: val });
                  }}
                  onSlidingComplete={val => {
                    if (
                      val + this.state.distance2 + this.state.distance3 >
                      this.state.maxDistance
                    ) {
                      this.setState({
                        distance1:
                          this.state.maxDistance -
                          this.state.distance2 -
                          this.state.distance3,
                      });
                    }
                    if (
                      this.state.distance1 < 0 ||
                      this.state.distance2 < 0 ||
                      this.state.distance3 < 0
                    ) {
                      this.setState({ distance1: 3 });
                      this.setState({ distance2: 3 });
                      this.setState({ distance3: 3 });
                    }

                    if (
                      this.state.maxDistance -
                        this.state.distance1 -
                        this.state.distance2 -
                        this.state.distance3 >
                      0
                    ) {
                      this.setState({
                        pointsLeft:
                          this.state.maxDistance -
                          this.state.distance1 -
                          this.state.distance2 -
                          this.state.distance3,
                      });
                    } else {
                      this.setState({ pointsLeft: 0 });
                    }
                  }}
                  thumbTintColor="#376DCF"
                  maximumTrackTintColor="#d3d3d3"
                  minimumTrackTintColor="grey"
                />
                <View style={styles.textCon}>
                  <Text style={styles.colorGrey}>{this.state.minDistance}</Text>
                  <Text style={styles.colorYellow}>{this.state.distance1}</Text>
                  <Text style={styles.colorGrey}>{this.state.maxDistance}</Text>
                </View>
              </View>
              <View style={{ flex: 1, padding: 5 }}>
                <Icon name={'user'} size={40} color="grey" />
              </View>
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'stretch',
                marginLeft: 5,
                marginRight: 5,
                borderWidth: 0.5,
                borderColor: '#dddddd',
              }}>
              <View style={{ flex: 1, padding: 5 }}>
                <Icon name={'tags'} size={40} color="grey" />
              </View>
              <View style={{ flex: 5 }}>
                <Slider
                  style={{ flex: 1, height: 20 }}
                  step={1}
                  minimumValue={this.state.minDistance}
                  maximumValue={this.state.maxDistance}
                  value={this.state.distance2}
                  onValueChange={val => {
                    this.setState({ distance2: val });
                  }}
                  onSlidingComplete={val => {
                    if (
                      val + this.state.distance1 + this.state.distance3 >
                      this.state.maxDistance
                    ) {
                      this.setState({
                        distance2:
                          this.state.maxDistance -
                          this.state.distance1 -
                          this.state.distance3,
                      });
                    }
                    if (
                      this.state.distance1 < 0 ||
                      this.state.distance2 < 0 ||
                      this.state.distance3 < 0
                    ) {
                      this.setState({ distance1: 3 });
                      this.setState({ distance2: 3 });
                      this.setState({ distance3: 3 });
                    }

                    if (
                      this.state.maxDistance -
                        this.state.distance1 -
                        this.state.distance2 -
                        this.state.distance3 >
                      0
                    ) {
                      this.setState({
                        pointsLeft:
                          this.state.maxDistance -
                          this.state.distance1 -
                          this.state.distance2 -
                          this.state.distance3,
                      });
                    } else {
                      this.setState({ pointsLeft: 0 });
                    }
                  }}
                  thumbTintColor="#376DCF"
                  maximumTrackTintColor="#d3d3d3"
                  minimumTrackTintColor="grey"
                />
                <View style={styles.textCon}>
                  <Text style={styles.colorGrey}>{this.state.minDistance}</Text>
                  <Text style={styles.colorYellow}>{this.state.distance2}</Text>
                  <Text style={styles.colorGrey}>{this.state.maxDistance}</Text>
                </View>
              </View>
              <View style={{ flex: 1, padding: 5 }}>
                <Icon name={'tag'} size={40} color="grey" />
              </View>
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'stretch',
                marginLeft: 5,
                marginRight: 5,
                borderWidth: 0.5,
                borderColor: '#dddddd',
              }}>
              <View style={{ flex: 1, padding: 5 }}>
                <Icon name={'bicycle'} size={40} color="grey" />
              </View>
              <View style={{ flex: 5 }}>
                <Slider
                  style={{ flex: 1, height: 20 }}
                  step={1}
                  minimumValue={this.state.minDistance}
                  maximumValue={this.state.maxDistance}
                  value={this.state.distance3}
                  onValueChange={val => {
                    this.setState({ distance3: val });
                  }}
                  onSlidingComplete={val => {
                    if (
                      val + this.state.distance1 + this.state.distance2 >
                      this.state.maxDistance
                    ) {
                      this.setState({
                        distance3:
                          this.state.maxDistance -
                          this.state.distance1 -
                          this.state.distance2,
                      });
                    }
                    if (
                      this.state.distance1 < 0 ||
                      this.state.distance2 < 0 ||
                      this.state.distance3 < 0
                    ) {
                      this.setState({ distance1: 3 });
                      this.setState({ distance2: 3 });
                      this.setState({ distance3: 3 });
                    }

                    if (
                      this.state.maxDistance -
                        this.state.distance1 -
                        this.state.distance2 -
                        this.state.distance3 >
                      0
                    ) {
                      this.setState({
                        pointsLeft:
                          this.state.maxDistance -
                          this.state.distance1 -
                          this.state.distance2 -
                          this.state.distance3,
                      });
                    } else {
                      this.setState({ pointsLeft: 0 });
                    }
                  }}
                  thumbTintColor="#376DCF"
                  maximumTrackTintColor="#d3d3d3"
                  minimumTrackTintColor="grey"
                />
                <View style={styles.textCon}>
                  <Text style={styles.colorGrey}>{this.state.minDistance}</Text>
                  <Text style={styles.colorYellow}>{this.state.distance3}</Text>
                  <Text style={styles.colorGrey}>{this.state.maxDistance}</Text>
                </View>
              </View>
              <View style={{ flex: 1, padding: 5 }}>
                <Icon name={'bus'} size={40} color="grey" />
              </View>
            </View>

            <Button
              title="Update timetable"
              color="grey"
              onPress={() => Alert.alert('Timetable successfully updated!')}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  textCon: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  colorGrey: {
    marginLeft: 10,
    marginRight: 10,
    color: '#d3d3d3',
  },
  colorYellow: {
    color: 'rgb(252, 228, 149)',
  },
});

export default Settings;
