import React, {Component} from 'react';
import {Text, View, StyleSheet, Dimensions, TouchableHighlight, Image} from 'react-native';

const REQUEST_URL = 'http://elonmusk.quotes/wp-json/quotes/v2/get';

// Setting a windowSize variable to be used in the styles below.
const windowSize = Dimensions.get('window');

export default class ElonQuoteCards extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true
    };
    this.setCard = this.setCard.bind(this);
  }

  getInitialState() {
    return {
      // Card is initially set to null so that the loading message shows.
      quotes: null,
      card: null,
      cardIDs: null,
      quote: null
    };
  }

  componentDidMount() {
    this.getAllPosts();
  }

  getAllPosts() {
    fetch(REQUEST_URL)
      .then((response) => response.json())
      .then((responseData) => {
        responseData.each
        this.setState({
          posts: responseData
        });
      })
      .then(this.setCard)
      .done();
  }

  getRandomQuote() {
    let quote = this.state.posts[Math.floor(Math.random() * this.state.posts.length)];
    if (this.state.quote == quote) {
      quote = this.getRandomQuote();
    } else {
      this.setState({
        quote: quote
      });
    }
    return quote;
  }

  // This is where the magic happens!
  // Fetches the data from the fetched results and update the application state.
  setCard() {
    let quote = this.getRandomQuote();
    this.setState({
      // Set `card` to null when loading new cards ..
      // .. so that the loading message shows.
      card: null,
    });

    console.log(quote)

    // this.setState() will cause the new data to be applied ..
    // .. to the UI that is created by the `render` function
    this.setState({
      card: {
        pic: quote.image,
        content: quote.content
      }
    });
  }

  // Instead of immediately rendering the template, we now check if there is data in the 'card' variable
  // and render a loading view if it's empty, or the 'card' template if there is data.
  render() {
    if (!this.state.card) {
      return this.renderLoadingView();
    }
    return this.renderCard();
  }

  // The loading view template just shows the message "Wait for it..."
  renderLoadingView() {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>
          Loading ...
        </Text>
      </View>
    );
  }

  // This is the original render function, now renamed to renderCard, which will render our main template.
  renderCard() {
    let quote = this.state.card.pic;
    return (
      <View style={styles.container}>

        <View style={styles.imageContainer}>
          <Image style={{width: windowSize.width, height: windowSize.height}} source={{uri: this.state.card.pic}}/>
        </View>
        <View>
          <Text style={styles.text}>{this.state.card.content}</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableHighlight
            style={styles.button}
            underlayColor='#ccc'
            onPress={this.setCard}
          >
            <Text style={styles.buttonText}>Next quote</Text>
          </TouchableHighlight>
        </View>

      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  text: {
    fontSize: 24,
    paddingLeft: 20,
    paddingRight: 20,
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
    backgroundColor: '#FFFFFF',
    opacity: 0.8,
    width: windowSize.width,
  },
  imageContainer: {
    alignItems: 'center',
    flex: 1,
    width: windowSize.width,
    height: windowSize.height,
  },
  buttonContainer: {
    bottom: 0,
    flex: .1,
    width: windowSize.width,
    backgroundColor: '#1488BC',
  },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 30,
    color: '#FFFFFF',
  },
});
