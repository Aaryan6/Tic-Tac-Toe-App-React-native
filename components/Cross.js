import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Cross = () => {
  return (
    <View style={styles.cross}>
          <View style={styles.line1} />
          <View style={styles.line2} />
        </View>
  )
}

export default Cross

const styles = StyleSheet.create({
    cross: {
        position: "absolute",
        left: "48%",
      },
      line1: {
        width: 6,
        height: 100,
        backgroundColor: "white",
        transform: [
          {
            rotate: "45deg",
          },
        ],
        position: "absolute",
      },
      line2: {
        width: 6,
        height: 100,
        backgroundColor: "white",
        transform: [
          {
            rotate: "-45deg",
          },
        ],
        position: "absolute",
      },
})