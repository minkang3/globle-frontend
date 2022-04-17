import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 48,
    },
    primary: {
        fontSize: 48
    },
    subtitle: {
        fontSize: 16
    },
    arrow: {
        transform: [{rotate: '-90deg'}],
        borderColor: 'black',
        borderWidth: 2,
        marginBottom: 100,
        height:  200,
        width: 200,
        borderRadius: 100
    }
})