import React from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Text, SafeAreaView, TouchableHighlight } from "react-native";
import { useCameraPermissions } from "expo-camera";

export default function HomeScreen() {
    const [permission, requestPermission] = useCameraPermissions();
    
    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar style="auto" />
            <View style={styles.container}>
                <Text style={styles.title}>Motor View</Text>
                <Text style={styles.desc}>Ao clicar em iniciar escaneamento, você concorda em permitir o uso da sua câmera.</Text>
                <TouchableHighlight style={styles.button} onPress={() => console.log("Iniciar escaneamento")}>
                    <Text style={styles.btnText}>Iniciar Escaneamento</Text>
                </TouchableHighlight>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#fff",
    },
    container: {
        marginTop: 40,
        marginHorizontal: 20,
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        fontSize: 30,
        fontWeight: "bold",
        color: "#333",
    },
    desc: {
        fontSize: 16,
        color: "#666",
        textAlign: "center",
        marginTop: 10,
    },
    button: {
        marginTop: 20,
        backgroundColor: "#007BFF",
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 5,
    },
    btnText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});