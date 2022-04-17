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
        fontSize: 18,
        color: GRAY
    },
    arrowContainer: {
        height: 215,
        width: 215,
        borderWidth: 2,
        borderRadius: 215,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 30,
        marginTop: 10
    },
    toolTip: {
        fontSize: 18,
        textAlign: "center",
        width: 200,
        color: GRAY
    },
    clueImage: {
        width: 200,
        height: 200,
        margin: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5
    },
    questText: {
        textAlign: 'center',
        width: 200,
        fontSize: 18,
        color: GRAY,
        margin: 10
    },
    refreshButton: {
        borderWidth: 1,
        padding: 10,
        borderColor: GRAY,
        height: 60,
        width: 150,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 30,
        borderRadius: 4
    },
    buttonText: {
        color: '#007AFF',
        fontSize: 24,
        fontWeight: 'bold'
    },
    disabledButtonText: {
        color: GRAY,
        fontSize: 24,
    }
})