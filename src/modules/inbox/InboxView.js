import React, { PropTypes, Component } from 'react';
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
  Dimensions,
  RefreshControl,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import MessageView from './../../components/Message';
import DrawerView from './../drawer/DrawerView';
import { SwipeListView } from 'react-native-swipe-list-view';
import Icon from 'react-native-vector-icons/Entypo';
import LoadMoreFooter from './../../components/LoadMoreFooter';
import {combineCriteria} from '../../services/mcServices';
import FilterFooterView from '../../components/FilterFooter';

class InboxView extends Component {
  constructor(props) {
    super(props);
    let ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    const data = [];
    this.state = {
      dataSource: ds.cloneWithRows(data),
      criteria: '',
      type: 'Inbox',
      startIndex: 0,
      pageSize: 10,
      onEndReached: false,
      isread : '',
      mark : '',
      filterType:'All'
    }
    this.ds = ds;
    this.closeDrawer = this.closeDrawer.bind(this);
    this.openDrawer = this.openDrawer.bind(this);
    this.transformMessage = this.transformMessage.bind(this);
    this.screenSize = Dimensions.get('window');
    this.renderFooter = this.renderFooter.bind(this);
    //this.toEnd = this.toEnd.bind(this);
    this.searchMessage = this.searchMessage.bind(this);
  }

  static displayName = 'InboxView';

  static navigationOptions = {
    header: {
      style: { height: 0 }
    }
  }

  static propTypes = {
  };

  transformMessage = (currentMessage) => {
    let messageSearchCriteria = combineCriteria(this);
    this.props.InboxStateActions.readMessage(currentMessage.UserMessage,messageSearchCriteria);
    this.props.navigate({ routeName: 'MessageDetailStack', params: {currentMessage,messageSearchCriteria}});
  };

  componentWillReceiveProps(nextProps) {
    try {
      if (nextProps.value !== this.props.value && nextProps.value) {
        this.setState({
          dataSource: this.ds.cloneWithRows(nextProps.value),
          noMoreMessage: (nextProps.value.length - this.props.value.length == 10) || (nextProps.value.length == 10 && this.props.value.length == 10) ? true : false,
        });
      }
    } catch (err) {
      console.log(err)
    }
  }

  componentWillMount() {
    this.props.InboxStateActions.getMessages(this.props.userInfo.Id, 'Inbox');
  }

  closeDrawer() {
    this.refs['DRAWER'].closeDrawer();
  }

  openDrawer() {
    this.refs['DRAWER'].openDrawer();
  }

  deleteMessage(data) {
    let messageSearchCriteria = combineCriteria(this);
    this.props.InboxStateActions.deleteMessage(data.UserMessage,messageSearchCriteria);
  }

  markMessage(currentMessage) {
    let messageSearchCriteria = combineCriteria(this);
    this.props.InboxStateActions.markMessage(currentMessage.UserMessage,messageSearchCriteria);
  }

  searchMessage() {
    let messageSearchCriteria = combineCriteria(this);
    this.props.InboxStateActions.searchMessage(messageSearchCriteria);
  }

  createMessage() {
    let data = {};
    this.props.navigate({ routeName: 'CreateMessageStack', params: data });
  }

  reloadData() {
    let messageSearchCriteria = combineCriteria(this);
    this.props.InboxStateActions.searchMessage(messageSearchCriteria);
  }

  loadMore() {
    let messageLoadMore = {};
    messageLoadMore.UserId = this.props.userInfo.Id;
    messageLoadMore.Type = this.state.type;
    messageLoadMore.Start = 0 || (this.props.value && this.props.value.length);
    messageLoadMore.PageSize = this.state.pageSize;
    messageLoadMore.SearchText = this.state.criteria;
    messageLoadMore.Mark=this.state.mark;
    messageLoadMore.IsRead=this.state.isread;
    this.props.InboxStateActions.loadMoreMessages(messageLoadMore);
  }

  searchMessageByCriteriaAndFilterType(filterType){
    this.state.filterType=filterType;
    switch (filterType) {
      case "All":
          this.state.isread = '';
          this.state.mark = '';
          break;
      case "IsRead":
          this.state.isread = false;
          this.state.mark = "";
          break;
      case "Marked":
          this.state.isread = "";
          this.state.mark = "Marked";
          break;
      default: break;
    }
    let messageSearchCriteria = combineCriteria(this);
    this.props.InboxStateActions.searchMessage(messageSearchCriteria);
  }

  renderFooter() {
    if (this.state.noMoreMessage) {
      return <LoadMoreFooter isLoadAll={true} />
    } else {
      return <LoadMoreFooter />
    }
  }

  render() {
    let navigationView = (
      <DrawerView closeDrawer={this.closeDrawer} navigation={this.props.navigation} navigate={this.props.navigate} />
    );
    return (
      <DrawerLayoutAndroid
        drawerWidth={300}
        drawerPosition={DrawerLayoutAndroid.positions.Left}
        renderNavigationView={() => navigationView}
        ref={'DRAWER'}
        style={{ backgroundColor: '#fff', paddingBottom: 260 }}
      >
        <View style={{ flexDirection: 'row', paddingLeft: 10, paddingRight: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
          <TouchableOpacity onPress={() => { this.openDrawer() }}>
            <Image style={{ width: 30, height: 40 }} source={require('./../../../images/headbar.png')}></Image>
          </TouchableOpacity>
          <View style={{ flex: 1, marginLeft: 20 ,flexDirection:'row',alignItems:'center'}}>
            <Text style={{ fontSize: 18, color: 'black',flex:3 }}>Inbox</Text>
            <View style={{ flex:4,flexDirection:'row'}}>
              <Text style={{fontSize: 12,textAlign:'right',fontWeight:'bold'}}>Welcome, </Text>
              <Text style={{fontSize: 12,textAlign:'right',fontWeight:'bold',color:'#43B1CC'}}>{this.props.userInfo.PersonName}</Text>
            </View>
            
          </View>
          <View style={{}}>
            <TouchableOpacity style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginRight: 7, width: 30 }} onPress={() => { this.createMessage() }}>
              <Icon name='plus' size={20} color={'#33373D'}></Icon>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ flexDirection: 'row', backgroundColor: '#ccc', height: 24, borderRadius: 12, marginLeft: 10, marginRight: 10, marginTop: 6 }}>
          <View style={{ flexDirection: 'row', flex: 3, alignItems: 'center', justifyContent: 'center', }}>
            <TextInput placeholder='Search' style={{ flex: 10, padding: 0, paddingLeft: 10, color: 'black' }} underlineColorAndroid="transparent" value={this.state.criteria}
              onChangeText={(criteria) => this.setState({ criteria })} />
            <TouchableOpacity onPress={() => { this.searchMessage() }}>
              <Icon name='magnifying-glass' size={24}></Icon>
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={false} onRefresh={() => { this.reloadData() }}
            />}>
          <SwipeListView style={{ paddingTop: 10, flex: 1 }}
            dataSource={this.state.dataSource}
            renderRow={(rowData, secId, rowId, rowMap) =>
              <MessageView messageData={rowData} secId={secId} rowId={rowId} rowMap={rowMap} transformMessage={this.transformMessage} />
            }
            renderHiddenRow={
              (rowData, secId, rowId, rowMap) => (
                <View style={styles.rowBack}>
                  <View style={[styles.backRightBtn, styles.backRightBtnLeft]}>
                    <TouchableOpacity onPress={() => { this.markMessage(rowData); rowMap[`${secId}${rowId}`].closeRow() }}>
                      {(rowData.UserMessage && rowData.UserMessage.Mark === 'Marked') ? <Icon name='star' size={20} color={'orange'} /> : <Icon name='star-outlined' size={20} color={'#ccc'} />}
                      <Text style={styles.backRightBtnRightMark}>Mark</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={[styles.backRightBtn, styles.backRightBtnRight]}>
                    <TouchableOpacity onPress={() => { this.deleteMessage(rowData); rowMap[`${secId}${rowId}`].closeRow() }}>
                      <Icon name='trash' size={20} color={'#EE3B3B'} />
                      <Text style={styles.backRightBtnRightDelete}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )
            }
            //onEndReached={()=>{this.searchMessage()}}
            //onEndReachedThreshold={20}         
            rightOpenValue={-150}
            disableRightSwipe
            enableEmptySections={true}
            closeOnRowPress={true}
            closeOnScroll={true}
          //renderFooter={()=>{return this.renderFooter()}}             
          />
          <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center' ,height: 46}} onPress={() => this.loadMore()}>
            {this.props.loadMore ? <Text style={{fontSize:16, color: '#2A83F2', fontFamily: 'sans-serif-condensed'}}>Load more </Text> : <Text style={{color: '#F05D5D',fontSize:16 ,fontFamily: 'sans-serif-condensed'}}>No More Message </Text>}
          </TouchableOpacity>
        </ScrollView>
        <FilterFooterView filterType={this.state.filterType}  searchMessageByCriteriaAndFilterType={(filterType)=>this.searchMessageByCriteriaAndFilterType(filterType)} />
      </DrawerLayoutAndroid>

    );
  }
}

const circle = {
  borderWidth: 0,
  width: 60,
  height: 60,
  borderRadius: 30,
  backgroundColor: 'red',
  justifyContent: 'center',
  alignItems: 'center',
  overflow: 'hidden'
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 10
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
    backgroundColor: '#F5F5F5',
    right: 0
  },
  backRightBtnLeft: {
    backgroundColor: '#F5F5F5',
    right: 75
  },
  backTextWhite: {
    color: '#FFF'
  },
  loadMessage: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  backRightBtnRightDelete: {
    color: '#EE3B3B',
    marginTop: 5,
    fontSize: 12
  },
  backRightBtnRightMark: {
    marginTop: 5,
    fontSize: 12,
    color: '#33373D'
  }
});

export default InboxView;