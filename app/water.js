import { registerRootComponent } from "expo";
import { LinearGradient } from "expo-linear-gradient";
import { Alert, Animated, ImageBackground, Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from "react-native";
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

export default function water() {

    const [getColor1, setColor1] = useState(false);

    const [getTheme, setTheme] = useState("");

    const [isEnabled, setIsEnabled] = useState();

    const [level, setLevel] = useState(0);

    NavigationBar.setBackgroundColorAsync(getTheme == "Light" ? "white" : "white");
    NavigationBar.setBorderColorAsync(getTheme == "Light" ? "white" : "white");
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
            // Load the saved switch state
            AsyncStorage.getItem('isAutoWatering').then(value => {
                if (value !== null) {
                    setIsEnabled(JSON.parse(value));
                }
            });

            // set water level
            AsyncStorage.getItem('waterLevel').then(value => {
                if (value !== null) {
                    setLevel(value);
                }
            });

            // async function setupWaterLevel() {
            //     setLevel(await AsyncStorage.getItem("waterLevel"));
            // }

            async function setupTheme() {
                setTheme(await AsyncStorage.getItem("theme"));
            }

            // setupWaterLevel();
            setupTheme();
            console.log("theme and auto watering setup");
        }, []
    );

    //handleMessage
    async function handleMessage(message) {

        if (message == "ESP32") {
            await AsyncStorage.setItem('isAutoWatering', JSON.stringify(false));
            setIsEnabled(false);

        } else {
            let json = JSON.parse(message);

            if (json.waterLevel != null) {
                setLevel(json.waterLevel);
                await AsyncStorage.setItem('waterLevel', JSON.stringify(json.waterLevel));
            }
        }

        console.log("Message from WebSocket:", message);

        // if (message == 1) {
        //     setIsEnabled(true);
        // } else if (message == 0) {
        //     setIsEnabled(false);
        // }

    }

    //use Web Soket
    const { sendMessage, openWebSocket } = WebSocketService(handleMessage);

    useEffect(
        () => {
            sendMessage(
                {
                    currentPage: 3
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
    const day = require("../assets/images/greenh.jpg");
    const night = require("../assets/images/greenh.jpg");

    return (
        <MenuProvider>
            <LinearGradient colors={getTheme == "Light" ? ['white', 'white',] : ['#0a131a', '#1e1e1e']} style={stylesheet.view1}>

                <StatusBar backgroundColor={getTheme == "Light" ? "white" : "white"} style={getTheme == "Light" ? null : "light"} />

                <View style={[stylesheet.view2, getTheme == "Light" ? null : { backgroundColor: "white", shadowColor: "lightblue", elevation: 80 }]}>

                    <Text style={[stylesheet.headerText, getTheme == "Light" ? null : { color: "white" }]}>Watering</Text>

                    <Menu>
                        <MenuTrigger children={<FontAwesome6 name={"ellipsis-vertical"} size={25} color={getTheme == "Light" ? "black" : "white"} />}
                            style={{ alignSelf: "flex-end", width: 30, alignItems: "center" }}
                        />
                        <MenuOptions optionsContainerStyle={[stylesheet.headerMenuOptionsLight, getTheme == "Dark" ? { backgroundColor: "#1f2c40" } : null]}  >

                            <MenuOption style={stylesheet.menuOptionView} onSelect={
                                async () => {
                                    getTheme == "Light" ?
                                        [setTheme("Dark"),
                                        await AsyncStorage.setItem("theme", "Dark")]
                                        :
                                        [setTheme("Light"),
                                        await AsyncStorage.setItem("theme", "Light")]
                                }
                            }>
                                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>

                                    <Text style={[{ fontSize: 15, color: "#535758", fontWeight: "bold" }, getTheme == "Light" ? null : { color: "white" }]}>  Change Theme To : </Text>
                                    {getTheme == "Light" ?
                                        <FontAwesome6 name={"moon"} size={16} color={"#535758"} /> :
                                        <FontAwesome6 name={"sun"} size={16} color={"white"} />
                                    }

                                </View>
                            </MenuOption>
                            <MenuOption onSelect={
                                async () => {
                                    await AsyncStorage.removeItem("user");

                                    router.replace("/");
                                }
                            }>
                                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", paddingRight: 10 }}>
                                    <Text style={{ fontSize: 15, color: "#a80000", fontWeight: "bold", marginEnd: 10 }}>Log Out</Text>
                                    <FontAwesome6 name={"right-from-bracket"} size={22} color={"#a80000"} />
                                </View>
                            </MenuOption>

                        </MenuOptions>
                    </Menu>

                </View>

                <ScrollView>

                    <View style={stylesheet.mainView2}>

                        <View style={{ width: "100%" }}>
                            <View style={stylesheet.dailyView}>

                                <View style={[stylesheet.waterContainer, getColor1 ? { backgroundColor: "rgba(76, 145, 83, 1)" } : null]}>

                                    <Pressable style={[stylesheet.levelView, getColor1 ? { backgroundColor: "rgba(76, 145, 83, 1)" } : null]}
                                        onTouchStart={
                                            ()=>{
                                                setColor1(true);
                                                sendMessage(
                                                    {
                                                        item: "water",
                                                        value:"start"
                                                    }
                                                );
                                            }
                                        }
                                        onTouchEnd={
                                            ()=>{
                                                setColor1(false);
                                                sendMessage(
                                                    {
                                                        item: "water",
                                                        value:"stop"
                                                    }
                                                );
                                            }
                                        }> 
                                        <Text style={{ fontSize: 35 }}>{level}%</Text>
                                        <Text style={{ fontSize: 15, color:"gray"}}>Moisture Level</Text>
                                    </Pressable>

                                </View>

                            </View>
                        </View>

                        <View style={stylesheet.switchView}>
                            <Text style={{ flex: 1, fontSize: 22, color: "black" }}>Auto</Text>
                            <Switch style={{ transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }] }}
                                trackColor={{ false: '#B0BEC5', true: '#4CAF50' }}
                                thumbColor={isEnabled ? '#FFFFFF' : '#dfe5e8'}
                                value={isEnabled}
                                onValueChange={

                                    async (value) => {
                                        setIsEnabled(value);
                                        await AsyncStorage.setItem('isAutoWatering', JSON.stringify(value));

                                        sendMessage(
                                            {
                                                autoWatering: JSON.stringify(value),
                                            }
                                        );

                                    }
                                }
                            />
                        </View>

                    </View>

                    {/* <View style={stylesheet.navigateView2}></View> */}

                </ScrollView>

                <View style={stylesheet.navigateView}>
                    <Pressable style={{ flex: 1, alignItems: "center", justifyContent: "center", }} onPress={
                        () => {
                            router.push("/home");
                        }
                    }>
                        <FontAwesome6 name={"house"} size={30} color={"black"} />
                        <Text style={{ flex: 1, fontSize: 14,}}>Home</Text>
                    </Pressable>

                    <Pressable style={{ flex: 1, alignItems: "center", justifyContent: "center" }}onPress={
                        () => {
                            router.push("/door");
                        }
                    }>
                        <FontAwesome6 name={"door-open"} size={30} />
                        <Text style={{ flex: 1, fontSize: 14, }}>Door</Text>
                    </Pressable>
                    
                    <Pressable style={{ flex: 1, alignItems: "center", justifyContent: "center" }} onPress={
                        () => {
                            router.push("/water");
                        }
                    }>
                        <FontAwesome6 name={"droplet"} size={30} color={"#0D7C66"} />
                        <Text style={{ flex: 1, fontSize: 14,color :"#0D7C66" }}>Water</Text>
                    </Pressable>
                </View>

            </LinearGradient>
        </MenuProvider>
    );
}

const stylesheet = StyleSheet.create(
    {

        waterButton: {
            // width: "45%",
            flex: 1,
            borderRadius: 100,
            height: 110,
            justifyContent: "center",
            alignItems: "center",
            elevation: 15,
            shadowColor: "#8001cb",
        },

        waterContainer: {
            width: 200,
            height: 200,
            borderRadius: 2000,
            overflow: 'hidden',
            alignSelf: "center",
            alignItems: "center",
            justifyContent: "center",
            elevation: 30,
            shadowColor:"#0D7C66",
            backgroundColor: "white",
            marginTop: 50
        },
        water: {
            position: 'absolute',
            bottom: 0,
            width: '100%',
            backgroundColor: '#74ccf4', // Water color
        },

        levelView: {
            position: 'absolute',
            width: '70%',
            backgroundColor: '#ffffff',
            borderRadius: 50,
            alignItems: "center",
            justifyContent: "center",
        },

        mainView2: {
            paddingHorizontal: 15,
            paddingVertical: 5,
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
            rowGap: 10,
        },

        switchView: {
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
            height: 60,
            width: "100%",
            borderRadius: 10,
            backgroundColor: "white",
            paddingHorizontal: 10,
            marginTop: 20,
            marginStart: 70,
            marginEnd: 50
        },

        dailyView: {
            // height: 200,
            width: "100%",
            paddingHorizontal: 10,
            paddingBottom: 20,

        },

        navigateView: {
            alignSelf: "center",
            justifyContent: "center",
            height: 70,
            width: "93%",
            // backgroundColor: "rgba(255, 255, 255, 0.56)",
            // borderRadius: 10,
            flexDirection: "row",
            position: "absolute",
            padding: 10,
            // marginVertical: 10,
            bottom: 1,
        },

        // navigateView2: {
        //     height: 70,
        //     width: "100%",
        // },

        image1: {
            marginTop: 50,
            width: "100%",
            height: "85%",
            alignSelf: "center",
            zIndex: 1,
            // borderRadius: 40,
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
            // borderBottomColor: "grey",
            // borderBottomWidth: 1,
            backgroundColor: "white",
            elevation: 10,
        },

        headerText: {
            fontFamily: "Fredoka-SemiBold",
            fontSize: 30,
            width: "90%",
            paddingStart: 120,
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