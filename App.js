import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Pressable,
  Alert,
  TouchableOpacity,
} from "react-native";
import Cross from "./components/Cross";

const emptyMap = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""],
];

const copyArray = (original) => {
  const copy = original.map((arr) => {
    return arr.slice();
  });
  return copy;
};

export default function App() {
  const [mymap, setMymap] = useState(emptyMap);

  const [currentTurn, setCurrentTurn] = useState("x");
  const [botMode, setBotMode] = useState(false);
  const [gameLevel, setGameLevel] = useState("easy");

  // Set the currentTurn
  const handleBotTurn = (cond) => {
    setBotMode(cond);
  };
  // Set gameLevel
  const handleGameLevel = (cond) => {
    setGameLevel(cond);
  };
  // Bot turn
  useEffect(() => {
    if (botMode) {
      if (currentTurn === "o") {
        botTurn();
      }
    }
  }, [currentTurn]);

  // Check winning and Tie state
  useEffect(() => {
    const winner = getWinner(mymap);
    if (winner) {
      gameWon(winner);
    } else {
      checkTieState();
    }
  }, [mymap]);

  // Funtion of pressing
  const onPressCell = (rowIndex, columnIndex) => {
    // set x or o
    if (mymap[rowIndex][columnIndex] !== "") {
      Alert.alert("Already Pressed", "Press another place");
      return;
    }
    setMymap((prevMap) => {
      const updatedMap = [...prevMap];
      updatedMap[rowIndex][columnIndex] = currentTurn;
      return updatedMap;
    });

    // change turn
    setCurrentTurn(currentTurn === "x" ? "o" : "x");
  };

  const getWinner = (winnerMap) => {
    // check winning condition for row
    for (let row = 0; row < 3; row++) {
      let isRowXwinner = winnerMap[row].every((cell) => cell === "x");
      let isRowOwinner = winnerMap[row].every((cell) => cell === "o");
      if (isRowXwinner) {
        return "x";
      }
      if (isRowOwinner) {
        return "o";
      }

      // check column winnig condition
      let isColXwinner = true;
      let isColOwinner = true;

      for (let col = 0; col < 3; col++) {
        if (winnerMap[col][row] !== "x") {
          isColXwinner = false;
        }
        if (winnerMap[col][row] !== "o") {
          isColOwinner = false;
        }
      }
      if (isColXwinner) {
        return "x";
      }
      if (isColOwinner) {
        return "o";
      }
    }

    // check diagonal winning condition
    let isDiagonalX1Winning = true;
    let isDiagonalX2Winning = true;
    let isDiagonalO1Winning = true;
    let isDiagonalO2Winning = true;

    for (let i = 0; i < 3; i++) {
      if (winnerMap[i][i] !== "x") {
        isDiagonalX1Winning = false;
      }
      if (winnerMap[i][2 - i] !== "x") {
        isDiagonalX2Winning = false;
      }
      if (winnerMap[i][i] !== "o") {
        isDiagonalO1Winning = false;
      }
      if (winnerMap[i][2 - i] !== "o") {
        isDiagonalO2Winning = false;
      }
    }

    if (isDiagonalX1Winning || isDiagonalX2Winning) {
      return "x";
    }
    if (isDiagonalO1Winning || isDiagonalO2Winning) {
      return "o";
    }
  };

  // Display a message of winner
  const gameWon = (player) => {
    setTimeout(() => {
      Alert.alert(
        "Hurrreee... ",
        `Player ${player === "x" ? "X" : "O"} is Winner`,
        [
          {
            text: "Restart",
            onPress: resetGame(),
          },
        ]
      );
    }, 500);
  };

  // Tie condition
  const checkTieState = () => {
    if (!mymap.some((row) => row.some((cell) => cell === ""))) {
      setTimeout(() => {
        Alert.alert("It's a tie", "Tie", [
          {
            text: "Restart",
            onPress: resetGame,
          },
        ]);
      }, 500);
    }
  };

  // Restart game
  const resetGame = () => {
    setMymap([
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ]);
    setCurrentTurn("x");
  };

  // Bot player
  const botTurn = () => {
    // Find possible options for bot
    const possibleOptions = [];
    mymap.forEach((row, rowIndex) => {
      row.forEach((cell, columnIndex) => {
        if (cell === "") {
          possibleOptions.push({ row: rowIndex, col: columnIndex });
        }
      });
    });

    let choosenOption;

    // Attacking state
    if (gameLevel === "hard" || gameLevel === "medium") {
      if (gameLevel !== "medium") {
        possibleOptions.forEach((possibleOption) => {
          const mapCopy = copyArray(mymap);
          mapCopy[possibleOption.row][possibleOption.col] = "o";
          const winner = getWinner(mapCopy);
          if (winner === "o") {
            choosenOption = possibleOption;
          }
        });
      }

      // Defending state
      if (!choosenOption) {
        possibleOptions.forEach((possibleOption) => {
          const mapCopy = copyArray(mymap);
          mapCopy[possibleOption.row][possibleOption.col] = "x";
          const winner = getWinner(mapCopy);
          if (winner === "x") {
            choosenOption = possibleOption;
          }
        });
      }
    }

    // Choose random position
    if (!choosenOption) {
      choosenOption =
        possibleOptions[Math.floor(Math.random() * possibleOptions.length)];
    }
    if (choosenOption) {
      onPressCell(choosenOption.row, choosenOption.col);
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={require("./assets/bg.jpeg")} style={styles.bg} />

      <View style={styles.topButtons}>
        <Pressable
          onPress={() => handleBotTurn(false)}
          style={[styles.optionButton, { opacity: botMode ? 1 : 0.6 }]}
        >
          <Text style={styles.optionButtonText}>Play with Friend</Text>
        </Pressable>
        <Pressable
          onPress={() => handleBotTurn(true)}
          style={[styles.optionButton, { opacity: botMode ? 0.6 : 1 }]}
        >
          <Text style={styles.optionButtonText}>Play with Computer</Text>
        </Pressable>
      </View>

      <View style={styles.bottomButtons}>
        <View style={styles.modeOptions}>
          <Pressable
            onPress={() => handleGameLevel("easy")}
            style={[
              styles.modeOption,
              { opacity: gameLevel === "easy" && botMode ? 0.6 : 1 },
            ]}
          >
            <Text style={styles.modeOptionText}>Easy</Text>
          </Pressable>
          <Pressable
            onPress={() => handleGameLevel("medium")}
            style={[
              styles.modeOption,
              { opacity: gameLevel === "medium" && botMode ? 0.6 : 1 },
            ]}
          >
            <Text style={styles.modeOptionText}>Medium</Text>
          </Pressable>
          <Pressable
            onPress={() => handleGameLevel("hard")}
            style={[
              styles.modeOption,
              { opacity: gameLevel === "hard" && botMode ? 0.6 : 1 },
            ]}
          >
            <Text style={styles.modeOptionText}>Hard</Text>
          </Pressable>
        </View>
        <TouchableOpacity onPress={resetGame} style={styles.restartButton}>
          <Text style={styles.restartButtonText}>Restart</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.map}>
        {mymap.map((row, rowIndex) => (
          <View key={`row-${rowIndex}`} style={styles.row}>
            {row.map((cell, columnIndex) => (
              <Pressable
                key={`row-${rowIndex}_col=${columnIndex}`}
                style={styles.cell}
                onPress={() => onPressCell(rowIndex, columnIndex)}
              >
                {cell === "x" && <Cross />}
                {cell === "o" && <View style={styles.circle} />}
              </Pressable>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  bg: {
    width: "100%",
    height: "100%",
    position: "absolute",
    resizeMode: "contain",
  },
  map: {
    width: "100%",
    borderColor: "transparent",
    borderWidth: 3,
    aspectRatio: 1,
    marginTop: 50,
    padding: 1,
  },
  circle: {
    borderWidth: 5,
    borderColor: "#ffffff",
    width: 90,
    height: 90,
    borderRadius: 50,
    marginTop: 10,
    marginLeft: 10,
    position: "absolute",
  },
  row: {
    flex: 1,
    flexDirection: "row",
  },
  cell: {
    flex: 1,
    width: 100,
    height: 100,
  },
  topButtons: {
    position: "absolute",
    top: "7%",
    width: "100%",
  },
  optionButton: {
    backgroundColor: "#3366ee",
    marginVertical: 10,
    marginHorizontal: 30,
    borderRadius: 5,
  },
  optionButtonText: {
    color: "#fff",
    textAlign: "center",
    paddingVertical: 12,
    fontWeight: "bold",
    fontSize: 16,
  },
  bottomButtons: {
    position: "absolute",
    bottom: "4%",
    width: "100%",
  },
  modeOptions: {
    flexDirection: "row",
    justifyContent: "center",
  },
  modeOption: {
    backgroundColor: "#f57a4b",
    marginHorizontal: 10,
    borderRadius: 5,
    fontWeight: "bold",
  },
  modeOptionText: {
    paddingHorizontal: 25,
    paddingVertical: 10,
    color: "#ffffff",
    fontWeight: "bold",
  },
  restartButton: {
    backgroundColor: "#3366ee",
    borderRadius: 5,
    marginHorizontal: 30,
    marginTop: 20,
  },
  restartButtonText: {
    color: "#ffffff",
    paddingVertical: 10,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
});
