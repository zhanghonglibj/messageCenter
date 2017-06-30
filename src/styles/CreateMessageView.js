import {StyleSheet} from 'react-native';

 export default StyleSheet.create({
    messageHead:{
         flexDirection: 'row', 
         height: 50,
         borderBottomWidth: 1, 
         borderBottomColor: '#ccc', 
         alignItems: 'center', 
         backgroundColor: '#39babd'
     },
     messageTitile:{ 
         flex: 5, 
         textAlign: 'left'
    },
    flex:{ 
        flex: 1 
    },
    messageContent:{ 
        marginLeft: 10, 
        marginTop: 10, 
        marginRight: 10, 
        flexDirection: 'column'
    },
    messageBorderBottom:{ 
        flexDirection: 'row', 
        alignItems: 'center', 
        borderBottomWidth: 1, 
        borderBottomColor: '#ddd' 
    },
    messageText:{ 
        fontSize: 16, 
        textAlign: 'center'
    },
    messageBody:{ 
        flex: 1, 
        borderColor: 'gray', 
        borderLeftWidth: 0, 
        borderRightWidth: 0, 
        borderBottomWidth: 0, 
        borderTopWidth: 0.1, 
        textAlignVertical: 'top' 
    },
    height:{
        height:400
    },
    scrollView: {
        height: 300,
    },
    horizontalScrollView: {
        height: 120,
    },
    attachmentView: {
        flex: 1,
        backgroundColor: '#DDD',
        width: 150,
        marginLeft: 5,
        marginRight: 5,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#DDD'
    },
    attachmentTouch: {
        width: 150,
        height: 120
    }
 });