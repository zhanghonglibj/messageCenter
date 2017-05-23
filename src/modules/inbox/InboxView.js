import React, {PropTypes, Component} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Button,
  Image,
  Text,
  View,
  ListView,
  TextInput,
  Picker,
  DrawerLayoutAndroid,
  Alert,
  Dimensions
} from 'react-native';
import MessageView from './../../components/Message';
import DrawerView from './../drawer/DrawerView'; 
import {SwipeListView, SwipeRow} from 'react-native-swipe-list-view';
import Icon from 'react-native-vector-icons/Entypo';

class InboxView extends Component {
  constructor(props) {
  super(props);
  var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
  const data=[
    {Message:{From:{Id:'Xiang Zhang',PersonName:'Xiang Zhang'},Subject:'111',MessageBody:'<p>111</p>'}},
    {Message:{From:{Id:'Xiang Zhang',PersonName:'Xiang Zhang'},Subject:'222',MessageBody:'<p>222</p>'}}]
  this.state = {
    dataSource: ds.cloneWithRows(data),
     criteria:'',
     userId:'Xiang Zhang',
     type:'Inbox',
     startIndex:0,
     pageSize:10
  };
  this.ds=ds;
  this.closeDrawer = this.closeDrawer.bind(this);
  this.openDrawer = this.openDrawer.bind(this);
  this.transformMessage = this.transformMessage.bind(this);
  this.screenSize = Dimensions.get('window');
}
  static displayName = 'InboxView';

  static navigationOptions = {
    header:{
      style:{height:0}
    }
  }

  static propTypes = {
  };

  transformMessage = (currentMessage) => {
    this.props.InboxStateActions.readMessage(currentMessage.UserMessage);
    this.props.navigate({routeName: 'MessageDetailStack',params:currentMessage,action:this.props.InboxStateActions.getMessages('Xiang Zhang','Inbox')});
  };

  componentWillReceiveProps(nextProps) {
    try{
      if (nextProps.value !== this.props.value && nextProps.value) {
      this.setState({
        dataSource: this.ds.cloneWithRows(nextProps.value)
      });
    }
    }catch(err){
      console.log(err)
    }
  }

  componentWillMount(){
    this.props.InboxStateActions.getMessages('Xiang Zhang','Inbox');
  }

   closeDrawer(){
        this.refs['DRAWER'].closeDrawer();
    }

  openDrawer(){    
    this.refs['DRAWER'].openDrawer();
  }

  deleteMessage(data){
   this.props.InboxStateActions.deleteMessage(data.UserMessage);
  }

  markMessage(currentMessage){
    this.props.InboxStateActions.markMessage(currentMessage.UserMessage);
  }

  searchMessage(){
    let messageSearchCriteria={};
    messageSearchCriteria.SearchText=this.state.criteria;
    messageSearchCriteria.Type=this.state.type;
    messageSearchCriteria.UserId=this.state.userId;
    messageSearchCriteria.Start=this.state.startIndex;
    messageSearchCriteria.PageSize=this.state.pageSize;
    console.log(messageSearchCriteria);
    this.props.InboxStateActions.searchMessage(messageSearchCriteria);
   }

  createMessage(){
    let data={};
    this.props.navigate({routeName: 'CreateMessageStack',params:data});
  }

  render() {
    var navigationView =(
      <DrawerView closeDrawer={this.closeDrawer} navigate={this.props.navigate}/>
    );

    return (
      <DrawerLayoutAndroid
        drawerWidth={300}
        drawerPosition={DrawerLayoutAndroid.positions.Left}
        renderNavigationView={()=>navigationView}
        ref={'DRAWER'}
      >
        <View style={{flexDirection:'row',paddingLeft:10,paddingRight:10,borderBottomWidth:1,borderBottomColor:'#ccc'}}>
          <TouchableOpacity onPress={()=>{this.openDrawer()}}>
            <Image style={{width: 30,height: 40}}source={require('./../../../images/headbar.png')}></Image>
          </TouchableOpacity>
          <View style={{flex:1,marginLeft:20}}>
            <Text style={{fontSize:18,color:'black'}}>Inbox</Text>
            <Text style={{fontSize:12}}>welcome,Xiang Zhang</Text>
          </View>
        </View>
        <View style={{flexDirection:'row',backgroundColor:'white',height:24,borderRadius:12,marginLeft:10,marginRight:10,marginTop:6}}>
          <View style={{flexDirection:'row',flex:3,alignItems: 'center',justifyContent: 'center',}}>
            <TextInput placeholder='Search' style={{flex:10,padding: 0,paddingLeft:10,color:'black'}} underlineColorAndroid="transparent" value={this.state.criteria} onChangeText={(criteria) => this.setState({criteria})}/>
             <TouchableOpacity onPress={()=>{this.searchMessage()}}>
               <Icon name='magnifying-glass' size={24}></Icon>
             </TouchableOpacity>
          </View>

        </View>
        <SwipeListView style={{paddingTop:10}}
          dataSource={this.state.dataSource}
          renderRow={(rowData, secId, rowId, rowMap) =>           
             <MessageView  messageData={rowData} secId={secId} rowId={rowId} rowMap={rowMap}  transformMessage={this.transformMessage} />
          }
          renderHiddenRow={
            (rowData,secId,rowId,rowMap) =>(
              <View style={styles.rowBack}>
                <View style={[styles.backRightBtn, styles.backRightBtnLeft]}>
                  <TouchableOpacity onPress={_=> rowMap[`${secId}${rowId}`].closeRow()}><Text>Right</Text></TouchableOpacity>
                </View>
                <TouchableOpacity style={[styles.backRightBtn, styles.backRightBtnRight]} 
                onPress={()=>{this.deleteMessage(rowData);rowMap[`${secId}${rowId}`].closeRow()}}>
                  <Text>Delete</Text>
                </TouchableOpacity>
              </View>
            )
          }
          rightOpenValue={-150} 
          disableRightSwipe   
          enableEmptySections={true}  
          closeOnRowPress={true}             
        />
        {this.props.value.length?null:<Text style={{position:'absolute',opacity:0.8,top:this.screenSize.height/2,left:40,right:0}}>No Messages match the criteria</Text>}
        <View style={{flexDirection:'row',height:30,borderRadius:15,marginLeft:40,marginRight:40,backgroundColor:'white',position:'absolute',opacity:0.8,top:this.screenSize.height-60,left:0,right:0}}>
            <TouchableOpacity style={{flex:1,alignItems:'center'}} onPress={()=>{this.createMessage()}}>
              <Icon name='plus' size={14}></Icon>
              <Text>New</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{flex:1,alignItems:'center'}}>
              <Icon name='magnifying-glass' size={14}></Icon>
              <Text>Search</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{flex:1,alignItems:'center'}}>
              <Icon name='dots-three-vertical' size={14}></Icon>
              <Text>More</Text>
            </TouchableOpacity>
        </View>
      </DrawerLayoutAndroid>
      
    );
  }
}

const circle = {
  borderWidth: 0,
  width: 60,
  height: 60,
  borderRadius: 30,
  backgroundColor:'red',
  justifyContent:'center',
  alignItems:'center',
  overflow:'hidden'
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop:10
  },
  userContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  userProfilePhoto: {
    ...circle,
    alignSelf: 'center'
  },
  counterButton: {
    ...circle,
    backgroundColor: '#349d4a',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20
  },
  counter: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center'
  },
  welcome: {
    textAlign: 'center',
    color: 'black',
    marginBottom: 5,
    padding: 5
  },
  linkButton: {
    textAlign: 'center',
    color: '#CCCCCC',
    marginBottom: 10,
    padding: 5
  },
  rowBack: {
		alignItems: 'center',
		backgroundColor: '#DDD',
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingLeft: 15,
	},
  backRightBtn: {
		alignItems: 'center',
		bottom: 0,
		justifyContent: 'center',
		position: 'absolute',
		top: 0,
		width: 75
	},
  backRightBtnRight: {
		backgroundColor: 'red',
		right: 0
	},
  backRightBtnLeft: {
		backgroundColor: 'blue',
		right: 75
	},
  backTextWhite: {
		color: '#FFF'
	}
});

export default InboxView;