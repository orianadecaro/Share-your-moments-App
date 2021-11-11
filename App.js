import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Alert,Platform } from 'react-native'; //componentes
import * as ImagePicker from 'expo-image-picker'
import * as sharing from 'expo-sharing';
import uploadAnonymousFilesAsync from 'anonymous-files'


export default function App() {

  const [selectedImage, setSelectedImage] = useState(null)

  let openImagePickerAsync = async () => {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync(); // pedir permiso al usuario

    if (permissionResult.granted === false) {
      alert('Permission to access camera is required');
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync();
    if (pickerResult.cancelled === true) {
      return;
    }

    if(Platform.OS === 'web'){
      let remoteUri = await uploadAnonymousFilesAsync(pickerResult.uri);
      setSelectedImage({ localUri: pickerResult.uri, remoteUri });
    }else{
       setSelectedImage({ localuri: pickerResult.uri });
    }

   
  }

  const openShareDialog = async () => {
    if (!(await sharing.isAvailableAsync())) {
      alert(`The image is available for sharing at: ${selectedImage.remoteUri}}`);
      return;
    }

    await sharing.shareAsync(selectedImage.localuri);
  }


  return (
    <View style={styles.container}>
      <Text style={styles.title}>  Share your moments♥!</Text>
      <StatusBar style="auto" />
      <TouchableOpacity
        onPress={openImagePickerAsync}
      >
        <Image
          source={{ uri: selectedImage !== null ? selectedImage.localuri : 'https://i.picsum.photos/id/990/200/200.jpg?hmac=aKX7eTSZXBAWNV5wrvlgko5ESRbbvaAcbu6QmqEkXtE' }}
          //sourece ={image}
          style={styles.image}
        />
      </TouchableOpacity>
      {
        selectedImage ?
          <TouchableOpacity
            onPress={openShareDialog}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Share</Text>
          </TouchableOpacity>
          : (<View />)
      }
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafad2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontSize: 40 },
  image: { height: 200, width: 200, borderRadius: 50, resizeMode: 'contain' },
  button: { backgroundColor: '#dda0dd', padding: 7, marginTop: 10 },
  buttonText: { color: '#fff', fontSize: 20 }

});




//boton standar-- usar button. TouchOpacity -- para boton personalizado