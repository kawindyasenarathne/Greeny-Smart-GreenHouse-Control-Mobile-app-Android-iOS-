import { registerRootComponent } from "expo";
import { LinearGradient } from "expo-linear-gradient";
import { Alert, ImageBackground, Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from "react-native";
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

export default function door() {

    const [getTheme, setTheme] = useState("");

    const [getColor1, setColor1] = useState(false);
    const [getColor2, setColor2] = useState(false);
    const [getColor3, setColor3] = useState(false);
    const [getColor4, setColor4] = useState(false);

    const [isEnabled, setIsEnabled] = useState();
    const [isEnabled2, setIsEnabled2] = useState();



    NavigationBar.setBackgroundColorAsync(getTheme == "Light" ? "white" : "#1e1e1e");
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
            console.log("theme setup");
        }, []
    );

    //handleMessage
    function handleMessage(message) {
        console.log("Message from WebSocket:", message);

    }

    //use Web Soket
    const { sendMessage, openWebSocket } = WebSocketService(handleMessage);

    useEffect(
        () => {
            sendMessage(
                {
                    currentPage: 1
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

    const plant = require("../assets/images/greenh.jpg");
    const day = require("../assets/images/greenhouse.jpg");
    const night = require("../assets/images/greenh.jpg");
    const door = require("../assets/images/door.png");

    return (

        <LinearGradient colors={getTheme == "Light" ? ['white', 'white'] : ['#0a131a', '#1e1e1e']} style={stylesheet.view1}>

            <StatusBar backgroundColor={"white"} style={getTheme == "Light" ? null : "light"} />

            <View style={[stylesheet.view2, getTheme == "Light" ? null : { backgroundColor: "white", shadowColor: "lightblue", elevation: 80 }]}>

                <Text style={[stylesheet.headerText, getTheme == "Light" ? null : { color: "white" }]}>Doors</Text>



            </View>

            <ScrollView>

                <View style={stylesheet.mainView2}>

                    <View style={stylesheet.liveView}>
                        <Image source={door} style={stylesheet.image1} contentFit={"contain"} />
                    </View>
                    {/* doors*/}
                    <View style={{ flexDirection: "row", columnGap: 20, marginTop: 15, }}>

                        <View style={stylesheet.controllView}>

                            <View>
                                <Text style={[stylesheet.headerText1, getTheme == "Light" ? null : { color: "white" }]}>DOOR</Text>
                            </View>

                            <View style={{ flexDirection: "row", columnGap: 20, justifyContent: "center", alignItems: "center", position: "relative" }}>
                                <Pressable style={[stylesheet.moveButton, getColor1 ? { backgroundColor: "rgba(76, 145, 83, 1)" } : null]}
                                    onTouchStart={
                                        () => {
                                            setColor1(true);
                                            sendMessage(
                                                {
                                                    item: "doorOpen",
                                                    // value:"open"
                                                }
                                            );
                                        }
                                    } onTouchEnd={
                                        () => {
                                            setColor1(false);
                                            sendMessage(
                                                {
                                                    item: "doorStop",
                                                    // value:"stop"
                                                }
                                            );
                                        }
                                    }>
                                    <FontAwesome6 name={"caret-left"} size={30} color={"black"} />
                                </Pressable>

                                <Pressable style={[stylesheet.moveButton, getColor2 ? { backgroundColor: "rgba(76, 145, 83, 1)" } : null]}
                                    onTouchStart={
                                        () => {
                                            setColor2(true);
                                            sendMessage(
                                                {
                                                    item: "doorClose",
                                                    // value:"close"
                                                }
                                            );
                                        }
                                    } onTouchEnd={
                                        () => {
                                            setColor2(false);
                                            sendMessage(
                                                {
                                                    item: "doorStop",
                                                    // value:"stop"
                                                }
                                            );
                                        }
                                    }>
                                    <FontAwesome6 name={"caret-right"} size={30} color={"black"} />
                                </Pressable>
                            </View>

                        </View>

                        <View style={stylesheet.controllView}>
                            <View>
                                <Text style={[stylesheet.headerText1, getTheme == "Light" ? null : { color: "white" }]}>SUN ROOF</Text>
                            </View>

                            <View style={{ flexDirection: "row", columnGap: 20, justifyContent: "center", alignItems: "center", position: "relative" }}>
                                <Pressable style={[stylesheet.moveButton, getColor3 ? { backgroundColor: "rgba(76, 145, 83, 1)" } : null]}
                                    onTouchStart={
                                        () => {
                                            setColor3(true);
                                            sendMessage(
                                                {
                                                    item: "sunroofOpen",
                                                    // value:"open"
                                                }
                                            );
                                        }
                                    } onTouchEnd={
                                        () => {
                                            setColor3(false);
                                            sendMessage(
                                                {
                                                    item: "sunroofStop",
                                                    // value:"stop"
                                                }
                                            );
                                        }
                                    }>
                                    <FontAwesome6 name={"caret-left"} size={30} color={"black"} />
                                </Pressable>

                                <Pressable style={[stylesheet.moveButton, getColor4 ? { backgroundColor: "rgba(76, 145, 83, 1)" } : null]}
                                    onTouchStart={
                                        () => {
                                            setColor4(true);
                                            sendMessage(
                                                {
                                                    item: "sunroofClose",
                                                    // value:"close"
                                                }
                                            );
                                        }
                                    } onTouchEnd={
                                        () => {
                                            setColor4(false);
                                            sendMessage(
                                                {
                                                    item: "sunroofStop",
                                                    // value:"stop"
                                                }
                                            );
                                        }
                                    }>
                                    <FontAwesome6 name={"caret-right"} size={30} color={"black"} />
                                </Pressable>
                            </View>

                        </View>
                    </View>
                    {/* doors*/}

                    {/* lights */}
                    <View style={{ flexDirection: "row", columnGap: 20, marginTop: 15, }}>

                        <View style={stylesheet.controllView1}>

                            <View>
                                <Text style={[stylesheet.headerText2, getTheme == "Light" ? null : { color: "white" }]}>LIGHT 01</Text>
                            </View>

                            <View style={{ flexDirection: "row", columnGap: 20, justifyContent: "center", alignItems: "center", position: "relative" }}>
                                <Switch
                                    trackColor={{ false: '#B0BEC5', true: '#4CAF50' }}
                                    thumbColor={isEnabled2 ? '#FFFFFF' : '#dfe5e8'}
                                    value={isEnabled2}
                                    onValueChange={

                                        async (value) => {
                                            setIsEnabled2(value);
                                            await AsyncStorage.setItem('isAutoWatering', JSON.stringify(value));

                                            sendMessage(
                                                {
                                                    light01: JSON.stringify(value),
                                                }
                                            );

                                        }
                                    }
                                />
                            </View>

                        </View>

                        <View style={stylesheet.controllView1}>

                            <View>
                                <Text style={[stylesheet.headerText2, getTheme == "Light" ? null : { color: "white" }]}>LIGHT 02</Text>
                            </View>

                            <View style={{ flexDirection: "row", columnGap: 20, justifyContent: "center", alignItems: "center", position: "relative" }}>
                                <Switch
                                    trackColor={{ false: '#B0BEC5', true: '#4CAF50' }}
                                    thumbColor={isEnabled ? '#FFFFFF' : '#dfe5e8'}
                                    value={isEnabled}
                                    onValueChange={

                                        async (value) => {
                                            setIsEnabled(value);
                                            await AsyncStorage.setItem('isAutoWatering', JSON.stringify(value));

                                            sendMessage(
                                                {
                                                    light02: JSON.stringify(value),
                                                }
                                            );

                                        }
                                    }
                                />
                            </View>

                        </View>
                    </View>

                    {/* lights */}

                </View>

                <View style={stylesheet.navigateView2}></View>

            </ScrollView>

            <View style={stylesheet.navigateView}>
                <Pressable style={{ flex: 1, alignItems: "center", justifyContent: "center", }} onPress={
                    () => {
                        router.push("/home");
                    }
                }>
                    <FontAwesome6 name={"house"} size={30} color={"black"} />
                    <Text style={{ flex: 1, fontSize: 14, }}>Home</Text>
                </Pressable>

                <Pressable style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                    <FontAwesome6 name={"door-open"} size={30} color={"#0D7C66"} />
                    <Text style={{ flex: 1, fontSize: 14, color: "#0D7C66" }}>Door</Text>
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

        image1: {
            width: "100%",
            height: 400,
            zIndex: 1,
            borderRadius: 20

        },
        mainView2: {
            padding: 15,
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
            rowGap: 10,
        },

        liveView: {
            justifyContent: "center",
            alignItems: "center",
            height: 100,
            width: "100%",
            marginBottom: 20,
            elevation: 4,

        },

        controllView: {
            height: 160,
            width: "45%",
            alignItems: "center",
            position: "relative",
            backgroundColor: "#f5faf6",
            borderRadius: 15,
            elevation: 20,
        },

        controllView1: {
            height: 160,
            width: "45%",
            // paddingHorizontal: 10,
            // justifyContent: "center",
            alignItems: "center",
            position: "relative",
            backgroundColor: "#f5faf6",
            borderRadius: 15,
            elevation: 10,
            backgroundColor: "green"

        },

        moveButton: {
            width: 50,
            height: 50,
            borderRadius: 100,
            backgroundColor: "white",
            elevation: 10,
            justifyContent: "center",
            alignItems: "center",
        },

        navigateView: {
            alignSelf: "center",
            justifyContent: "center",
            height: 70,
            width: "93%",
            // backgroundColor: "rgba(255, 255, 255, 0.56)",
            borderRadius: 10,
            flexDirection: "row",
            position: "absolute",
            bottom: 1,
            padding: 10
        },

        navigateView2: {
            height: 70,
            width: "100%",
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
            width: 30,
            borderRadius: 50,
            backgroundColor: "white",
            padding: 5,
            alignItems: "center",
            marginEnd: 10,
        },

        tempView2: {
            position: "absolute",
            zIndex: 2,
            top: 90,
            right: 5,
            flexDirection: "row",
            alignItems: "center",
            columnGap: 5
        },

        tempView3: {
            position: "absolute",
            zIndex: 2,
            bottom: 40,
            right: 10,
            flexDirection: "row",
            alignItems: "center",
            columnGap: 5
        },

        tempView4: {
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
            backgroundColor: "white",
            elevation: 10,
        },

        headerText: {
            fontFamily: "Fredoka-SemiBold",
            fontSize: 30,
            width: "90%",
            paddingStart: 120,
        },

        headerText1: {
            // fontFamily: "Fredoka-SemiBold",
            fontSize: 25,
            width: "90%",
            alignItems: "center",
            marginBottom: 33,
            marginTop: 20,
        },

        headerText2: {
            color: "white",
            fontSize: 25,
            width: "90%",
            alignItems: "center",
            marginBottom: 33,
            marginTop: 20,
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