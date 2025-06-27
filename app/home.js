import { registerRootComponent } from "expo";
import { LinearGradient } from "expo-linear-gradient";
import { Alert, ImageBackground, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { useEffect, useState } from 'react';
import { FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import { Link, router } from 'expo-router';
import { StatusBar } from "expo-status-bar";
import * as NavigationBar from "expo-navigation-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import { MenuProvider, Menu, MenuOptions, MenuOption, MenuTrigger, renderers } from 'react-native-popup-menu';
import WebSocketService from "../websocket/websocket";

SplashScreen.preventAutoHideAsync();

export default function home() {

    const [getTemperature, setTemperature] = useState("...");
    const [getHumidity, setHumidity] = useState("...");
    const [getMoisture, setMoisture] = useState("...");
    const [getSunlight, setSunlight] = useState("...");

    const [getTheme, setTheme] = useState("");

    NavigationBar.setBackgroundColorAsync(getTheme == "Light" ? "white" : "white");
    NavigationBar.setBorderColorAsync(getTheme == "Light" ? "white" : "#1e1e1e");
    NavigationBar.setButtonStyleAsync("dark");

    const [loaded, error] = useFonts(
        {
            'Fredoka-Regular': require("../assets/fonts/Fredoka-Regular.ttf"),
            'Fredoka-Light': require("../assets/fonts/Fredoka-Light.ttf"),
            'Fredoka-SemiBold': require("../assets/fonts/Fredoka-Medium.ttf"),
        }
    );
   

    useEffect(
        () => {
            async function setupTheme() {
                setTheme("Light");
            }
            setupTheme();
        }, []
    );

    //handleMessage
    async function handleMessage(message) {
        // console.log(message);

        if (message == "ESP32") {
            await AsyncStorage.setItem('isAutoWatering', JSON.stringify(false));

        } else {
            const sensorData = JSON.parse(message);
            // console.log("Message from WebSocket:", sensorData);

            //update values
            setTemperature(sensorData.temperature);
            setHumidity(sensorData.humidity);
            setMoisture(sensorData.moisture);
            setSunlight(sensorData.sunlight);

            // console.log("done");
        }
    }

    //use Web Soket
    const { sendMessage, openWebSocket } = WebSocketService(handleMessage);

    useEffect(
        () => {
            sendMessage(
                {
                    currentPage: 2
                }
            );
        }, []
    );

    useEffect(
        () => {
            if (loaded || error) {
                SplashScreen.hideAsync();
            }
        }, [loaded, error]
    );

    if (!loaded && !error) {
        return null;
    }

    const plant = require("../assets/images/greenhouse.jpg");
    const day = require("../assets/images/greenh.jpg");
    const night = require("../assets/images/greenh.jpg");

    return (
    
            <LinearGradient colors={getTheme == "Light" ? ['white', 'white', 'white'] : ['#0a131a', '#1e1e1e']} style={stylesheet.view1}>

                <StatusBar backgroundColor={getTheme == "Light" ? "white" : "#101f2b"} style={getTheme == "Light" ? null : "light"} />

                <View style={[stylesheet.view2, getTheme == "Light" ? null : { backgroundColor: "#101f2b", shadowColor: "lightblue", elevation: 80 }]}>

                    <Text style={[stylesheet.headerText, getTheme == "Light" ? null : { color: "white" }]}>GREENY</Text>

                    

                </View>

                <ScrollView>

                    <View style={stylesheet.mainView2}>

                        <ImageBackground source={getTheme == "Light" ? day : night} resizeMode="stretch" imageStyle={{ borderRadius: 8 }} style={stylesheet.plantView}>

                            <Image source={plant} style={stylesheet.image1} contentFit={"contain"} />

                        </ImageBackground>

                        <View style={stylesheet.dailyView}>

                            <Image source={plant} style={stylesheet.image1} contentFit={"contain"} />

                            <View style={{flexDirection:"row" , columnGap: 30}}>

                            <View style={{ flexDirection: "column",height:100, marginBottom: 10, justifyContent: "center", alignItems: "center" }}>
                                <View style={stylesheet.tempIconView2}>
                                    <FontAwesome6 name={"temperature-three-quarters"} size={35} color={"black"} />
                                </View>
                                <Text style={{ flex: 1, fontSize: 14, }}>Temperature</Text>
                                <Text style={{ fontSize: 18 }}>{getTemperature} ℃</Text>
                            </View>

                            <View style={{ flexDirection: "column", marginBottom: 10, justifyContent: "center", alignItems: "center" }}>
                                <View style={stylesheet.tempIconView2}>
                                    <FontAwesome6 name={"water"} size={35} color={"black"} />
                                </View>
                                <Text style={{ flex: 1, fontSize: 14 }}>Humidity</Text>
                                <Text style={{ fontSize: 18 }}>{getHumidity} %</Text>
                            </View>

                            <View style={{ flexDirection: "column", marginBottom: 10, justifyContent: "center", alignItems: "center" }}>
                                <View style={stylesheet.tempIconView2}>
                                    <FontAwesome6 name={"droplet"} size={35} color={"black"} />
                                </View>
                                <Text style={{ flex: 1, fontSize: 14 }}>Moisture</Text>
                                <Text style={{ fontSize: 18 }}>{getMoisture} %</Text>
                            </View>

                            <View style={{ flexDirection: "column", marginBottom: 10, justifyContent: "center", alignItems: "center",marginRight: 20 }}>
                                <View style={stylesheet.tempIconView2}>
                                    <FontAwesome6 name={"sun"} size={35} color={"black"} />
                                </View>
                                <Text style={{ flex: 1, fontSize: 14 }}>Sunlight</Text>
                                <Text style={{ fontSize: 18 }}>{getSunlight} %</Text>
                            </View>
                        </View>

                    </View>
                    </View>

                    <View style={stylesheet.navigateView2}></View>

                </ScrollView>

                <View style={stylesheet.navigateView}>
                    <Pressable style={{ flex: 1, alignItems: "center", justifyContent: "center", }}>
                        <FontAwesome6 name={"house"} size={30} color={"#0D7C66"} />
                        <Text style={{ flex: 1, fontSize: 14, color :"#0D7C66" }}>Home</Text>
                    </Pressable>

                    <Pressable style={{ flex: 1, alignItems: "center", justifyContent: "center" }} onPress={
                        () => {
                            router.push("/door");
                        }
                    }>
                        <FontAwesome6 name={"door-open"} size={30} color={"black"} />
                        <Text style={{ flex: 1, fontSize: 14 }}>Door</Text>
                    </Pressable>
                    
                    <Pressable style={{ flex: 1, alignItems: "center", justifyContent: "center" }} onPress={
                        () => {
                            router.push("/water");
                        }
                    }>
                        <FontAwesome6 name={"droplet"} size={30} color={"black"} />
                        <Text style={{ flex: 1, fontSize: 14 }}>Water</Text>
                    </Pressable>
                </View>

            </LinearGradient>
    );
}

const stylesheet = StyleSheet.create(
    {

        mainView2: {
            padding: 15,
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
            rowGap: 10,
            
        },

        plantView: {
            justifyContent: "center",
            alignItems: "center",
            height: 330,
            width: "100%",
            borderRadius: 10,
            borderWidth: 1,
            borderColor: "grey",
            position: "relative",
            elevation: 4,
        },

        dailyView: {
            height: 280,
            width: "100%",
            backgroundColor: "#f5faf6",
            borderRadius: 10,
            alignItems: "center",
            elevation: 4,
            rowGap: 20,
            marginTop: 15,

        },

        navigateView: {
            alignSelf: "center",
            justifyContent: "center",
            height: 70,
            width: "93%",
            borderRadius: 10,
            flexDirection: "row",
            position: "absolute",
            bottom: 1,
            padding: 10,
        },

        navigateView2: {
            height: 70,
            width: "100%",
        },

        image1: {
            width: "100%",
            height: 150,
            zIndex: 1,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10

        },

        tempView: {
            position: "absolute",
            zIndex: 2,
            top: 40,
            right: 5,
            flexDirection: "row",
            alignItems: "center",
            columnGap: 5
        },

        tempTextView: {
            backgroundColor: "white",
            borderRadius: 50,
            paddingHorizontal: 5,
        },

        tempIconView: {
            width: 35,
            borderRadius: 50,
            backgroundColor: "white",
            padding: 5,
            alignItems: "center"
        },

        tempIconView2: {
            width: 50,
            borderRadius: 50,
            backgroundColor: "white",
            padding: 5,
            alignItems: "center",
            marginEnd: 10,
            justifyContent: 'center',
        },

        humView2: {
            position: "absolute",
            zIndex: 2,
            top: 90,
            right: 5,
            flexDirection: "row",
            alignItems: "center",
            columnGap: 5
        },

        moisView3: {
            position: "absolute",
            zIndex: 2,
            bottom: 40,
            right: 10,
            flexDirection: "row",
            alignItems: "center",
            columnGap: 5
        },

        sunView4: {
            position: "absolute",
            zIndex: 2,
            top: 100,
            left: 10,
            flexDirection: "row",
            alignItems: "center",
            columnGap: 5
        },

        menuName: {
            fontFamily: "Fredoka-SemiBold",
            fontSize: 20,
            color: "#535758",
            marginBottom: 2
        },

        menuOptionView: {
            borderBottomWidth: 1,
            borderBottomColor: "#535758",
        },

        newMessages: {
            width: 25,
            height: 25,
            borderRadius: 20,
            backgroundColor: "#09a639",
            zIndex: 100,
            alignItems: "center",
            justifyContent: "center",
            position: "absolute",
            end: 1
        },

        dot1: {
            width: 20,
            height: 20,
            borderRadius: 20,
            borderWidth: 2,
            borderColor: "white",
            backgroundColor: "#09a639",
            position: "absolute",
            zIndex: 100,
            start: -1,
            top: -1,
        },

        view1: {
            flex: 1,
            // paddingVertical: 10,
            // paddingHorizontal: 20,
        },

        view2: {
            paddingHorizontal: 20,
            paddingVertical: 10,
            flexDirection: "row",
            columnGap: 20,
            alignItems: "center",
            marginBottom: 10,
            // borderBottomColor: "grey",
            // borderBottomWidth: 1,
            backgroundColor: "white",
            elevation: 10,
        },

        headerText: {
            fontFamily: "Fredoka-SemiBold",
            fontSize: 30,
            width: "90%",
            paddingStart: 110,

        },

        view3: {
            width: 80,
            height: 80,
            backgroundColor: "purple",
            borderRadius: 40,
        },

        view4: {
            flex: 1,
        },

        viewSearch: {
            flex: 1,
            flexDirection: "row",
        },

        input1: {
            height: 40,
            // borderStyle: "solid",
            // borderWidth: 1,
            width: "100%",
            borderRadius: 40,
            fontSize: 20,
            // color: "grey",
            paddingLeft: 15,
            paddingHorizontal: 15,
            // borderColor: "grey",
            elevation: 0.1,
        },

        menuView: {
            position: "absolute",
            alignSelf: "flex-end",
            marginTop: 15,
            width: "100%",
        },

        avatar: {
            width: 50,
            height: 50,
            borderRadius: 25,
            backgroundColor: "#d8d8d8",
            justifyContent: "center",
            alignItems: "center",
        },

        imageAvatar: {
            width: 50,
            height: 50,
            justifyContent: "center",
            alignSelf: "center",
            borderRadius: 25,
        },

        headerMenuOptionsLight: {
            width: "auto",
            minWidth: 200,
            marginTop: 40,
            marginLeft: 15,
            backgroundColor: "#d9fceb",
            borderRadius: 10,
            shadowColor: "black",
            elevation: 50,
        },
        headerMenuOptionsDark: {
            width: 250,
            marginTop: 40,
            backgroundColor: "#1e1e1e",
            borderWidth: 1,
            borderColor: "#1e1e1e",
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
            borderTopLeftRadius: 20,
            shadowColor: "#2d2d2d",
            elevation: 8,
        },

        text1: {
            fontFamily: "Fredoka-SemiBold",
            fontSize: 22,
        },

        text2: {
            fontFamily: "Fredoka-Regular",
            fontSize: 18,
        },
        text3: {
            fontFamily: "Fredoka-Regular",
            fontSize: 14,
            alignSelf: "flex-end",
        },

        view5: {
            paddingHorizontal: 20,
            flexDirection: "row",
            alignContent: "center",
            columnGap: 20,
            marginVertical: 8,
        },

        // view5: {
        //     paddingBottom:10,
        //     flexDirection: "row",
        //     alignContent: "center",
        //     columnGap: 20,
        //     marginHorizontal:25,
        //     marginVertical: 5,
        //     borderBottomWidth:1,
        //     borderBottomColor:"#9dbbab"
        // },

        // view5: {
        //     padding: 10,
        //     flexDirection: "row",
        //     alignContent: "center",
        //     columnGap: 20,
        //     marginVertical: 8,
        //     marginHorizontal:20,
        //     borderRadius:20,
        //     elevation:15,
        //     backgroundColor:"#d5eff4",
        // },

        view6: {
            width: 70,
            height: 70,
            borderRadius: 40,
            // backgroundColor: "white",
            // borderWidth: 3,
            // borderColor: "#b1b1b1",
            justifyContent: "center",
            alignItems: "center",
        },

        text4: {
            fontFamily: "Fredoka-Regular",
            fontSize: 16,
        },

        text5: {
            fontFamily: "Fredoka-Regular",
            fontSize: 13,
            alignSelf: "flex-end",
        },

        view7: {
            flexDirection: "row",
            columnGap: 10,
            alignSelf: "flex-end",
            alignItems: "center",
        },

        text6: {
            fontFamily: "Fredoka-Regular",
            fontSize: 30,
            color: "white",
        },

        text7: {
            fontFamily: "Fredoka-Regular",
            fontSize: 20,
            color: "white",
        },

    }
);