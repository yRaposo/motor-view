import React, { useRef, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Text, SafeAreaView, TouchableHighlight, TouchableOpacity, Alert } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';

export default function HomeScreen() {
    const [permission, requestPermission] = useCameraPermissions();
    const [mediaLibraryPermission, requestMediaLibraryPermission] = MediaLibrary.usePermissions();
    const [facing, setFacing] = useState("back");
    const cameraRef = useRef(null);

    function toggleCameraFacing() {
        setFacing(current => (current === "back" ? "front" : "back"));
    }

    async function takePicture() {
        if (cameraRef.current) {
            try {
                // Tira a foto
                const photo = await cameraRef.current.takePictureAsync({
                    quality: 0.8,
                    base64: false,
                    skipProcessing: false,
                });

                console.log('Foto tirada:', photo.uri);

                // Salva na pasta personalizada do app
                await saveToCustomFolder(photo);

                // Opcional: também salvar na galeria
                await saveToGallery(photo);

            } catch (error) {
                console.error('Erro ao tirar foto:', error);
                Alert.alert('Erro', 'Não foi possível tirar a foto');
            }
        }
    }

    // Salvar em pasta personalizada
    async function saveToCustomFolder(photo) {
        try {
            const timestamp = Date.now();
            const customFolderPath = `${FileSystem.documentDirectory}motor_images/`;

            // Cria a pasta se não existir
            const dirInfo = await FileSystem.getInfoAsync(customFolderPath);
            if (!dirInfo.exists) {
                await FileSystem.makeDirectoryAsync(customFolderPath, { intermediates: true });
            }

            const fileName = `scan_${timestamp}.jpg`;
            const fileUri = `${customFolderPath}${fileName}`;

            await FileSystem.moveAsync({
                from: photo.uri,
                to: fileUri,
            });

            console.log('Imagem salva em pasta personalizada:', fileUri);
            Alert.alert('Sucesso', `Imagem salva em: motor_images/${fileName}`);
        } catch (error) {
            console.error('Erro ao salvar em pasta personalizada:', error);
            Alert.alert('Erro', 'Não foi possível salvar a imagem');
        }
    }

    // Salvar na galeria do dispositivo
    async function saveToGallery(photo) {
        try {
            // Solicita permissão da galeria se não tiver
            if (!mediaLibraryPermission?.granted) {
                const { granted } = await requestMediaLibraryPermission();
                if (!granted) {
                    Alert.alert('Erro', 'Permissão da galeria é necessária');
                    return;
                }
            }

            // Salva na galeria
            const asset = await MediaLibrary.createAssetAsync(photo.uri);
            const album = await MediaLibrary.getAlbumAsync('Motor View');

            if (album == null) {
                await MediaLibrary.createAlbumAsync('Motor View', asset, false);
            } else {
                await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
            }

            console.log('Imagem salva na galeria:', asset.uri);
            Alert.alert('Sucesso', 'Imagem salva na galeria no álbum "Motor View"');
        } catch (error) {
            console.error('Erro ao salvar na galeria:', error);
            Alert.alert('Erro', 'Não foi possível salvar na galeria');
        }
    }

    if (!permission) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <StatusBar style="auto" />
                <View style={styles.container}>
                    <Text style={styles.title}>Motor View</Text>
                    <Text style={styles.desc}>Carregando...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (!permission.granted) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <StatusBar style="auto" />
                <View style={styles.container}>
                    <Text style={styles.title}>Motor View</Text>
                    <Text style={styles.desc}>Ao clicar em iniciar escaneamento, você concorda em permitir o uso da sua câmera.</Text>
                    <TouchableHighlight style={styles.button} onPress={requestPermission}>
                        <Text style={styles.btnText}>Iniciar Escaneamento</Text>
                    </TouchableHighlight>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.cameraSafeArea}>
            <StatusBar style="auto" />
            <CameraView
                style={styles.camera}
                facing={facing}
                ref={cameraRef}
            >
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.CameraButton} onPress={toggleCameraFacing}>
                        <Text style={styles.buttonText}>Trocar Câmera</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.CameraButton} onPress={takePicture}>
                        <Text style={styles.buttonText}>Tirar Foto</Text>
                    </TouchableOpacity>
                </View>
            </CameraView>
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
    cameraSafeArea: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#000",
    },
    camera: {
        flex: 1,
        width: "100%",
    },
    buttonContainer: {
        flex: 1,
        flexDirection: "row",
        backgroundColor: "transparent",
        margin: 64,
    },
    CameraButton: {
        flex: 1,
        alignSelf: "flex-end",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        padding: 15,
        margin: 5,
        borderRadius: 5,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "white",
    },
});