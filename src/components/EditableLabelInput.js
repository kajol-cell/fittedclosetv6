import React, {useState, useRef, useEffect} from 'react';
import {
    TextInput,
    Text,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import {IconButton} from 'react-native-paper';
import {useSelector} from "react-redux";
import {selectMyCloset} from "../utils/selectors";

const EditableLabelInput = ({
                                value = '',
                                placeholder = 'Enter a name',
                                onChangeText,
                                onSave,
                            }) => {
    const isMyCloset = useSelector(selectMyCloset)
    const [editing, setEditing] = useState(!value);
    const [text, setText] = useState(value);
    const inputRef = useRef();

    const handleSave = () => {
        setEditing(false);
        if (text !== value) {
            onSave?.(text.trim());
        }
    };
    const handleChangeText = (text) => {
        setText(text);
        onChangeText?.(text.trim());
    }

    useEffect(() => {
        console.log('Editable Label Value changed : ', value);
            setText(value);
        },
        [value]);

    return (
        <View style={styles.container}>
            {isMyCloset && editing ? (
                <View style={styles.editingRow}>
                    <TextInput
                        ref={inputRef}
                        style={styles.input}
                        value={text}
                        placeholder={placeholder}
                        onChangeText={handleChangeText}
                        onBlur={handleSave}
                        autoFocus
                    />
                    <IconButton
                        icon="check"
                        size={28}
                        onPress={handleSave}
                        style={styles.checkIcon}
                    />
                </View>
            ) : (
                <TouchableOpacity
                    style={styles.readonlyContainer}
                    onPress={() => setEditing(true)}>
                    <Text style={styles.readonlyText}>{text}</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 10,
    },
    editingRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    readonlyContainer: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        paddingVertical: 10,
        paddingHorizontal: 12,
        backgroundColor: '#f2f2f2',
    },
    readonlyText: {
        fontSize: 16,
        color: '#333',
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#999',
        borderRadius: 6,
        paddingVertical: 10,
        paddingHorizontal: 12,
        fontSize: 16,
        backgroundColor: '#fff',
        color: '#000',
    },
    checkIcon: {
        marginLeft: 4,
    },
});

export default EditableLabelInput;
