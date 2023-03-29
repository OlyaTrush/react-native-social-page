import {
  Text,
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Image,
  Dimensions,
  TouchableOpacity,
  TextInput,
  Keyboard,
  Platform,
} from "react-native";

function Comment({ comment, login, date, time }) {
  return (
    <View>
      <View
        style={{
          marginTop: 32,
          flexDirection: "row",
        }}
      >
        <View style={styles.comment}>
          <Text style={{ fontSize: 16 }}>User: {login}</Text>
          <Text>{comment}</Text>
          <Text style={styles.date}>
            {date} | {time}
          </Text>
        </View>
      </View>
    </View>
  );
}

export default Comment;

const styles = StyleSheet.create({
  comment: {
    marginLeft: 16,

    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "rgba(0, 0, 0, 0.03)",
    backgroundColor: "rgba(0, 0, 0, 0.03)",
  },
  date: {
    fontSize: 12,
    textAlign: "right",
    color: "grey",
  },
});
