import React, { Component } from 'react';
import { StyleSheet, Text, Image, FlatList, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { Container, Form, Input, Item, Button, Card, CardItem, Thumbnail, Left, Body, Footer, FooterTab, Header, Content, Spinner, Icon, Picker, Right } from 'native-base';

import { WebBrowser } from 'expo';
import { getStatusBarHeight } from 'react-native-status-bar-height';

import * as firebase from 'firebase';

class DashboardScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      dataSource: null,
      selectedCategory: 'general',
      selectedCountry: 'us',
      word: undefined
    };
  }

  componentWillMount() {
    this.fetchData();
  }

  fetchData = async () => {
    const response = await fetch("https://newsapi.org/v2/top-headlines?country=" + this.state.selectedCountry + "&category=" + this.state.selectedCategory + "&apiKey=7c9fe79304e446e08cd711b6687a86f2");
    const json = await response.json();
    this.setState({
      dataSource: json.articles,
      isLoading: false
    });
  };

  fetchDataWord = async () => {
    console.log(this.state.word);
    const response = await fetch("https://newsapi.org/v2/top-headlines?q=" + this.state.word + "&apiKey=7c9fe79304e446e08cd711b6687a86f2");
    const json = await response.json();
    this.setState({
      dataSource: json.articles,
      isLoading: false
    });
  };

  onCountryChange(value) {
    // eslint-disable-next-line react/no-direct-mutation-state
    this.state.selectedCountry = value;
    this.setState({
      isLoading: true
    });
    this.fetchData();
  }

  onCategoryChange(value) {
    // eslint-disable-next-line react/no-direct-mutation-state
    this.state.selectedCategory = value;
    this.setState({
      isLoading: true
    });
    this.fetchData();
  }

  onWordChange(text) {
    // eslint-disable-next-line react/no-direct-mutation-state
    this.setState({
      isLoading: true
    });
    this.fetchDataWord();
  }

  onRefresh = () => {
    this.fetchData();
  }

  _handlePressButtonAsync = async (url) => {
    let result = await WebBrowser.openBrowserAsync(url);
  };

  render() {
    if (this.state.isLoading) {
      return (
        <Container style={styles.container}>
          <Spinner color='black' />
        </Container>
      );
    }
    else {
      return (
        <Container style={styles.container}>
          <Header style={{ paddingTop: getStatusBarHeight(), backgroundColor: 'black', height: 54 + getStatusBarHeight() }} androidStatusBarColor='black' searchBar full>
            <Item style={{ flex: 4 }}>
              <Icon name="ios-search" />
              <Input placeholder="Search" onChangeText={(text) => { console.log(text); this.setState({ word: text }); }} />
              <Icon name="paper" />
            </Item>
            <Right>
              <Button style={{ flex: 1, alignItems: 'center', alignContent: 'center', justifyContent: 'center' }} transparent onPress={this.onWordChange.bind(this)}>
                <Text style={{ color: 'white', fontSize: 15 }}>Search</Text>
              </Button>
            </Right>
          </Header>
          <ScrollView
              refreshControl={
              <RefreshControl
                  refreshing={this.state.isLoading}
                  onRefresh={this.onRefresh}
              />
            }
          >
            <Content>
              <Picker
                  selectedValue={this.state.selectedCountry}
                  mode="dropdown"
                  iosHeader="Countries"
                  Header="Countries"
                  placeholder="Select a country"
                  iosIcon={<Icon name="arrow-down" />}
                  style={{ width: undefined, padding: 10 }}
                  onValueChange={this.onCountryChange.bind(this)}
              >
                <Picker.Item label="Argentina" value="ar" />
                <Picker.Item label="Australia" value="au" />
                <Picker.Item label="Canada" value="ca" />
                <Picker.Item label="China" value="cn" />
                <Picker.Item label="Egypt" value="eg" />
                <Picker.Item label="France" value="fr" />
                <Picker.Item label="Germany" value="de" />
                <Picker.Item label="Turkey" value="tr" />
                <Picker.Item label="United Kingdom" value="gb" />
                <Picker.Item label="United States" value="us" />
              </Picker>
              <Picker
                  mode="dropdown"
                  iosHeader="Categories"
                  Header="Categories"
                  placeholder="Select a category"
                  iosIcon={<Icon name="arrow-down" />}
                  style={{ width: undefined, padding: 10 }}
                  selectedValue={this.state.selectedCategory}
                  onValueChange={this.onCategoryChange.bind(this)}
              >
                <Picker.Item label="Business" value="business" />
                <Picker.Item label="Entertainment" value="entertainment" />
                <Picker.Item label="General" value="general" />
                <Picker.Item label="Health" value="health" />
                <Picker.Item label="Science" value="science" />
                <Picker.Item label="Sports" value="sports" />
                <Picker.Item label="Technology" value="technology" />
              </Picker>
              <Form style={{ padding: 10 }}>
                <FlatList
                    data={this.state.dataSource}
                    keyExtractor={(_item, index) => index.toString()}
                    renderItem={
                    ({ item }) =>
                      // eslint-disable-next-line no-extra-parens
                      (<TouchableOpacity activeOpacity={1} onPress={() => this._handlePressButtonAsync(item.url)}>
                        <Card style={{ flex: 0 }}>
                          <CardItem>
                            <Left>
                              <Thumbnail source={require('../assets/icon.png')} />
                              <Body>
                                <Text style={{ fontWeight: 'bold' }}>{item.title}</Text>
                                <Text note>{item.source.name}</Text>
                              </Body>
                            </Left>
                          </CardItem>
                          <CardItem>
                            <Body>
                              <Image source={{ uri: item.urlToImage }} style={{ height: 220, width: '100%', flex: 1 }} />
                              <Text>
                                {'\n' + item.description}
                              </Text>
                            </Body>
                          </CardItem>
                        </Card>
                      </TouchableOpacity>)
                  }
                />
              
              <Footer>
                <FooterTab>
                  <Button full dark onPress={() => firebase.auth().signOut()}>
                    <Text style={{ color: 'white' }}>Sign Out</Text>
                  </Button>
                </FooterTab>
              </Footer>
              </Form>
            </Content>
          </ScrollView>
        </Container>
      );
    }
  }
}

export default DashboardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    height: '100%',
    width: '100%'
  }
});