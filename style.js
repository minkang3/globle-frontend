import { StyleSheet } from "react-native";

const GRAY = '#999';

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
        fontSize: 16,
        color: GRAY
    },
    arrowContainer: {
        height: 215,
        width: 215,
        borderWidth: 2,
        borderRadius: 215,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 100,
        marginTop: 10
    },
    toolTip: {
        fontSize: 16,
        textAlign: "center",
        width: 200,
        color: GRAY
    },
    clueImage: {
        width: 200,
        height: 200,
        margin: 10,
        borderWidth: 1,
        borderColor: 'black'
    }
})