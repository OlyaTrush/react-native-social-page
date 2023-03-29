import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { AntDesign } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import { useContext } from "react";
import { Context } from "../../context";
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

import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import { useRef } from "react";
import {
  collection,
  addDoc,
  doc,
  onSnapshot,
  getFirestore,
  updateDoc,
  increment,
} from "firebase/firestore";

import { getDatabase, ref, set } from "firebase/database";

import { fsbase } from "../../firebase/config";

import takeDate from "../../utils/takeDate";

import Comment from "../../components/Comment/Comment";
import { async } from "@firebase/util";

export default function CommentsScreen({ navigation, route }) {
  const scrollRef = useRef(null);

  const { postId, image } = route.params;
  const { login, userId } = useSelector((state) => state.auth);

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [comment, setComment] = useState("");
  const [allComments, setAllcomments] = useState([]);
  const [dimensions, setdimensions] = useState(
    Dimensions.get("window").width - 16 * 2
  );
  const [screenHeight, setScreenHeight] = useState(
    Dimensions.get("window").height
  );

  const { currentPath, setCurrentPath } = useContext(Context);

  useEffect(() => {
    fetchComents();
  }, []);

  useEffect(() => {
    setCurrentPath(route.name);
    const onChange = () => {
      const height = Dimensions.get("window").height;
      const width = Dimensions.get("window").width - 16 * 2;
      setdimensions(width);
      setScreenHeight(height);
    };
    const dimensionsHandler = Dimensions.addEventListener("change", onChange);
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      setCurrentPath(null);
      dimensionsHandler.remove();
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const fetchComents = async () => {
    try {
      const dbRef = doc(fsbase, "posts", postId);
      onSnapshot(collection(dbRef, "comments"), (docSnap) => {
        const currentComments = docSnap.docs.map((doc) => ({ ...doc.data() }));
        const sortedComments = currentComments.sort(
          (a, b) => b.created < a.created
        );
        setAllcomments(sortedComments);
      });
    } catch (error) {
      console.log(`getAllComents.error`, error);
    }
  };

  const updateCommentCounter = async () => {
    const db = getFirestore();
    await updateDoc(doc(db, "posts", postId), {
      comments: increment(1),
    });
  };

  const sendCommentToServer = async () => {
    const date = new Date().toLocaleDateString();
    const time = new Date()
      .toLocaleTimeString()
      .split(":")
      .splice(0, 2)
      .join(":");
    const created = Date.now().toString();
    const uniqueCommentId = uuidv4();
    try {
      const dbRef = doc(fsbase, "posts", postId);
      await addDoc(collection(dbRef, "comments"), {
        login,
        userId,
        date,
        time,
        commentId: uniqueCommentId,
        created,
        comment,
      });
    } catch (error) {
      console.log("error.sendCommentToServer", error.message);
    }
  };

  const submitForm = async () => {
    await sendCommentToServer();
    await updateCommentCounter();
    setComment("");
    Keyboard.dismiss();
    setKeyboardVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={{ width: dimensions }}>
        {!isKeyboardVisible && (
          <>
            <View style={styles.postImgThmb}>
              <Image
                source={{ uri: route.params.image, height: 300, width: "100%" }}
                style={styles.postImg}
              />
            </View>
          </>
        )}
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ ...styles.commentsList, height: screenHeight - 500 }}
        ></ScrollView>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : ""}>
          <View
            style={{
              ...styles.form,
              paddingBottom: isKeyboardVisible ? 10 : 0,
              position: "absolute",
              bottom: 0,
            }}
          >
            <View style={{ ...styles.inputThmb, marginTop: "auto" }}>
              <TextInput
                placeholder="Комментировать..."
                value={comment.comment}
                style={styles.input}
                textAlign={"left"}
                onFocus={() => setKeyboardVisible(true)}
                onChangeText={(value) =>
                  setComment((prevState) => ({
                    ...prevState,
                    comment: value,
                  }))
                }
              />
              <TouchableOpacity
                activeOpacity={0.6}
                style={styles.subBtn}
                onPress={() => submitForm()}
              >
                <AntDesign name="arrowup" size={14} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 32,
    paddingBottom: 16,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },

  postImgThmb: {
    width: "100%",
    marginBottom: 32,
  },
  postImg: {
    width: "100%",
    borderRadius: 8,
    marginBottom: 8,
  },
  commentsList: {
    marginBottom: 31,
  },
  comment: {
    flexDirection: "row",
    marginBottom: 24,
    justifyContent: "center",
  },
  commentRevers: { flexDirection: "row-reverse" },
  imgThmb: {
    marginRight: 15,
  },
  imgThmbReverse: {
    marginRight: 0,
    marginLeft: 15,
  },
  img: {
    width: 28,
    height: 28,
    borderRadius: 50,
  },
  commentThmb: {
    padding: 16,
    borderTopRightRadius: 6,

    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
    backgroundColor: "rgba(0, 0, 0, 0.03)",
  },
  commentThmbRevers: {
    borderTopRightRadius: 0,
    borderTopLeftRadius: 6,
  },
  text: {
    marginBottom: 8,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "400",
    color: "#212121",
    fontFamily: "Roboto-Regular",
  },
  date: {
    textAlign: "right",
    fontSize: 10,
    lineHeight: 12,
    fontWeight: "400",
    color: "#BDBDBD",
    fontFamily: "Roboto-Regular",
  },
  dateReverse: {
    textAlign: "left",
  },

  inputThmb: {
    marginTop: "auto",
    position: "relative",
  },
  input: {
    padding: 8,
    paddingLeft: 16,
    fontSize: 16,
    lineHeight: 19,
    fontWeight: "400",
    backgroundColor: "#F6F6F6",
    borderRadius: 100,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    color: "#BDBDBD",
    fontFamily: "Roboto-Regular",
  },
  subBtn: {
    position: "absolute",
    right: 8,
    bottom: 6,

    alignItems: "center",
    justifyContent: "center",
    width: 34,
    height: 34,
    borderRadius: 50,
    backgroundColor: "#FF6C00",
    borderColor: "transparent",
  },
});
